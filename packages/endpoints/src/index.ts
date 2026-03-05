const API_BASE = "/api/v1";

export const API_ENDPOINTS = {
  auth: {
    base: `${API_BASE}/auth`,
    signup: `/signup`,
    verifyOtp: `/verify-otp`,
    resendOtp: `/resend-otp`,
    signin: `/signin`,
    forgotPassword: `/forgot-password`,
    resetPassword: (resetToken: string) => `/reset-password/${resetToken}`,
  },
  // users: {
  //   base: `${API_BASE}/users`,
  //   byId: (id: string) => `${API_BASE}/users/${id}`,
  // },
  // events: {
  //   base: `${API_BASE}/events`,
  //   byId: (id: string) => `${API_BASE}/events/${id}`,
  // },
  // admins: {
  //   base: `${API_BASE}/admins`,
  //   byId: (id: string) => `${API_BASE}/admins/${id}`,
  // },
  // registrations: {
  //   base: `${API_BASE}/registrations`,
  //   byId: (id: string) => `${API_BASE}/registrations/${id}`,
  // },
  // payments: {
  //   base: `${API_BASE}/payments`,
  //   byId: (id: string) => `${API_BASE}/payments/${id}`,
  // },
} as const;
