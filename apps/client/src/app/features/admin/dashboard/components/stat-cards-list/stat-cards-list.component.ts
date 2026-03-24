import { Component } from '@angular/core';
import { LucideAngularModule, CalendarDays, Users, Coins, TicketIcon } from 'lucide-angular';
import StatCardComponent from '../stat-card/stat-card.component';

@Component({
  selector: 'app-stat-cards-list',
  standalone: true,
  imports: [StatCardComponent, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      @for (stat of stats; track stat.label) {
        <app-stat-card
          [icon]="stat.icon"
          [value]="stat.value"
          [label]="stat.label"
          [iconColor]="stat.iconColor"
        />
      }
    </div>
  `,
})
export default class StatCardsListComponent {
  readonly stats = [
    {
      icon: CalendarDays,
      value: 14,
      label: 'Total Events',
      iconColor: 'text-(--main-color)',
    },
    {
      icon: Users,
      value: 4,
      label: 'Total Users',
      iconColor: 'text-(--accent-color)',
    },
    {
      icon: TicketIcon,
      value: 10,
      label: 'Registrations',
      iconColor: 'text-(--secondary-color)',
    },
    {
      icon: Coins,
      value: 'EGP2240',
      label: 'Revenue',
      iconColor: 'text-(--warning-color)',
    },
  ];
}
