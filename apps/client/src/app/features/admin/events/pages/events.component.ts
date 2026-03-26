import { ChangeDetectionStrategy, Component, effect, inject, signal, viewChild } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, Plus } from 'lucide-angular';
import {
  ErrorMessageComponent,
  AlertModalComponent,
  ModalComponent,
  PrimaryButtonComponent,
  SearchInputComponent,
} from 'src/app/shared/components';
import EventsTableComponent from '../components/events-table/events-table.component';
import { AdminLoadingComponent } from '../../components';
import type { ModalType } from '../../types/modal.type';
import type { SortParams } from '../../types/sort-params.type';
import EventFormComponent from '../components/event-form/event-form.component';
import { CreateEventRequestDto, UpdateEventRequestDto } from '@events-app/shared-dtos';
import { EventsFacade } from 'src/app/core/facades/events.facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly EventsIcon = LayoutDashboard;
  readonly PlusIcon = Plus;

  private readonly eventFormRef = viewChild(EventFormComponent);
  readonly resetEventForm = () => {
    this.eventFormRef()?.eventForm?.reset();
    const formSpeakers = this.eventFormRef()?.formData.speakers;
    formSpeakers?.clear();
    formSpeakers?.push(this.eventFormRef()?.createSpeakerGroup());
  };

  readonly eventsFacade = inject(EventsFacade);
  readonly eventsResource = this.eventsFacade.eventsResource;

  selectedEventId = signal<string | null>(null);
  modals = signal({ add: false, edit: false, delete: false, view: false });

  constructor() {
    effect(() => {
      const id = this.selectedEventId();
      this.eventsFacade.loadEvent(!id || this.modals().delete ? null : id);
    });
  }

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

  handleSaveEvent(event: CreateEventRequestDto | UpdateEventRequestDto) {
    if ('_id' in event) {
      this.eventsFacade.updateEvent(event._id as string, event, () => {
        this.handleCloseModal('edit');
        this.resetEventForm();
      });
    } else {
      this.eventsFacade.createEvent(event as CreateEventRequestDto, () => {
        this.handleCloseModal('add');
        this.resetEventForm();
      });
    }
  }

  handleDeleteConfirm() {
    const id = this.selectedEventId();
    if (!id) return;
    this.eventsFacade.deleteEvent(id, () => {
      this.handleCloseModal('delete');
    });
  }
}
