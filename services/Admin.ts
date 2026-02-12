import authFetch from "@/utils/api"
import { loginResponse } from "./Authentication"

export async function loginAdminAPI(details: loginFormStateType,) {
  const response = await authFetch.post("/admin/auth/login", details)

  return loginResponse(response, 'admin')
}