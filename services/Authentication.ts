import authFetch from "@/utils/api";

export async function signUpUserAPI(details: loginFormStateType) {
  const response = await authFetch.post("/auth/signup", details);
  return response.data;
}