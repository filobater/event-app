import { Component, inject, signal, viewChild } from '@angular/core';
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
import { CreateEventRequestDto, UpdateEventRequestDto } from '@events-app/shared-dtos';

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
    // AlertModalComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './events.component.html',
})
export default class EventsComponent {
  // icons
  readonly EventsIcon = LayoutDashboard;
  readonly PlusIcon = Plus;

  private readonly eventFormRef = viewChild(EventFormComponent);
  readonly resetEventForm = () => this.eventFormRef()?.eventForm?.reset();

  private eventsApiService = inject(EventsApiService);

  readonly mutationRequestState = new RequestStateClass();

  readonly eventsResource = this.eventsApiService.getAllEvents();

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
    // if (modal !== 'add') this.selectedUserId.set(null);
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
}
