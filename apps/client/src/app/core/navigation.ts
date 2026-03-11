// Full paths — these in routerLink and programmatic navigation

export const BASE_PATH = '/';

export const NAV = {
  auth: {
    base: 'auth',
    signin: BASE_PATH + 'auth/signin',
    signup: BASE_PATH + 'auth/signup',
    forgotPassword: BASE_PATH + 'auth/forgot-password',
    resetPassword: BASE_PATH + 'auth/reset-password',
    verifyOtp: BASE_PATH + 'auth/verify-otp',
  },
  admin: {
    base: 'admin',
    users: BASE_PATH + 'admin/users',
    events: BASE_PATH + 'admin/events',
    dashboard: BASE_PATH + 'admin/dashboard',
  },
  events: BASE_PATH,
} as const;

// Segments — these in route definitions (child routes only need the last segment)
export const ROUTE_SEGMENTS = {
  auth: {
    signin: 'signin',
    signup: 'signup',
    forgotPassword: 'forgot-password',
    resetPassword: 'reset-password',
    verifyOtp: 'verify-otp',
  },
  admin: {
    users: 'users',
    events: 'events',
  },
} as const;
