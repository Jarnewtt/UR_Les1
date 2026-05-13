import type { Metadata } from "next"
import AdminPageIndustrial from "@/components/AdminPageIndustrial"

export const metadata: Metadata = {
  title: "Admin",
  description: "Beheerderspagina van het portfolio van Jarne Waterschoot.",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminPageIndustrial />
}
