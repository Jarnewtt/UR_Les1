import type { Metadata } from "next"
import HomePageIndustrial from "@/components/HomePageIndustrial"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welkom op het portfolio van Jarne Waterschoot — grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes.",
  openGraph: {
    title: "Jarne Waterschoot — Portfolio",
    description:
      "Welkom op het portfolio van Jarne Waterschoot — grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes.",
    url: "/home",
    images: [{ url: "/img/portfolio_about.png", width: 1200, height: 630, alt: "Jarne Waterschoot — Portfolio" }],
  },
  twitter: { images: ["/img/portfolio_about.png"] },
  other: {
    "description:fr": "Bienvenue sur le portfolio de Jarne Waterschoot — designer graphique spécialisé en branding, packaging et campagnes digitales.",
    "description:en": "Welcome to the portfolio of Jarne Waterschoot — graphic designer specializing in branding, packaging and digital campaigns.",
  },
}

export default function HomePage() {
  return <HomePageIndustrial />
}
