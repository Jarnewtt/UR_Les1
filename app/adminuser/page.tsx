import type { Metadata } from "next"
import AdminUserPageIndustrial from "@/components/AdminUserPageIndustrial"

export const metadata: Metadata = {
  title: "Beheerder",
  description: "Beheerderspagina van het portfolio van Jarne Waterschoot.",
  robots: { index: false, follow: false },
}

export default function AdminUserPage() {
  return <AdminUserPageIndustrial />
}
