import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-skeleton',
  standalone: true,
  template: `
    <div class="flex flex-col gap-6">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (_ of [1, 2, 3, 4]; track $index) {
          <div
            class="flex items-center gap-4 rounded-xl p-4 bg-(--dark-gray-color) border border-(--border-color)"
          >
            <div class="skeleton size-10 rounded-xl shrink-0"></div>
            <div class="flex flex-col gap-2 flex-1">
              <div class="skeleton h-6 w-16 rounded"></div>
              <div class="skeleton h-3 w-24 rounded"></div>
            </div>
          </div>
        }
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (_ of [1, 2]; track $index) {
          <div class="rounded-xl p-4 bg-(--dark-gray-color) border border-(--border-color)">
            <div class="skeleton h-6 w-48 rounded mb-4"></div>
            <div class="skeleton h-[250px] w-full rounded-lg"></div>
          </div>
        }
      </div>

      <!-- Top Revenue Events -->
      <div class="rounded-xl p-5 bg-(--dark-gray-color) border border-(--border-color)">
        <div class="skeleton h-6 w-56 rounded mb-4"></div>
        <div class="flex flex-col gap-4">
          @for (_ of [1, 2, 3, 4, 5]; track $index) {
            <div class="flex items-center gap-4 p-3 rounded-xl bg-(--gray-color)/50">
              <div class="skeleton size-8 rounded shrink-0"></div>
              <div class="skeleton size-12 rounded-xl shrink-0"></div>
              <div class="flex flex-col gap-2 flex-1">
                <div class="skeleton h-4 w-40 rounded"></div>
                <div class="skeleton h-3 w-28 rounded"></div>
              </div>
              <div class="items-center gap-2 md:flex hidden">
                <div class="flex flex-col gap-1 items-end">
                  <div class="skeleton h-4 w-14 rounded"></div>
                  <div class="skeleton h-3 w-16 rounded"></div>
                </div>
                <div class="skeleton h-6 w-20 rounded-full"></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Event Status Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        @for (_ of [1, 2, 3]; track $index) {
          <div
            class="flex flex-col items-center justify-center gap-2 rounded-xl p-6 bg-(--dark-gray-color) border border-(--border-color)"
          >
            <div class="skeleton h-10 w-12 rounded"></div>
            <div class="skeleton h-6 w-20 rounded-full"></div>
          </div>
        }
      </div>
    </div>
  `,
})
export default class DashboardSkeletonComponent {}
