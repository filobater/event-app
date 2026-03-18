import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, Plus } from 'lucide-angular';
import {
  ErrorMessageComponent,
  AlertModalComponent,
  ModalComponent,
  PrimaryButtonComponent,
  SearchInputComponent,
} from 'src/app/shared/components';
import { EventsApiService } from 'src/app/core/services/events-api.service';
import EventsTableComponent from '../components/events-table/events-table.component';
import AdminLoadingComponent from '../../ui/loading/loading.component';
import type { ModalType } from '../../types/modal.type';
import type { SortParams } from '../../types/sort-params.type';
import EventFormComponent from '../components/event-form/event-form.component';
import { RequestStateClass } from 'src/app/core/request-state';
import { CreateEventRequestDto, EventDto, UpdateEventRequestDto } from '@events-app/shared-dtos';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    LucideAngularModule,
    SearchInputComponent,
    PrimaryButtonComponent,
    EventsTableComponent,
    AdminLoadingComponent,
    ModalComponent,
    EventFormComponent,
    AlertModalComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './events.component.html',
})
export default class EventsComponent {
  // icons
  readonly EventsIcon = LayoutDashboard;
  readonly PlusIcon = Plus;

  private readonly eventFormRef = viewChild(EventFormComponent);
  readonly resetEventForm = () => {
    this.eventFormRef()?.eventForm?.reset();
    const formSpeakers = this.eventFormRef()?.formData.speakers;
    formSpeakers?.clear();
    formSpeakers?.push(this.eventFormRef()?.createSpeakerGroup());
  };

  private eventsApiService = inject(EventsApiService);

  readonly getEventRequestState = new RequestStateClass();
  readonly mutationRequestState = new RequestStateClass();

  readonly eventsResource = this.eventsApiService.getAllEvents();

  eventSelected = signal<EventDto | null>(null);
  selectedEventId = signal<string | null>(null);
  constructor() {
    effect(() => {
      const id = this.selectedEventId();

      this.eventSelected.set(null);

      if (!id) return;
      if (this.modals().delete) return;
      this.getEventRequestState.start();
      this.eventsApiService.getEvent(id).subscribe({
        next: (response) => {
          this.getEventRequestState.success();
          this.eventSelected.set(response.data.event);
        },
        error: (error) => {
          this.getEventRequestState.fail(error);
          this.eventSelected.set(null);
        },
      });
    });
  }

  modals = signal({
    add: false,
    edit: false,
    delete: false,
    view: false,
  });

  handleSearch(search: string) {
    if (this.eventsResource.resource.value()?.data?.events?.length === 0) return;
    this.eventsResource.setSearch(search);
  }

  handleSort(params: SortParams) {
    this.eventsResource.setSort(params);
  }

  handleOpenModal(modal: ModalType) {
    this.modals.update((m) => ({ ...m, [modal]: true }));
  }

  handleCloseModal(modal: ModalType) {
    this.modals.update((m) => ({ ...m, [modal]: false }));
    if (modal !== 'add') this.selectedEventId.set(null);
  }

  handleTableAction(modal: ModalType, eventId: string) {
    this.selectedEventId.set(eventId);
    this.handleOpenModal(modal);
  }

  handleCreateEvent(event: CreateEventRequestDto) {
    this.eventsApiService.createEvent(event).subscribe({
      next: (response) => {
        this.mutationRequestState.success(response.message);
        this.handleCloseModal('add');
        this.eventsResource.addItem(response.data.event);
        this.resetEventForm();
      },
      error: (error) => {
        this.mutationRequestState.fail(error);
      },
    });
  }

  handleUpdateEvent(id: string, event: UpdateEventRequestDto) {
    this.eventsApiService.updateEvent(id, event).subscribe({
      next: (response) => {
        this.mutationRequestState.success(response.message);
        this.handleCloseModal('edit');
        this.eventsResource.updateItem(id, response.data.event);
        this.resetEventForm();
      },
      error: (error) => {
        this.mutationRequestState.fail(error);
      },
    });
  }

  handleSaveEvent(event: CreateEventRequestDto | UpdateEventRequestDto) {
    this.mutationRequestState.start();
    if ('_id' in event) {
      this.handleUpdateEvent(event._id as string, event);
    } else {
      this.handleCreateEvent(event as CreateEventRequestDto);
    }
  }

  handleDeleteEvent(eventId: string) {
    this.mutationRequestState.start();
    this.eventsApiService.deleteEvent(eventId).subscribe({
      next: () => {
        this.mutationRequestState.success('Event deleted successfully');
        this.handleCloseModal('delete');
        this.eventsResource.removeItem(eventId);
      },
      error: (error) => {
        this.mutationRequestState.fail(error);
      },
    });
  }

  handleDeleteConfirm() {
    const id = this.selectedEventId();
    if (id) this.handleDeleteEvent(id);
  }
}
