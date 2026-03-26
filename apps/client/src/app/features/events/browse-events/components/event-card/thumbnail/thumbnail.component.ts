import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventDto } from '@events-app/shared-dtos';
import { BadgeComponent } from 'src/app/shared/components';
import { STATUS_BADGE_COLORS } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-thumbnail',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './thumbnail.component.html',
})
export default class ThumbnailComponent {
  readonly baseUrl = environment.apiUrl;
  event = input.required<Pick<EventDto, 'photo' | 'title' | 'status' | 'price'>>();
  readonly statusColors = STATUS_BADGE_COLORS;
  readonly priceColors = {
    free: 'bg-(--warning-color) text-(--dark-color)!',
    paid: 'bg-(--secondary-color) text-(--dark-color)!',
  };
}

