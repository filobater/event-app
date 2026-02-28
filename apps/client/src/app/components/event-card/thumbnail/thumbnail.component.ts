import { Component, input } from '@angular/core';
import { Event } from '../event.interface';
import BadgeComponent from '../../badge/badge.component';

@Component({
  selector: 'app-thumbnail',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './thumbnail.component.html',
})
export default class ThumbnailComponent {
  event = input.required<Pick<Event, 'image' | 'title' | 'status' | 'isRegistered'>>();
}
