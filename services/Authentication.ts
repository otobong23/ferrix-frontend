import authFetch from "@/utils/api";
import { AxiosResponse } from "axios";

// Helper function to clear all auth-related storage
const clearAuthStorage = () => {
  localStorage.removeItem("user");
  localStorage.clear();
  // Add any other storage mechanisms you use
};

export async function loginResponse(response: AxiosResponse<any, any, {}>) {
  const accessToken = response.data.access_token;
  // const refreshToken = response.data.result.refreshToken;

  if (!accessToken) {
    throw new Error("Login failed: access token missing");
  }

  const userData = {
    accessToken,
    userID: response.data.userID,
    email: response.data.email,
    sub: response.data.sub,    //user._id
    expires_at: response.data.user.expires_at
  };
  const expiresAt = response.data.user.expires_at; // seconds

  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", accessToken); // SINGLE SOURCE
  localStorage.setItem('tokenExpiresAt', expiresAt.toString());
  localStorage.setItem('role', 'user')

  authFetch.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return userData
}

export async function signUpUserAPI(details: SignupFormStateType) {
  const response = await authFetch.post("/auth/signup", details);
  return loginResponse(response)
}

export async function loginUserAPI(details: loginFormStateType) {
  const response = await authFetch.post("/auth/login", details)
  return loginResponse(response)
}

export async function requestCodeAPI(details: { email: string }) {
  const res = await authFetch.patch("/auth/sendVerificationCode", details)
  return res.data
}

export async function sendCodeAPI(details: { email: string, code: string }): Promise<string> {
  const res = await authFetch.patch("/auth/verify-code", details)
  const token = res.data.password_token;
  return token
}

export async function newPasswordAPI(details: { newPassword: string }, resetToken: string) {
  const res = await authFetch.patch("/auth/change-password", details,
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    }
  )
  return res.data
}

export async function logoutUser() {
  try {

    // 1. Clear client-side storage
    clearAuthStorage();

    // 2. Remove auth headers
    delete authFetch.defaults.headers.common['Authorization'];

    return "Logged out successfully";
  } catch (error) {
    // Fallback: Force client-side cleanup if server logout fails
    clearAuthStorage();
    delete authFetch.defaults.headers.common['Authorization'];
    return "Logged out (server unavailable)";
  }
}