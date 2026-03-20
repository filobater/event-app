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
    getMe: "/me",
    // get user, update user by id "admin"
    byId: `/:id`,

    // patch request for the logged in user
    updateProfile: "/profile",
    updatePassword: `/password`,
  },

  events: {
    base: `${API_BASE}/events`,
    create: "/",
    getAll: "/",
    byId: `/:id`,
  },
  registrations: {
    base: `${API_BASE}/registrations`,
    create: "/",
    getAll: "/",
    pay: "/:id/pay",
    cancel: "/:id/cancel",
  },
} as const;
