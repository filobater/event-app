import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  templateUrl: './auth-card.component.html',
})
export default class AuthCardComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  iconBackgroundColor = input<string>('bg-(--main-color)');
}
