import type { Metadata } from "next"
import ProjectsPageIndustrial from "@/components/ProjectsPageIndustrial"

export const metadata: Metadata = {
  title: "Projecten",
  description:
    "Bekijk alle projecten van Jarne Waterschoot — branding, verpakkingsontwerp, digitale campagnes en meer. Een selectie van zijn sterkste werk.",
  openGraph: {
    title: "Projecten — Jarne Waterschoot",
    description:
      "Bekijk alle projecten van Jarne Waterschoot — branding, verpakkingsontwerp, digitale campagnes en meer.",
    url: "/projects",
    images: [{ url: "/img/CineCity_image.jpg", width: 1200, height: 630, alt: "Projecten — Jarne Waterschoot" }],
  },
  twitter: { images: ["/img/CineCity_image.jpg"] },
  other: {
    "description:fr": "Découvrez tous les projets de Jarne Waterschoot — branding, packaging, campagnes digitales et plus encore.",
    "description:en": "Browse all projects by Jarne Waterschoot — branding, packaging design, digital campaigns and more.",
  },
}

export default function ProjectsPage() {
  return <ProjectsPageIndustrial />
}
