import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule, CalendarIcon, ClockIcon, MapPinIcon, BanknoteIcon } from 'lucide-angular';
import { EventDto } from '@events-app/shared-dtos';
import InfoLabelComponent from 'src/app/shared/components/info-label/info-label.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event-about',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, LucideAngularModule, InfoLabelComponent],
  templateUrl: './event-about.component.html',
})
export default class EventAboutComponent {
  event = input.required<EventDto>();

  readonly CalendarIcon = CalendarIcon;
  readonly ClockIcon = ClockIcon;
  readonly MapPinIcon = MapPinIcon;
  readonly BanknoteIcon = BanknoteIcon;
}

