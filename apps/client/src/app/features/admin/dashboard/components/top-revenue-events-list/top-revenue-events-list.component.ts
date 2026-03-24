import { Component, input } from '@angular/core';

import TopRevenueEventCardComponent from '../top-revenue-event-card/top-revenue-event-card.component';
import { Coins, LucideAngularModule } from 'lucide-angular';
import { TopEventByRevenueDto } from '@events-app/shared-dtos';

@Component({
  selector: 'app-top-revenue-events-list',
  standalone: true,
  imports: [TopRevenueEventCardComponent, LucideAngularModule],
  template: `
    <div class="rounded-xl p-5 bg-(--dark-gray-color) border border-(--border-color)">
      <h3 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
        <i-lucide [img]="CoinsIcon" class="size-5 text-(--main-color)" /> Top Events by Revenue
      </h3>
      <div class="flex flex-col gap-4">
        @for (event of topEventsByRevenue(); track event._id; let i = $index) {
          <app-top-revenue-event-card [event]="event" [rank]="i + 1" />
        }
      </div>
    </div>
  `,
})
export default class TopRevenueEventsListComponent {
  topEventsByRevenue = input<TopEventByRevenueDto[] | null>();
  readonly CoinsIcon = Coins;
}
