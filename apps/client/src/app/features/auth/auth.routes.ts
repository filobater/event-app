import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'signin',
    loadComponent: () => import('./pages/signin/signin.component'),
    title: 'Sign In',
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component'),
    title: 'Sign Up',
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component'),
    title: 'Forgot Password',
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.component'),
    title: 'Reset Password',
  },
  {
    path: 'otp',
    loadComponent: () => import('./pages/otp/otp.component'),
    title: 'OTP Verification',
  },
];
