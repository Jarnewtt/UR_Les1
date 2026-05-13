import type { Metadata } from "next"
import ContactPageIndustrial from "@/components/ContactPageIndustrial"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met Jarne Waterschoot voor samenwerkingen, offertes of vragen. Beschikbaar voor branding- en ontwerpprojecten in België en daarbuiten.",
  openGraph: {
    title: "Contact — Jarne Waterschoot",
    description:
      "Neem contact op met Jarne Waterschoot voor samenwerkingen, offertes of vragen. Beschikbaar voor branding- en ontwerpprojecten.",
    url: "/contact",
    images: [{ url: "/img/portfolio_about.png", width: 1200, height: 630, alt: "Contact — Jarne Waterschoot" }],
  },
  twitter: { images: ["/img/portfolio_about.png"] },
  other: {
    "description:fr": "Contactez Jarne Waterschoot pour des collaborations, devis ou questions. Disponible pour des projets de branding et de design.",
    "description:en": "Get in touch with Jarne Waterschoot for collaborations, quotes or questions. Available for branding and design projects.",
  },
}

export default function ContactPage() {
  return <ContactPageIndustrial />
}
