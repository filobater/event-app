import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Mail, Shield, Calendar } from 'lucide-angular';
import { UserDto } from '@events-app/shared-dtos';
import { AvatarComponent, BadgeComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [LucideAngularModule, AvatarComponent, BadgeComponent, DatePipe],
  templateUrl: './user-details.component.html',
})
export default class UserDetailsComponent {
  user = input.required<UserDto | null>();

  readonly MailIcon = Mail;
  readonly ShieldIcon = Shield;
  readonly CalendarIcon = Calendar;
}
