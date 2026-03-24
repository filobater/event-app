import { Component, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { EventDto } from '@events-app/shared-dtos';
import { BadgeComponent } from 'src/app/shared/components';
import { STATUS_BADGE_COLORS } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event-hero',
  standalone: true,
  imports: [BadgeComponent, TitleCasePipe],
  templateUrl: './event-hero.component.html',
})
export default class EventHeroComponent {
  readonly baseUrl = environment.apiUrl;
  event = input.required<EventDto>();
  readonly statusColor = STATUS_BADGE_COLORS;
}

