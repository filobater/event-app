import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { UsersApiService } from 'src/app/core/services/users-api.service';
import { LucideAngularModule, Plus, Users } from 'lucide-angular';
import {
  SecondaryButtonComponent,
  SearchInputComponent,
  ModalComponent,
  AlertModalComponent,
  ErrorMessageComponent,
} from 'src/app/shared/components';
import UserFormComponent from '../components/user-form/user-form.component';
import UserDetailsComponent from '../components/user-details/user-details.component';
import { CreateUserRequestDto, UpdateUserRequestDto, UserDto } from '@events-app/shared-dtos';
import { RequestStateClass } from 'src/app/core/request-state';
import UserTableComponent from '../components/user-table/user-table.component';
import AdminLoadingComponent from '../../ui/loading/loading.component';
import { SortParams } from 'src/app/shared/utils/create-paginated-resource.utils';

export type ModalType = 'add' | 'edit' | 'delete' | 'view';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    LucideAngularModule,
    SecondaryButtonComponent,
    SearchInputComponent,
    ModalComponent,
    AlertModalComponent,
    UserFormComponent,
    UserDetailsComponent,
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

  /** Request state for fetching the selected user (edit modal). */
  readonly getUserRequestState = new RequestStateClass();
  /** Request state for create/update user (add & edit save). */
  readonly saveRequestState = new RequestStateClass();

  modals = signal({
    add: false,
    edit: false,
    delete: false,
    view: false,
  });

  selectedUserId = signal<string | null>(null);

  readonly usersResource = this.usersApiService.getAllUsers();

  userSelected = signal<UserDto | null>(null);

  private readonly userFormRef = viewChild(UserFormComponent);
  readonly resetUserForm = () => this.userFormRef()?.userForm.reset();

  constructor() {
    effect(() => {
      const id = this.selectedUserId();

      this.userSelected.set(null);

      if (!id) return;
      this.getUserRequestState.start();
      this.usersApiService.getUser(id).subscribe({
        next: (response) => {
          this.getUserRequestState.success();
          this.userSelected.set(response.data.user);
        },
        error: (error) => {
          this.getUserRequestState.fail(error);
          this.userSelected.set(null);
        },
      });
    });
  }

  handleSearch(search: string) {
    this.usersResource.setSearch(search);
  }

  handleSort(params: SortParams) {
    this.usersResource.setSort(params);
  }

  handleOpenModal(modal: ModalType) {
    this.modals.update((m) => ({ ...m, [modal]: true }));
  }

  handleCloseModal(modal: ModalType) {
    this.modals.update((m) => ({ ...m, [modal]: false }));
    if (modal !== 'add') this.selectedUserId.set(null);
  }

  handleTableAction(modal: ModalType, userId: string) {
    this.selectedUserId.set(userId);
    this.handleOpenModal(modal);
  }

  handleCreateUser(user: CreateUserRequestDto) {
    this.usersApiService.createUser(user).subscribe({
      next: (response) => {
        this.saveRequestState.success();
        this.handleCloseModal('add');
        this.usersResource.addItem(response.data.user);
        this.resetUserForm();
      },
      error: (error) => {
        this.saveRequestState.fail(error);
        this.usersResource.resource.reload();
      },
    });
  }

  handleUpdateUser(id: string, user: UpdateUserRequestDto) {
    this.usersApiService.updateUser(id, user).subscribe({
      next: (response) => {
        this.saveRequestState.success();
        this.handleCloseModal('edit');
        this.usersResource.updateItem(id, response.data.user);
        this.resetUserForm();
      },
      error: (error) => {
        this.saveRequestState.fail(error);
        this.usersResource.resource.reload();
      },
    });
  }

  handleSaveUser(user: CreateUserRequestDto | UpdateUserRequestDto) {
    this.saveRequestState.start();
    if ('_id' in user) {
      this.handleUpdateUser(user._id as string, user);
    } else {
      this.handleCreateUser(user);
    }
  }

  handleDeleteUser(userId: string) {
    this.saveRequestState.start();
    this.usersApiService.deleteUser(userId).subscribe({
      next: () => {
        this.saveRequestState.success();
        this.handleCloseModal('delete');
        this.usersResource.removeItem(userId);
      },
      error: (error) => {
        this.saveRequestState.fail(error);
        this.usersResource.resource.reload();
      },
    });
  }

  handleDeleteConfirm() {
    const id = this.selectedUserId();
    if (id) this.handleDeleteUser(id);
  }
}
