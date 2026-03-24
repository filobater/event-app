import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, CalendarDays, Users, Coins, TicketIcon } from 'lucide-angular';
import StatCardComponent from '../stat-card/stat-card.component';
import { DashboardStatsResponseDto } from '@events-app/shared-dtos';

@Component({
  selector: 'app-stat-cards-list',
  standalone: true,
  imports: [StatCardComponent, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      @for (stat of statsList(); track stat.label) {
        <app-stat-card
          [icon]="stat.icon"
          [value]="stat.value ?? 0"
          [label]="stat.label"
          [iconColor]="stat.iconColor"
        />
      }
    </div>
  `,
})
export default class StatCardsListComponent {
  readonly stats = input<DashboardStatsResponseDto['data'] | null>();
  readonly statsList = computed(() => {
    if (!this.stats()) return [];
    return [
      {
        icon: CalendarDays,
        value: this.stats()?.totalEvents,
        label: 'Total Events',
        iconColor: 'text-(--main-color)',
      },
      {
        icon: Users,
        value: this.stats()?.totalUsers,
        label: 'Total Users',
        iconColor: 'text-(--accent-color)',
      },
      {
        icon: TicketIcon,
        value: this.stats()?.totalRegistrations,
        label: 'Registrations',
        iconColor: 'text-(--secondary-color)',
      },
      {
        icon: Coins,
        value: `EGP${this.stats()?.totalRevenue}`,
        label: 'Revenue',
        iconColor: 'text-(--warning-color)',
      },
    ];
  });
}
