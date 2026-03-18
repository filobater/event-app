import { Component, input } from '@angular/core';
import { SpeakerDto } from '@events-app/shared-dtos';
import AvatarComponent from 'src/app/shared/components/avatar/avatar.component';

@Component({
  selector: 'app-event-speakers',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './event-speakers.component.html',
})
export default class EventSpeakersComponent {
  speakers = input.required<SpeakerDto[]>();
}

