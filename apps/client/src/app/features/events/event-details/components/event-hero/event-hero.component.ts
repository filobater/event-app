import { Component, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { EventDto } from '@events-app/shared-dtos';
import { BadgeComponent } from 'src/app/shared/components';
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

  readonly statusColor: Record<EventDto['status'], string> = {
    upcoming: 'bg-(--main-color) text-(--dark-color)! font-medium',
    ongoing: 'bg-(--accent-color) text-(--dark-color)! font-medium',
    completed: 'bg-(--gray-color) font-medium',
  };
}

