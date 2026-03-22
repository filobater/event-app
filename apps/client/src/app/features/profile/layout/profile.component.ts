import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Lock, LucideIconData, Ticket, User } from 'lucide-angular';
import NavTabComponent from 'src/app/shared/components/nav-tab/nav-tab.component';
import { NAV } from 'src/app/core/navigation';

interface ProfileTab {
  label: string;
  path: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, NavTabComponent],
  templateUrl: './profile.component.html',
})
export default class ProfileComponent {
  readonly tabs: ProfileTab[] = [
    { label: 'Account', path: NAV.profile.account, icon: User },
    { label: 'Password', path: NAV.profile.password, icon: Lock },
    { label: 'My Registrations', path: NAV.profile.registrations, icon: Ticket },
  ];
}
