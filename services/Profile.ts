
import authFetch from "@/utils/api";

export async function getProfileAPI(): Promise<UserType> {
   const res = await authFetch.get("/profile/")
   return res.data
}

export async function deleteProfileAPI() {
   const res = await authFetch.delete("/profile/")
   return res.data
}

export async function updateProfileAPI(details: Partial<UserType>): Promise<UserType> {
   const res = await authFetch.patch("/profile/update", details)
   console.log(res.data)
   return res.data
}

export async function updatePlanAPI(product: Product_Type, expiringDate: Date) {
   const { image, ...details } = product
   const res = await authFetch.patch("/profile/update-plan", {
    ...details,
    expiring_date: expiringDate.toDateString(),
  })
   return res.data
}

export async function getCrewAPI():Promise<CrewType> {
   const res = await authFetch.get("/crew");
   return res.data
}