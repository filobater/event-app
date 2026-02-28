import { Routes } from '@angular/router';

import signinComponent from './pages/auth/signin/signin.component';
import signupComponent from './pages/auth/signup/signup.component';
import forgotPasswordComponent from './pages/auth/forgot-password/forgot-password.component';
import resetPasswordComponent from './pages/auth/reset-password/reset-password.component';
import otpComponent from './pages/auth/otp/otp.component';
import usersComponent from './pages/admin/users/users.component';
import eventsComponent from './pages/admin/events/events.component';

export const routes: Routes = [
  {
    path: 'app',
    children: [
      { path: 'signin', component: signinComponent, title: 'Sign in' },
      { path: 'signup', component: signupComponent, title: 'Sign up' },
      {
        path: 'forgot-password',
        component: forgotPasswordComponent,
        title: 'Forgot password',
      },
      {
        path: 'reset-password',
        component: resetPasswordComponent,
        title: 'Reset password',
      },
      { path: 'otp', component: otpComponent, title: 'OTP verification' },
    ],
  },
  {
    path: 'admin',
    children: [
      { path: 'users', component: usersComponent, title: 'Admin Users' },
      { path: 'events', component: eventsComponent, title: 'Admin Events' },
    ],
  },
];
