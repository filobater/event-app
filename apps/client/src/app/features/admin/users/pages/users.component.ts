import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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
import { CreateUserRequestDto, UpdateUserRequestDto } from '@events-app/shared-dtos';
import UserTableComponent from '../components/user-table/user-table.component';
import { AdminLoadingComponent } from '../../components';
import type { ModalType } from 'src/app/features/admin/types/modal.type';
import type { SortParams } from 'src/app/features/admin/types/sort-params.type';
import { UsersFacade } from 'src/app/features/admin/users/facades/users.facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  readonly usersFacade = inject(UsersFacade);
  readonly usersResource = this.usersFacade.usersResource;

  selectedUserId = signal<string | null>(null);
  modals = signal({ add: false, edit: false, delete: false, view: false });

  private readonly userFormRef = viewChild(UserFormComponent);
  readonly resetUserForm = () => this.userFormRef()?.userForm.reset();

  constructor() {
    effect(() => {
      const id = this.selectedUserId();
      this.usersFacade.loadUser(!id || this.modals().delete ? null : id);
    });
  }

  handleSearch(search: string) {
    if (this.usersResource.resource.value()?.data?.users?.length === 0) return;
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

  handleSaveUser(user: CreateUserRequestDto | UpdateUserRequestDto) {
    const isEdit = '_id' in user && !!user._id;
    this.usersFacade.saveUser(user, {
      onProfilePictureUrlApplied: (url) =>
        this.userFormRef()?.userForm.patchValue({ profilePicture: url }),
      onSuccess: () => {
        this.handleCloseModal(isEdit ? 'edit' : 'add');
        this.resetUserForm();
      },
    });
  }

  handleDeleteConfirm() {
    const id = this.selectedUserId();
    if (!id) return;
    this.usersFacade.deleteUser(id, () => {
      this.handleCloseModal('delete');
    });
  }
}
