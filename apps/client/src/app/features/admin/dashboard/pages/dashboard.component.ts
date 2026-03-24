import { Component } from '@angular/core';
import { LucideAngularModule, LayoutDashboard } from 'lucide-angular';
import {
  StatCardsListComponent,
  RegistrationBarChartComponent,
  CategoryDonutChartComponent,
  TopRevenueEventsListComponent,
  EventStatusListComponent,
} from '../components';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    LucideAngularModule,
    StatCardsListComponent,
    RegistrationBarChartComponent,
    CategoryDonutChartComponent,
    TopRevenueEventsListComponent,
    EventStatusListComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export default class AdminDashboardComponent {
  readonly DashboardIcon = LayoutDashboard;
}
