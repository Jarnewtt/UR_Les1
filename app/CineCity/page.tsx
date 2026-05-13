import type { Metadata } from "next"
import CineCityPageIndustrial from "@/components/CineCityPageIndustrial"

export const metadata: Metadata = {
  title: "CineCity",
  description:
    "CineCity — een branding- en campagneproject van Jarne Waterschoot. Visuele identiteit, poster- en afficheontwerpvoor een cinematisch filmplatform.",
  openGraph: {
    title: "CineCity — Jarne Waterschoot",
    description:
      "CineCity — een branding- en campagneproject van Jarne Waterschoot. Visuele identiteit en affichesontwerp voor een cinematisch filmplatform.",
    url: "/CineCity",
    images: [{ url: "/img/CineCity_image.jpg", width: 1200, height: 630, alt: "CineCity — branding project door Jarne Waterschoot" }],
  },
  twitter: { images: ["/img/CineCity_image.jpg"] },
  other: {
    "description:fr": "CineCity — un projet de branding et de campagne par Jarne Waterschoot. Identité visuelle et conception d'affiches pour une plateforme cinématographique.",
    "description:en": "CineCity — a branding and campaign project by Jarne Waterschoot. Visual identity and poster design for a cinematic film platform.",
  },
}

export default function CineCityPage() {
  return <CineCityPageIndustrial />
}
