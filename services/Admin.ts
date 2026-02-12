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

export async function getTotalUsersAPI(): Promise<number> {
  const res = await authFetch.get("/admin/totalUsers/")
  return res.data
}

export async function getUsersAPI(limit = 50, page = 1): Promise<{
  users: UserType[],
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  const res = await authFetch.get(`/admin/users?limit=${limit}&page=${page}`)
  return res.data
}

export async function viewUserAPI(email: string){
  const res = await authFetch.get(`/admin/user/${email}`)
  return res.data
}

export async function updateUserByAdminAPI(email: string, details: Partial<UserType>){
  const res = await authFetch.patch(`/admin/user/${email}`, details)
  return res.data
}