import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeftIcon } from 'lucide-angular';
import { NAV } from 'src/app/core';

@Component({
  selector: 'app-event-details-back-button',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './event-details-back-button.component.html',
})
export default class EventDetailsBackButtonComponent {
  readonly ArrowLeftIcon = ArrowLeftIcon;
  readonly eventsPath = NAV.events;
}

