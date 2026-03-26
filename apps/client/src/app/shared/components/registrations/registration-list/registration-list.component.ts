import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistrationDto } from '@events-app/shared-dtos';
import RegisterCardComponent from '../register-card/register-card.component';
import RegistrationsEmptyComponent from '../registrations-empty/registrations-empty.component';
import RegistrationsSkeletonLoadingComponent from '../registrations-skeleton-loading/registrations-skeleton-loading.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-registration-list',
  standalone: true,
  imports: [
    CommonModule,
    RegisterCardComponent,
    RouterModule,
    RegistrationsEmptyComponent,
    RegistrationsSkeletonLoadingComponent,
  ],
  template: `
    <div class="flex flex-col gap-4 min-h-[{{ height() }}]">
      @if (isLoading()) {
        <app-registrations-skeleton-loading [skeletonItems]="skeletonItems()" />
      } @else if (registrations().length === 0) {
        <app-registrations-empty />
      } @else {
        @for (reg of registrations(); track reg._id) {
          <app-register-card [registration]="reg" />
        }
      }
    </div>
  `,
})
export default class RegistrationListComponent {
  readonly skeletonItems = input<number>(6);
  readonly registrations = input.required<RegistrationDto[]>();
  readonly isLoading = input<boolean>(false);
  readonly height = input<string>('60vh');
}
