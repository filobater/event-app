import { Component, effect, inject, signal } from '@angular/core';
import { UsersApiService } from 'src/app/core/services/users-api.service';
import { LucideAngularModule, Plus, Users } from 'lucide-angular';
import {
  SecondaryButtonComponent,
  SearchInputComponent,
  ModalComponent,
} from 'src/app/shared/components';
import UserFormComponent from '../components/user-form/user-form.component';
import { CreateUserRequestDto, UserDto } from '@events-app/shared-dtos';
import { RequestStateClass } from 'src/app/core/request-state';
import UserTableComponent from '../components/user-table/user-table.component';
import { UserService } from 'src/app/core/services/user.service';
import AdminLoadingComponent from '../../ui/loading/loading.component';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    LucideAngularModule,
    SecondaryButtonComponent,
    SearchInputComponent,
    ModalComponent,
    UserFormComponent,
    UserTableComponent,
    AdminLoadingComponent,
  ],
  templateUrl: './users.component.html',
})
export default class UsersComponent {
  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  private usersApiService = inject(UsersApiService);
  readonly requestState = new RequestStateClass();
  readonly isAddUserModalOpen = signal(false);
  private readonly userService = inject(UserService);
  users = signal<UserDto[]>([]);
  totalUsers = signal(0);

  constructor() {
    effect(() => {
      if (this.userService.isLoggedIn()) {
        this.requestState.start();
        this.usersApiService.getAllUsers().subscribe({
          next: (data) => {
            this.users.set(data.data.users);
            this.requestState.success();
            this.totalUsers.set(data.data.totalData);
          },
          error: (error) => {
            console.error('Error fetching users', error);
          },
        });
      }
    });
  }

  handleAddUser() {
    this.isAddUserModalOpen.set(true);
  }

  handleCloseAddUserModal() {
    this.isAddUserModalOpen.set(false);
  }
  handleSaveUser(user: CreateUserRequestDto | Partial<CreateUserRequestDto>) {
    this.requestState.start();
    this.usersApiService.createUser(user as CreateUserRequestDto).subscribe({
      next: (response) => {
        this.requestState.success();
        this.users.update((users) => [...users, response.data]);
        this.isAddUserModalOpen.set(false);
      },
      error: (error) => {
        this.requestState.fail(error);
      },
    });
  }
}
