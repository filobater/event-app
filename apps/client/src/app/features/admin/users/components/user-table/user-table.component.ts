import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { UserDto } from '@events-app/shared-dtos';
import {
  SortButtonComponent,
  TableComponent as AdminTableComponent,
  type ColumnDef,
  type HeaderContext,
  type PaginationOptions,
} from 'src/app/features/admin/components';
import { AvatarComponent, BadgeComponent } from 'src/app/shared/components';
import { Eye, Pencil, Trash, LucideAngularModule, Shield } from 'lucide-angular';
import type { ModalType, SortParams } from 'src/app/features/admin/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  roleTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('roleTemplate');
  dateTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('dateTemplate');
  statusTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('statusTemplate');
  actionsTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('actionsTemplate');
  sortableHeader = viewChild<TemplateRef<HeaderContext<UserDto>>>('sortableHeader');

  // icons
  readonly EditIcon = Pencil;
  readonly DeleteIcon = Trash;
  readonly EyeIcon = Eye;
  readonly ShieldIcon = Shield;

  users = input.required<UserDto[]>();
  paginationOptions = input<PaginationOptions>();

  openModal = output<{ modal: ModalType; userId: string }>();

  sort = output<SortParams>();
  readonly columns = computed<
    ColumnDef<UserDto & { actions?: TemplateRef<{ $implicit: UserDto }> }>[]
  >(() => [
    {
      label: 'User',
      key: 'fullName',
      cellTemplate: this.userTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    { label: 'Email', key: 'email', headerTemplate: this.sortableHeader() },
    {
      label: 'Role',
      key: 'role',
      cellTemplate: this.roleTemplate(),
      headerTemplate: this.sortableHeader(),
    },
    {
      label: 'Joined At',
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

  handleSort(params: SortParams) {
    if (this.users().length === 0) return;
    this.sort.emit(params);
  }

  handleActions(action: ModalType, userId: string) {
    this.openModal.emit({
      modal: action,
      userId: userId,
    });
  }
}
