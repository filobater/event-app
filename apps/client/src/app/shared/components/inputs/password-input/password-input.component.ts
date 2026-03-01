import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-password-input',
  standalone: true,
  templateUrl: './password-input.component.html',
})
export default class PasswordInputComponent {
  labelText = input<string>('');
  placeholder = input<string>('Password');
  showPassword = signal<boolean>(false);
  id = input<string>('password');

  handleShowingPassword() {
    this.showPassword.set(!this.showPassword());
  }
}
