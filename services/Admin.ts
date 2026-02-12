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

export async function getTotalUsersCountAPI(): Promise<number> {
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

export async function viewUserAPI(email: string): Promise<UserType> {
  const res = await authFetch.get(`/admin/user/${email}`)
  return res.data
}

export async function updateUserByAdminAPI(email: string, details: Partial<UserType>): Promise<UserType> {
  const res = await authFetch.patch(`/admin/user/${email}`, details)
  return res.data
}

export async function getUserByUserIdAPI(userID: string): Promise<UserType> {
  const res = await authFetch.get(`/admin/user?userID=${userID}`)
  return res.data
}

export async function searchUserAPI(keyword: string): Promise<UserType> {
  const res = await authFetch.get(`/admin/search/users?keyword=${keyword}`)
  return res.data
}


export async function getTotalCrewCountAPI(): Promise<number> {
  const res = await authFetch.get("/admin/totalCrews/")
  return res.data
}

export async function getCrewsAPI(limit = 50, page = 1): Promise<{
  crews: CrewType[],
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  const res = await authFetch.get(`/admin/crews?limit=${limit}&page=${page}`)
  return res.data
}

export async function getUserCrewAPI(userID: string): Promise<CrewType> {
  const res = await authFetch.get(`/admin/crew?userID=${userID}`)
  return res.data
}

export async function searchCrewAPI(keyword: string): Promise<CrewType> {
  const res = await authFetch.get(`/admin/search/crews?keyword=${keyword}`)
  return res.data
}