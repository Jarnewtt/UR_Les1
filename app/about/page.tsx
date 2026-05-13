import type { Metadata } from "next"
import AboutPageIndustrial from "@/components/AboutPageIndustrial"

export const metadata: Metadata = {
  title: "Over mij",
  description:
    "Ontdek wie Jarne Waterschoot is — grafisch ontwerper met een passie voor branding, typografie en esthetische oplossingen die merken laten opvallen.",
  openGraph: {
    title: "Over mij — Jarne Waterschoot",
    description:
      "Ontdek wie Jarne Waterschoot is — grafisch ontwerper met een passie voor branding, typografie en esthetische oplossingen die merken laten opvallen.",
    url: "/about",
    images: [{ url: "/img/portfolio_about.png", width: 1200, height: 630, alt: "Jarne Waterschoot — grafisch ontwerper" }],
  },
  twitter: { images: ["/img/portfolio_about.png"] },
  other: {
    "description:fr": "Découvrez qui est Jarne Waterschoot — designer graphique passionné par le branding, la typographie et les solutions esthétiques qui font remarquer les marques.",
    "description:en": "Discover who Jarne Waterschoot is — graphic designer with a passion for branding, typography and aesthetic solutions that make brands stand out.",
  },
}

export default function AboutPage() {
  return <AboutPageIndustrial />
}
