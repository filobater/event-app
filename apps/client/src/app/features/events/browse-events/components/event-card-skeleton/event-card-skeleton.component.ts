import { Component } from '@angular/core';

@Component({
  selector: 'app-event-card-skeleton',
  standalone: true,
  template: `
    <div class="card compact overflow-hidden rounded-xl bg-base-200">
      <!-- thumbnail -->
      <div class="skeleton h-40 w-full rounded-none"></div>

      <div class="card-body gap-3 p-4">
        <!-- title -->
        <div class="skeleton h-5 w-3/4 rounded"></div>
        <!-- description lines -->
        <div class="skeleton h-3 w-full rounded"></div>
        <div class="skeleton h-3 w-5/6 rounded"></div>

        <!-- info row: date / time / location -->
        <div class="flex items-center gap-3 mt-1">
          <div class="skeleton h-3 w-16 rounded"></div>
          <div class="skeleton h-3 w-12 rounded"></div>
          <div class="skeleton h-3 w-20 rounded"></div>
        </div>

        <!-- seats row -->
        <div class="flex items-center justify-between">
          <div class="skeleton h-3 w-24 rounded"></div>
          <div class="skeleton h-3 w-16 rounded"></div>
        </div>
      </div>

      <!-- progress bar -->
      <div class="skeleton h-1.5 w-full rounded-none"></div>
    </div>
  `,
})
export default class EventCardSkeletonComponent {}

