import { Component, computed, input } from '@angular/core';
import { Eye, LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EventDto, RegistrationDto } from '@events-app/shared-dtos';
import { isPopulated } from '../../utils';
import { NAV } from 'src/app/core';
import { TitleCasePipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-register-card',
  templateUrl: './register-card.component.html',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, TitleCasePipe, DatePipe],
})
export class RegisterCardComponent {
  readonly nav = NAV;
  readonly baseUrl = environment.apiUrl;
  readonly EyeIcon = Eye;

  registration = input<RegistrationDto>();

  event = computed<EventDto | null>(() => {
    const ev = this.registration()?.event;
    return isPopulated<EventDto>(ev) ? ev : null;
  });
}
