import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-registrations-skeleton-loading',
  standalone: true,
  template: `
    <div class="space-y-2">
      @for (_ of skeletonItemsSignal(); track $index) {
        <div class="h-20 rounded-lg bg-(--gray-color) animate-pulse"></div>
      }
    </div>
  `,
})
export default class RegistrationsSkeletonLoadingComponent {
  readonly skeletonItems = input<number>(6);
  readonly skeletonItemsSignal = computed(() => Array(this.skeletonItems()));
}
