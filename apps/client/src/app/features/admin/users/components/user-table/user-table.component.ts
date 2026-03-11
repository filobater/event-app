import { Component, computed, input, TemplateRef, viewChild } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { UserDto } from '@events-app/shared-dtos';
import AdminTableComponent, { ColumnDef } from '../../../ui/table/table.component';
import { AvatarComponent, BadgeComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-user-table',
  standalone: true,
  templateUrl: './user-table.component.html',
  imports: [AdminTableComponent, AvatarComponent, BadgeComponent, TitleCasePipe, DatePipe],
})
export default class UserTableComponent {
  userTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('userTemplate');
  dateTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('dateTemplate');
  statusTemplate = viewChild<TemplateRef<{ $implicit: UserDto }>>('statusTemplate');

  users = input.required<UserDto[]>();
  
  readonly columns = computed<ColumnDef<UserDto>[]>(() => [
    { label: 'User', key: 'fullName', cellTemplate: this.userTemplate() },
    { label: 'Email', key: 'email' },
    { label: 'Created At', key: 'createdAt', cellTemplate: this.dateTemplate() },
    { label: 'Status', key: 'isVerified', cellTemplate: this.statusTemplate() },
  ]);

}
