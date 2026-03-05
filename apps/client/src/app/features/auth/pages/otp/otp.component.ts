import { Component } from '@angular/core';
import { AuthCardComponent } from '../../ui';
import { OtpInputComponent, PrimaryButtonComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [AuthCardComponent, OtpInputComponent, PrimaryButtonComponent],
  templateUrl: './otp.component.html',
})
export default class OtpComponent {}
