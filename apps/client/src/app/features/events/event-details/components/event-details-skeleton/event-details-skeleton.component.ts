import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event-details-skeleton',
  standalone: true,
  templateUrl: './event-details-skeleton.component.html',
})
export default class EventDetailsSkeletonComponent {}

