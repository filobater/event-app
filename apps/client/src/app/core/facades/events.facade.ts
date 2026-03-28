import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { defer, firstValueFrom, forkJoin, from, map, of, switchMap, type Observable } from 'rxjs';
import { EventsApiService, CacheService, UploadService, ToastService } from 'src/app/core/services';
import { RequestStateClass } from 'src/app/core/request-state';
import type {
  CreateEventRequestDto,
  EventDto,
  SpeakerDto,
  UpdateEventRequestDto,
} from '@events-app/shared-dtos';

export type SaveEventOptions = {
  onSuccess?: (event: EventDto) => void;
  onMediaUrlsApplied?: (patch: { photo?: string; speakers?: SpeakerDto[] }) => void;
};

@Injectable({ providedIn: 'root' })
export class EventsFacade {
  private readonly api = inject(EventsApiService);
  private readonly cache = inject(CacheService);
  private readonly uploadService = inject(UploadService);
  private readonly toastService = inject(ToastService);
  private readonly injector = inject(Injector);
  private readonly cacheNamespace = 'events';

  private _eventsResource?: ReturnType<EventsApiService['getAllEvents']>;

  get eventsResource() {
    this._eventsResource ??= runInInjectionContext(this.injector, () => this.api.getAllEvents());
    return this._eventsResource;
  }

  readonly loadEventState = new RequestStateClass();
  readonly mutationState = new RequestStateClass();
  readonly uploadState = new RequestStateClass();
  readonly event = signal<EventDto | null>(null);

  loadEvent(id: string | null): void {
    this.loadEventState.reset();

    if (!id) {
      this.event.set(null);
      return;
    }

    const cached = this.cache.get<EventDto>(this.cacheNamespace, id);
    if (cached) {
      this.event.set(cached);
      this.loadEventState.success();
      return;
    }

    this.event.set(null);
    this.loadEventState.start();

    this.api.getEvent(id).subscribe({
      next: (res) => {
        this.loadEventState.success();
        this.cache.set(this.cacheNamespace, id, res.data.event);
        this.event.set(res.data.event);
      },
      error: (err) => this.loadEventState.fail(err),
    });
  }

  saveEvent(
    event: CreateEventRequestDto | UpdateEventRequestDto,
    options?: SaveEventOptions,
  ): void {
    const id = (event as UpdateEventRequestDto)?._id;
    if (id) {
      this.updateEvent(id, event, options);
    } else {
      this.createEvent(event as CreateEventRequestDto, options);
    }
  }

  createEvent(data: CreateEventRequestDto, options?: SaveEventOptions): void {
    this.buildEventMutation$(
      data,
      (payload) => this.api.createEvent(payload as CreateEventRequestDto),
      options,
    ).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, res.data.event._id, res.data.event);
        this.eventsResource.addItem(res.data.event);
        options?.onSuccess?.(res.data.event);
      },
      error: (err) => this.handleEventSaveError(err),
    });
  }

  updateEvent(id: string, data: UpdateEventRequestDto, options?: SaveEventOptions): void {
    this.buildEventMutation$(
      data,
      (payload) => this.api.updateEvent(id, payload as UpdateEventRequestDto),
      options,
    ).subscribe({
      next: (res) => {
        this.mutationState.success(res.message);
        this.cache.set(this.cacheNamespace, id, res.data.event);
        this.eventsResource.updateItem(id, res.data.event);
        options?.onSuccess?.(res.data.event);
      },
      error: (err) => this.handleEventSaveError(err),
    });
  }

  private resolveEventMediaUploadStreams(data: CreateEventRequestDto | UpdateEventRequestDto): {
    rawSpeakers: CreateEventRequestDto['speakers'] | undefined;
    speakersList: SpeakerDto[];
    needsUpload: boolean;
    photo$: Observable<string | undefined>;
    speakerUrls$: Observable<string[]>;
  } {
    const eventPhoto = data.photo as unknown;
    const rawSpeakers = data.speakers;
    const speakersList = (rawSpeakers ?? []) as SpeakerDto[];
    const imageSlots = speakersList.map((s) => s.image);
    const needsUpload =
      eventPhoto instanceof File ||
      (rawSpeakers !== undefined && imageSlots.some((img) => img instanceof File));

    const photo$ =
      eventPhoto instanceof File
        ? this.uploadService.uploadSingle(eventPhoto, 'eventPhoto').pipe(map((r) => r.data.url))
        : of(eventPhoto as string | undefined);

    const speakerFiles = imageSlots.filter((img): img is File => img instanceof File);
    const speakerUrls$ =
      speakerFiles.length === 0
        ? of(imageSlots.map((img) => img as string))
        : this.uploadService.uploadMultiple(speakerFiles, 'speakerImage').pipe(
            map((res) => {
              let urlIdx = 0;
              return imageSlots.map((img) =>
                img instanceof File ? res.data.urls[urlIdx++]! : (img as string),
              );
            }),
          );

    return { rawSpeakers, speakersList, needsUpload, photo$, speakerUrls$ };
  }

  private buildEventMutation$(
    data: CreateEventRequestDto | UpdateEventRequestDto,
    apiCall: (
      payload: CreateEventRequestDto | UpdateEventRequestDto,
    ) => ReturnType<EventsApiService['createEvent']> | ReturnType<EventsApiService['updateEvent']>,
    options?: SaveEventOptions,
  ) {
    return defer(() => {
      const { rawSpeakers, speakersList, needsUpload, photo$, speakerUrls$ } =
        this.resolveEventMediaUploadStreams(data);

      if (!needsUpload) {
        this.mutationState.start();
        return apiCall(data);
      }

      this.uploadState.start();
      const upload$ = forkJoin({ photo: photo$, speakerImageUrls: speakerUrls$ });
      const uploadPromise = firstValueFrom(upload$);
      this.toastService.promise(uploadPromise, {
        loading: 'Uploading images...',
        success: 'Images uploaded successfully',
      });

      return from(uploadPromise).pipe(
        switchMap(({ photo, speakerImageUrls: urls }) => {
          const speakersMerged: SpeakerDto[] = speakersList.map((s, i) => ({
            name: s.name,
            title: s.title,
            image: urls[i] ?? (typeof s.image === 'string' ? s.image : ''),
          }));

          options?.onMediaUrlsApplied?.({
            ...(photo !== undefined && { photo }),
            ...(rawSpeakers !== undefined && { speakers: speakersMerged }),
          });
          this.uploadState.success();
          this.mutationState.start();

          const payload = {
            ...data,
            photo,
          };

          if (rawSpeakers !== undefined) {
            payload.speakers = speakersMerged;
          }

          return apiCall(payload);
        }),
      );
    });
  }

  private handleEventSaveError(err: HttpErrorResponse): void {
    if (this.uploadState.loading()) {
      this.uploadState.fail(err, { differentToast: true });
    } else {
      this.mutationState.fail(err);
    }
  }

  deleteEvent(id: string, onSuccess?: () => void): void {
    this.mutationState.start();
    this.api.deleteEvent(id).subscribe({
      next: () => {
        this.mutationState.success('Event deleted successfully');
        this.cache.delete(this.cacheNamespace, id);
        this.eventsResource.removeItem(id);
        onSuccess?.();
      },
      error: (err) => this.mutationState.fail(err),
    });
  }
}
