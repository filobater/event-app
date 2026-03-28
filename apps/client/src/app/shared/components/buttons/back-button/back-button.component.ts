import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeftIcon } from 'lucide-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-back-button',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './back-button.component.html',
})
export default class BackButtonComponent {
  readonly ArrowLeftIcon = ArrowLeftIcon;

  label = input.required<string>();
  path = input.required<string>();
}
