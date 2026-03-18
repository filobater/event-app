import { Component, input } from '@angular/core';
import { EventDto } from '@events-app/shared-dtos';
import { BadgeComponent } from 'src/app/shared/components';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thumbnail',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './thumbnail.component.html',
})
export default class ThumbnailComponent {
  readonly baseUrl = environment.apiUrl;
  event = input.required<Pick<EventDto, 'photo' | 'title' | 'status'>>();
  variant = {
    ongoing: 'bg-(--accent-color) text-(--dark-color)! font-medium',
    upcoming: 'bg-(--main-color) text-(--dark-color)! font-medium',
    completed: 'bg-(--gray-color) font-medium',
  } as const;
}

