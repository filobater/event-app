import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ImageUploadComponent,
  NumberInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
  SelectInputComponent,
  SecondaryButtonComponent,
  TextareaComponent,
  TextInputComponent,
  DatetimeInputComponent,
} from 'src/app/shared/components';
import {
  CreateEventRequestDto,
  EventDto,
  SpeakerDto,
  UpdateEventRequestDto,
} from '@events-app/shared-dtos';
import { RequestStateClass } from 'src/app/core/request-state';
import { getDirtyFields } from 'src/app/shared/utils/get-dirty-fields.utils';
import { getValidationErrorMessage } from 'src/app/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event-form',
  standalone: true,
  imports: [
    TextInputComponent,
    TextareaComponent,
    NumberInputComponent,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ImageUploadComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    SecondaryButtonComponent,
    DatetimeInputComponent,
  ],
  templateUrl: './event-form.component.html',
})
export default class EventFormComponent {
  private fb = inject(FormBuilder);
  requestState = input<RequestStateClass>();
  event = input<EventDto | null>(null);
  isEdit = computed(() => !!this.event());
  closed = output<void>();
  onSave = output<CreateEventRequestDto | UpdateEventRequestDto>();

  readonly categoryOptions = [
    { label: 'Technology', value: 'technology' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
  ];

  readonly statusOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
  ];

  eventForm = this.fb.nonNullable.group({
    photo: [null as string | null, [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    category: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    dateTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    totalSeats: [10, [Validators.required, Validators.min(10)]],
    price: [0, [Validators.required, Validators.min(0)]],
    location: ['', [Validators.required, Validators.minLength(10)]],
    status: ['' as 'ongoing' | 'upcoming' | 'completed' | '', [Validators.required]],
    speakers: this.fb.array(
      [this.createSpeakerGroup()],
      [Validators.required, Validators.maxLength(2)],
    ),
  });

  constructor() {
    effect(() => {
      if (this.isEdit()) {
        const event = this.event();
        if (!event) return;

        const speakers = event.speakers ?? [];
        const formSpeakers = this.formData.speakers;

        // Clear and re-populate FormArray to match event's speakers length
        formSpeakers.clear();
        speakers.forEach((speaker: SpeakerDto) => {
          formSpeakers.push(this.createSpeakerGroup(speaker));
        });

        // Patch all non-array fields
        const { speakers: _, ...eventWithoutSpeakers } = event;
        // Offset the date by timezone to keep local time
        const localDateTime = this.getLocalDateTime(event.dateTime);
        const localEndTime = this.getLocalDateTime(event.endTime);
        this.eventForm.patchValue({
          ...eventWithoutSpeakers,
          dateTime: localDateTime,
          endTime: localEndTime,
        });
      } else {
        const formSpeakers = this.formData.speakers;
        formSpeakers.clear();
        formSpeakers.push(this.createSpeakerGroup());
        this.eventForm.reset();
      }
    });
  }

  getLocalDateTime(dateTime: string) {
    const date = new Date(dateTime);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }

  createSpeakerGroup(speaker?: SpeakerDto): FormGroup {
    return this.fb.group({
      name: [speaker?.name ?? '', [Validators.required, Validators.minLength(3)]],
      title: [speaker?.title ?? '', [Validators.required, Validators.minLength(3)]],
      image: [speaker?.image ?? null, [Validators.required]],
    });
  }

  get formData() {
    return {
      photo: this.eventForm.get('photo'),
      title: this.eventForm.get('title'),
      category: this.eventForm.get('category'),
      description: this.eventForm.get('description'),
      dateTime: this.eventForm.get('dateTime'),
      endTime: this.eventForm.get('endTime'),
      totalSeats: this.eventForm.get('totalSeats'),
      status: this.eventForm.get('status'),
      price: this.eventForm.get('price'),
      location: this.eventForm.get('location'),
      speakers: this.eventForm.get('speakers') as FormArray,
    };
  }

  protected getValidationErrorMessage = getValidationErrorMessage;

  getSpeakerGroup(index: number): FormGroup {
    return this.formData.speakers?.at(index) as FormGroup;
  }

  handleAddSpeaker() {
    if (this.formData.speakers?.length >= 2) return;
    this.formData.speakers.push(this.createSpeakerGroup());
  }

  handleRemoveSpeaker(index: number) {
    if (this.formData.speakers?.length <= 1) return;
    this.formData.speakers?.removeAt(index);
  }

  handleCancel() {
    this.eventForm.reset();
    const formSpeakers = this.formData.speakers;
    formSpeakers.clear();
    formSpeakers.push(this.createSpeakerGroup());
    this.closed.emit();
  }

  handleSpeakerData() {
    return {
      speakerImages: this.formData.speakers
        ?.getRawValue()
        .map((speaker: SpeakerDto) => speaker.image),
      speakers: this.formData.speakers?.getRawValue().map((speaker: SpeakerDto) => ({
        name: speaker.name,
        title: speaker.title,
      })),
    };
  }

  handleSubmit() {
    const { speakers, ...eventData } = this.eventForm.value;
    const dataToSend = {
      ...eventData,
      totalSeats: Number(eventData.totalSeats),
      price: Number(eventData.price),
      speakers: JSON.stringify(this.handleSpeakerData().speakers),
      speakerImages: this.handleSpeakerData().speakerImages,
    };
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    if (this.isEdit()) {
      const dirtyFields = getDirtyFields(this.eventForm);
      if (dirtyFields['speakers']) {
        const filterSpeakerImages = this.handleSpeakerData().speakerImages.filter(
          (image: File | string) => typeof image !== 'string',
        );
        dirtyFields['speakers'] = JSON.stringify(dirtyFields['speakers']);
        dirtyFields['speakerImages'] = filterSpeakerImages;
      }
      this.onSave.emit({ ...dirtyFields, _id: this.event()?._id } as UpdateEventRequestDto);
    } else {
      this.onSave.emit(dataToSend as CreateEventRequestDto);
    }
  }
}
