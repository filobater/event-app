import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV, BASE_PATH } from 'src/app/shared/constants';
import NavTabComponent from '../nav-tab/nav-tab.component';
import {
  CalendarDays,
  ChartColumn,
  LucideAngularModule,
  Menu,
  Ticket,
  Users,
  LayoutDashboard,
  LucideIconData,
} from 'lucide-angular';
import AvatarComponent from '../avatar/avatar.component';
import { UserService } from 'src/app/core/services';
import { TitleCasePipe } from '@angular/common';

type NavLink = {
  label: string;
  path: string;
  icon: LucideIconData;
  adminOnly?: boolean;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly ManageEventsIcon = LayoutDashboard;

  protected readonly nav = NAV;
  protected readonly basePath = BASE_PATH;
  protected readonly userService = inject(UserService);
  protected readonly user = this.userService.currentUser;

  protected readonly NAV_LINKS: NavLink[] = [
    {
      label: 'Events',
      path: this.basePath,
      icon: this.EventsIcon,
    },
    {
      label: 'Dashboard',
      path: this.nav.admin.dashboard,
      icon: this.DashboardIcon,
      adminOnly: true,
    },
    {
      label: 'Manage Events',
      path: this.nav.admin.events,
      icon: this.ManageEventsIcon,
      adminOnly: true,
    },
    {
      label: 'Manage Users',
      path: this.nav.admin.users,
      icon: this.ManageUsersIcon,
      adminOnly: true,
    },
  ];

  readonly navLinks = this.NAV_LINKS.filter((link) => {
    const isAdmin = this.user()?.role === 'admin';
    return isAdmin || !link.adminOnly;
  });
}
