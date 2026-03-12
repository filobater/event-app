import { Component, inject, signal } from '@angular/core';
import { UsersApiService } from 'src/app/core/services/users-api.service';
import { LucideAngularModule, Plus, Users } from 'lucide-angular';
import {
  SecondaryButtonComponent,
  SearchInputComponent,
  ModalComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import UserFormComponent from '../components/user-form/user-form.component';
import { CreateUserRequestDto, GetAllUsersResponseDto } from '@events-app/shared-dtos';
import { RequestStateClass } from 'src/app/core/request-state';
import UserTableComponent from '../components/user-table/user-table.component';
import AdminLoadingComponent from '../../ui/loading/loading.component';
import { SortParams } from 'src/app/shared/utils/create-paginated-resource.utils';

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
    ErrorMessageComponent,
  ],
  templateUrl: './users.component.html',
})
export default class UsersComponent {
  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  private usersApiService = inject(UsersApiService);
  readonly requestState = new RequestStateClass();
  readonly isAddUserModalOpen = signal(false);

  readonly usersResource = this.usersApiService.getAllUsers<GetAllUsersResponseDto>();

  handleSearch(search: string) {
    this.usersResource.setSearch(search);
  }

  handleSort(params: SortParams) {
    this.usersResource.setSort(params);
  }

  handleAddUser() {
    this.isAddUserModalOpen.set(true);
  }

  handleCloseAddUserModal() {
    this.isAddUserModalOpen.set(false);
  }
  // TODO: handle also the edit user functionality
  handleSaveUser(user: CreateUserRequestDto | Partial<CreateUserRequestDto>) {
    this.requestState.start();
    this.usersApiService.createUser(user as CreateUserRequestDto).subscribe({
      next: (response) => {
        this.requestState.success();
        // this.users.update((users) => [...users, response.data]);
        this.isAddUserModalOpen.set(false);
      },
      error: (error) => {
        this.requestState.fail(error);
      },
    });
  }
}
