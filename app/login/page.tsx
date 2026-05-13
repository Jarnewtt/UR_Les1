import type { Metadata } from "next"
import LoginPageIndustrial from "@/components/LoginPageIndustrial"

export const metadata: Metadata = {
  title: "Inloggen",
  description: "Beheerdersinlogpagina van het portfolio van Jarne Waterschoot.",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginPageIndustrial />
}
