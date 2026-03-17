import { Component, computed, input, output, TemplateRef, viewChild } from '@angular/core';
import { DatePipe, TitleCasePipe, CurrencyPipe } from '@angular/common';
import { EventDto } from '@events-app/shared-dtos';
import AdminTableComponent, {
  ColumnDef,
  HeaderContext,
  PaginationOptions,
} from '../../../ui/table/table.component';
import { BadgeComponent } from 'src/app/shared/components';
import SortButtonComponent from '../../../ui/sort-button/sort-button.component';
import type { SortParams } from '../../../types/sort-params.type';
import { Eye, Pencil, Trash, LucideAngularModule, Shield } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NAV } from 'src/app/core';

@Component({
  selector: 'app-events-table',
  standalone: true,
  templateUrl: './events-table.component.html',
  imports: [
    AdminTableComponent,
    BadgeComponent,
    CurrencyPipe,
    TitleCasePipe,
    DatePipe,
    SortButtonComponent,
    LucideAngularModule,
    RouterLink,
  ],
})
export default class EventsTableComponent {
  readonly baseUrl = environment.apiUrl;
  readonly nav = NAV;

  eventTemplate = viewChild<TemplateRef<{ $implicit: EventDto }>>('eventTemplate');
  dateTemplate = viewChild<TemplateRef<{ $implicit: EventDto }>>('dateTemplate');
  categoryTemplate = viewChild<TemplateRef<{ $implicit: EventDto }>>('categoryTemplate');
  statusTemplate = viewChild<TemplateRef<{ $implicit: EventDto }>>('statusTemplate');
  seatsTemplate = viewChild<TemplateRef<{ $implicit: EventDto }>>('seatsTemplate');
  priceTemplate = viewChild<TemplateRef<{ $implicit: EventDto }>>('priceTemplate');
  actionsTemplate = viewChild<TemplateRef<any>>('actionsTemplate');
  sortableHeader = viewChild<TemplateRef<HeaderContext<EventDto>>>('sortableHeader');

  // icons
  readonly EditIcon = Pencil;
  readonly DeleteIcon = Trash;
  readonly EyeIcon = Eye;
  readonly ShieldIcon = Shield;

  events = input.required<EventDto[]>();
  paginationOptions = input<PaginationOptions>();

  readonly columns = computed<ColumnDef<EventDto & { actions?: TemplateRef<any> }>[]>(() => [
    {
      label: 'Event',
      key: 'title',
      cellTemplate: this.eventTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    {
      label: 'Date',
      key: 'dateTime',
      headerTemplate: this.sortableHeader(),
      cellTemplate: this.dateTemplate(),
    },
    {
      label: 'Category',
      key: 'category',
      cellTemplate: this.categoryTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    {
      label: 'Seats',
      key: 'registeredSeats',
      cellTemplate: this.seatsTemplate(),
    },
    {
      label: 'Price',
      key: 'price',
      cellTemplate: this.priceTemplate(),
      headerTemplate: this.sortableHeader(),
    },

    {
      label: 'Status',
      key: 'status',
      cellTemplate: this.statusTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    {
      label: 'Created At',
      key: 'createdAt',
      cellTemplate: this.dateTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    {
      label: 'Actions',
      key: 'actions',
      cellTemplate: this.actionsTemplate(),
    },
  ]);

  sort = output<SortParams>();

  handleSort(params: SortParams) {
    if (this.events().length === 0) return;
    this.sort.emit(params);
  }

  // handleActions(action: ModalType, userId: string) {
  //   this.openModal.emit({
  //     modal: action,
  //     userId: userId,
  //   });
  // }
}
