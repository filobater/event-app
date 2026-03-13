import { Component, computed, input, output, TemplateRef, viewChild } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { UserDto } from '@events-app/shared-dtos';
import AdminTableComponent, { ColumnDef, HeaderContext } from '../../../ui/table/table.component';
import { AvatarComponent, BadgeComponent } from 'src/app/shared/components';
import SortButtonComponent from '../../../ui/sort-button/sort-button.component';
import { SortParams } from 'src/app/shared/utils/create-paginated-resource.utils';
import { Eye, Pencil, Trash, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-table',
  standalone: true,
  templateUrl: './user-table.component.html',
  imports: [
    AdminTableComponent,
    AvatarComponent,
    BadgeComponent,
    TitleCasePipe,
    DatePipe,
    SortButtonComponent,
    LucideAngularModule,
  ],
})
export default class UserTableComponent {
  userTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('userTemplate');
  dateTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('dateTemplate');
  statusTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('statusTemplate');
  actionsTemplate = viewChild<TemplateRef<any>>('actionsTemplate');
  sortableHeader = viewChild<TemplateRef<HeaderContext<UserDto>>>('sortableHeader');

  // icons
  readonly EditIcon = Pencil;
  readonly DeleteIcon = Trash;
  readonly EyeIcon = Eye;

  users = input.required<UserDto[]>();

  readonly columns = computed<ColumnDef<UserDto & { actions?: TemplateRef<any> }>[]>(() => [
    {
      label: 'User',
      key: 'fullName',
      cellTemplate: this.userTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    { label: 'Email', key: 'email', headerTemplate: this.sortableHeader() },
    {
      label: 'Created At',
      key: 'createdAt',
      cellTemplate: this.dateTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    {
      label: 'Status',
      key: 'isVerified',
      cellTemplate: this.statusTemplate(),
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
    console.log(params);
    this.sort.emit(params);
  }
}
