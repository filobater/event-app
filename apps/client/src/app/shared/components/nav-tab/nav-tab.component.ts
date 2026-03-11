import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

interface NavTab {
  label: string;
  path: string;
  icon?: LucideIconData;
}

@Component({
  selector: 'app-nav-tab',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './nav-tab.component.html',
})
export default class NavTabComponent {
  link = input.required<NavTab>();
}
