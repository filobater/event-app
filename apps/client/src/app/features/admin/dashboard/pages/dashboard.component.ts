import { Component, effect, inject } from '@angular/core';
import { LucideAngularModule, LayoutDashboard } from 'lucide-angular';
import {
  StatCardsListComponent,
  RegistrationBarChartComponent,
  CategoryDonutChartComponent,
  TopRevenueEventsListComponent,
  EventStatusListComponent,
  DashboardSkeletonComponent,
} from '../components';
import { DashboardFacade } from '../facades';
import { ErrorMessageComponent } from 'src/app/shared/components';

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
    DashboardSkeletonComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export default class AdminDashboardComponent {
  readonly DashboardIcon = LayoutDashboard;
  readonly dashboardFacade = inject(DashboardFacade);

  constructor() {
    effect(() => {
      this.dashboardFacade.loadDashboard();
    });
  }
}
