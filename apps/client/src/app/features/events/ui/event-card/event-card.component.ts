import { Component, input } from '@angular/core';
import { EventDto } from '@events-app/shared-dtos';
import InfoLabelComponent from '../../../../shared/components/info-label/info-label.component';
import ThumbnailComponent from './thumbnail/thumbnail.component';
import ProgressComponent from '../../../../shared/components/progress/progress.component';
import { LucideAngularModule, Calendar, Clock, MapPin, Users } from 'lucide-angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [ThumbnailComponent, InfoLabelComponent, ProgressComponent, LucideAngularModule, DatePipe],
  templateUrl: './event-card.component.html',
})
export default class EventCardComponent {
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly MapPinIcon = MapPin;
  readonly UsersIcon = Users;
  event = input.required<EventDto>();
  variant = {
    ongoing: 'border-l-(--accent-color)',
    upcoming: 'border-l-(--main-color)',
    completed: 'border-l-(--gray-color)',
  } as const;
}
