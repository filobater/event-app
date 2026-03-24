import { Component, input } from '@angular/core';
import { EventDto } from '@events-app/shared-dtos';
import { BadgeComponent } from 'src/app/shared/components';
import { STATUS_BADGE_COLORS } from 'src/app/shared/constants';
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
  readonly statusColors = STATUS_BADGE_COLORS;
}

