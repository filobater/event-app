import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV, BASE_PATH } from 'src/app/core/navigation';
import NavTabComponent from '../nav-tab/nav-tab.component';
import {
  CalendarDays,
  ChartColumn,
  LucideAngularModule,
  Menu,
  Ticket,
  Users,
} from 'lucide-angular';
import AvatarComponent from '../avatar/avatar.component';
import { UserService } from 'src/app/core/services/user.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NavTabComponent, LucideAngularModule, AvatarComponent, TitleCasePipe],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly MenuIcon = Menu;
  readonly TicketIcon = Ticket;
  readonly EventsIcon = CalendarDays;
  readonly DashboardIcon = ChartColumn;
  readonly ManageUsersIcon = Users;

  protected readonly nav = NAV;
  protected readonly basePath = BASE_PATH;
  protected readonly userService = inject(UserService);
  protected readonly user = this.userService.currentUser;
  navLinks = [
    {
      label: 'Events',
      path: this.basePath,
      icon: this.EventsIcon,
    },
    {
      label: 'Dashboard',
      path: this.nav.admin.dashboard,
      icon: this.DashboardIcon,
    },
    {
      label: 'Manage Events',
      path: this.nav.admin.events,
      icon: this.TicketIcon,
    },
    {
      label: 'Manage Users',
      path: this.nav.admin.users,
      icon: this.ManageUsersIcon,
    },
  ];
}
