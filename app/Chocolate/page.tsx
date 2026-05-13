import type { Metadata } from "next"
import ChocolatePageIndustrial from "@/components/ChocolatePageIndustrial"

export const metadata: Metadata = {
  title: "Chocolate",
  description:
    "Chocolade verpakkingsontwerp — een project van Jarne Waterschoot. Premium productidentiteit, materiaalonderzoek en grafische uitwerking voor een chocolademerk.",
  openGraph: {
    title: "Chocolate — Jarne Waterschoot",
    description:
      "Premium chocolade verpakkingsontwerp door Jarne Waterschoot. Productidentiteit, materiaalonderzoek en grafische uitwerking.",
    url: "/Chocolate",
    images: [{ url: "/img/2526_BDL3_PACK_H1_WaterschootJ.jpg", width: 1200, height: 630, alt: "Chocolate — verpakkingsontwerp door Jarne Waterschoot" }],
  },
  twitter: { images: ["/img/2526_BDL3_PACK_H1_WaterschootJ.jpg"] },
  other: {
    "description:fr": "Conception d'emballage chocolat premium par Jarne Waterschoot. Identité produit, recherche de matériaux et développement graphique.",
    "description:en": "Premium chocolate packaging design by Jarne Waterschoot. Product identity, material research and graphic development.",
  },
}

export default function ChocolatePage() {
  return <ChocolatePageIndustrial />
}
