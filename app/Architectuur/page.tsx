import type { Metadata } from "next"
import ArchitectuurPageIndustrial from "@/components/ArchitectuurPageIndustrial"

export const metadata: Metadata = {
  title: "Hélène Binet",
  description:
    "Hélène Binet — een architectuurfotografie-project van Jarne Waterschoot. Boekontwerp, leporello en typografische uitwerking rond het werk van Hélène Binet.",
  openGraph: {
    title: "Hélène Binet — Jarne Waterschoot",
    description:
      "Boekontwerp en leporello rond de architectuurfotografie van Hélène Binet. Een project van Jarne Waterschoot.",
    url: "/Architectuur",
    images: [{ url: "/img/Bewerkt_Mons.jpg", width: 1200, height: 630, alt: "Hélène Binet — boekontwerp door Jarne Waterschoot" }],
  },
  twitter: { images: ["/img/Bewerkt_Mons.jpg"] },
  other: {
    "description:fr": "Conception de livre et leporello autour de la photographie d'architecture d'Hélène Binet. Un projet de Jarne Waterschoot.",
    "description:en": "Book design and leporello around the architectural photography of Hélène Binet. A project by Jarne Waterschoot.",
  },
}

export default function ArchitectuurPage() {
  return <ArchitectuurPageIndustrial />
}
