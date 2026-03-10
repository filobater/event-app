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
    refreshToken: `/refresh-token`,
    signout: `/signout`,
  },
  users: {
    base: `${API_BASE}/users`,
    // post request for the admin to create a new user
    create: "/",
    // get request for the admin to get all users
    getAll: "/",
    // get user, update user by id "admin"
    byId: (id: string) => `/:${id}`,

    // patch request for the logged in user
    updateProfile: "/profile",
    updatePassword: `/password`,
  },

  // events: {
  //   base: `${API_BASE}/events`,
  //   byId: (id: string) => `${API_BASE}/events/${id}`,
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
