import { Component, input } from '@angular/core';
import { EventDto } from '@events-app/shared-dtos';
import { BadgeComponent } from '../../../../../shared/components';
@Component({
  selector: 'app-thumbnail',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './thumbnail.component.html',
})
export default class ThumbnailComponent {
  event = input.required<Pick<EventDto, 'photo' | 'title' | 'status'>>();
  variant = {
    ongoing: 'bg-(--accent-color)',
    upcoming: 'bg-(--main-color)',
    completed: 'bg-(--gray-color)',
  } as const;
}
