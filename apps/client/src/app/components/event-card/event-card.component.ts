import { Component, input } from '@angular/core';
import { Event } from './event.interface';
import EventInfoLabelComponent from './event-info-label/event-info-label.component';
import ThumbnailComponent from './thumbnail/thumbnail.component';
import ProgressComponent from '../progress/progress.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [ThumbnailComponent, EventInfoLabelComponent, ProgressComponent],
  templateUrl: './event-card.component.html',
})
export default class EventCardComponent {
  event = input.required<Event>();
  variant = {
    ongoing: 'border-l-(--accent-color)',
    upcoming: 'border-l-(--main-color)',
    completed: 'border-l-(--gray-color)',
  } as const;
}
