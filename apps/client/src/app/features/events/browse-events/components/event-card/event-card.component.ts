import { Component, input } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, MapPin, Users } from 'lucide-angular';
import { EventDto } from '@events-app/shared-dtos';
import { InfoLabelComponent, ProgressComponent } from 'src/app/shared/components';
import ThumbnailComponent from './thumbnail/thumbnail.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    ThumbnailComponent,
    InfoLabelComponent,
    ProgressComponent,
    LucideAngularModule,
    DatePipe,
    SlicePipe,
  ],
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
