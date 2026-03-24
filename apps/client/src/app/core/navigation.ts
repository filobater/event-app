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
    userRegistrations: (id: string) => BASE_PATH + 'admin/users/' + id + '/registrations',
  },
  events: BASE_PATH,
  event: (id: string) => BASE_PATH + 'events/' + id,
  profile: {
    base: 'profile',
    account: BASE_PATH + 'profile/account',
    password: BASE_PATH + 'profile/password',
    registrations: BASE_PATH + 'profile/registrations',
  },
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
    dashboard: 'dashboard',
    users: 'users',
    events: 'events',
    userRegistrations: 'registrations',
  },
  profile: {
    account: 'account',
    password: 'password',
    registrations: 'registrations',
  },
  events: {
    details: 'events/:id',
  },
} as const;
