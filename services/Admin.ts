import authFetch from "@/utils/api"
import { loginResponse } from "./Authentication"

export async function loginAdminAPI(details: loginFormStateType,) {
  const response = await authFetch.post("/admin/auth/login", details)

  return loginResponse(response, 'admin')
}


export async function getAdminAPI(): Promise<AdminType> {
  const res = await authFetch.get("/admin/profile/")
   return res.data
}


export async function updateAdminAPI(details: Partial<AdminType>): Promise<AdminType> {
  const res = await authFetch.patch("/admin/updateAdmin/", details)
   return res.data
}