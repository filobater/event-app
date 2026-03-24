import { Component } from '@angular/core';

import TopRevenueEventCardComponent, {
  type TopRevenueEvent,
} from '../top-revenue-event-card/top-revenue-event-card.component';
import { Coins, LucideAngularModule } from 'lucide-angular';

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
        @for (event of events; track event.name) {
          <app-top-revenue-event-card [event]="event" />
        }
      </div>
    </div>
  `,
})
export default class TopRevenueEventsListComponent {
  readonly CoinsIcon = Coins;
  readonly events: TopRevenueEvent[] = [
    {
      rank: 1,
      name: 'AI & Machine Learning Expo',
      venue: 'Luxe Hall',
      date: '2026-09-01',
      revenue: 900,
      seats: 230,
      status: 'ongoing',
      imageUrl: 'https://picsum.photos/seed/ai-expo/80/80',
    },
    {
      rank: 2,
      name: 'Tech Innovation Summit 2026',
      venue: 'Convention Center',
      date: '2026-03-15',
      revenue: 450,
      seats: 142,
      status: 'completed',
      imageUrl: 'https://picsum.photos/seed/tech-summit/80/80',
    },
    {
      rank: 3,
      name: 'Creative Design Workshop',
      venue: 'Design Hub',
      date: '2026-03-20',
      revenue: 320,
      seats: 95,
      status: 'upcoming',
      imageUrl: 'https://picsum.photos/seed/design-ws/80/80',
    },
    {
      rank: 4,
      name: 'Blockchain & Web3 Forum',
      venue: 'Crypto Hub',
      date: '2026-06-10',
      revenue: 260,
      seats: 107,
      status: 'upcoming',
      imageUrl: 'https://picsum.photos/seed/blockchain/80/80',
    },
    {
      rank: 5,
      name: 'Cloud Architecture Masterclass',
      venue: 'Tech Campus',
      date: '2026-04-10',
      revenue: 200,
      seats: 45,
      status: 'upcoming',
      imageUrl: 'https://picsum.photos/seed/cloud-arch/80/80',
    },
  ];
}
