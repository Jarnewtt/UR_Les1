import type { Metadata } from "next"
import HomePageIndustrial from "@/components/HomePageIndustrial"

export const metadata: Metadata = {
  title: "Jarne Waterschoot — Portfolio",
  description:
    "Welkom op het portfolio van Jarne Waterschoot — grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes.",
  openGraph: {
    title: "Jarne Waterschoot — Portfolio",
    description:
      "Welkom op het portfolio van Jarne Waterschoot — grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes.",
    url: "/",
  },
}

export default function RootPage() {
  return <HomePageIndustrial />
}
