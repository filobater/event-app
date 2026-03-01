import { Component, input } from '@angular/core';
import { Event } from '../event.interface';
import { BadgeComponent } from '../../../../../shared/components';
@Component({
  selector: 'app-thumbnail',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './thumbnail.component.html',
})
export default class ThumbnailComponent {
  event = input.required<Pick<Event, 'image' | 'title' | 'status' | 'isRegistered'>>();
  variant = {
    ongoing: 'bg-(--accent-color)',
    upcoming: 'bg-(--main-color)',
    completed: 'bg-(--gray-color)',
  } as const;
}
