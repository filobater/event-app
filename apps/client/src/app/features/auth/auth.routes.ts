import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from 'src/app/core';

const SEGMENT_NAMES = ROUTE_SEGMENTS.auth;

export const authRoutes: Routes = [
  {
    path: SEGMENT_NAMES.signin,
    loadComponent: () => import('./pages/signin/signin.component').then((m) => m.default),
    title: 'Sign In',
  },
  {
    path: SEGMENT_NAMES.signup,
    loadComponent: () => import('./pages/signup/signup.component').then((m) => m.default),
    title: 'Sign Up',
  },
  {
    path: SEGMENT_NAMES.forgotPassword,
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then((m) => m.default),
    title: 'Forgot Password',
  },
  {
    path: SEGMENT_NAMES.resetPassword,
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then((m) => m.default),
    title: 'Reset Password',
  },
  {
    path: SEGMENT_NAMES.verifyOtp,
    loadComponent: () => import('./pages/otp/otp.component').then((m) => m.default),
    title: 'OTP Verification',
  },
];
