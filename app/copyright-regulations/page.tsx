import type { Metadata } from "next"
import type { ReactNode } from "react"
import LegalPageIndustrial from "@/components/LegalPageIndustrial"

export const metadata: Metadata = {
  title: "Auteursrecht",
  description:
    "Auteursrechtinformatie van Jarne Waterschoot. Alle ontwerpen, illustraties en visuele creaties zijn beschermd onder het Belgisch auteursrecht.",
  robots: { index: false, follow: false },
}

type LegalSection = { heading: string; body: ReactNode }

const UPDATED = "April 2025"

const sections: LegalSection[] = [
  {
    heading: "Auteursrechtelijke bescherming",
    body: (
      <p>
        Alle werken op deze website — waaronder ontwerpen, illustraties, foto&apos;s,
        typografie, lay-outs en overige visuele creaties — vallen onder de bescherming
        van het Belgisch auteursrecht en de internationale auteursrechtverdragen.
        © {new Date().getFullYear()} Jarne Waterschoot. Alle rechten voorbehouden.
      </p>
    ),
  },
  {
    heading: "Eigendomsrechten",
    body: (
      <>
        <p style={{ marginBottom: 12 }}>
          Tenzij uitdrukkelijk anders vermeld, is Jarne Waterschoot de enige auteur
          en rechthebbende van alle inhoud op deze website. Dit omvat zowel gepubliceerde
          als niet-gepubliceerde werken die hier worden gepresenteerd.
        </p>
        <p>
          Sommige projecten zijn gerealiseerd in opdracht van derden. In die gevallen
          behoudt Jarne Waterschoot het morele auteursrecht; commerciële rechten kunnen
          bij de opdrachtgever berusten.
        </p>
      </>
    ),
  },
  {
    heading: "Verboden handelingen",
    body: (
      <p>
        Het reproduceren, verveelvoudigen, verspreiden, openbaar maken, bewerken of
        op enige andere wijze exploiteren van beschermd materiaal van deze website
        zonder uitdrukkelijke schriftelijke toestemming is ten strengste verboden.
        Hieronder valt ook het gebruik van afbeeldingen voor sociale media, drukwerk
        of commerciële doeleinden.
      </p>
    ),
  },
  {
    heading: "Toegestaan gebruik en licenties",
    body: (
      <>
        <p style={{ marginBottom: 12 }}>
          Voor het gebruik van inhoud van deze website — voor educatieve, journalistieke
          of commerciële doeleinden — dient voorafgaand schriftelijke toestemming te worden
          verkregen.
        </p>
        <p>
          Neem contact op via de contactpagina van dit portfolio voor licentieaanvragen
          of samenwerkingsvoorstellen.
        </p>
      </>
    ),
  },
  {
    heading: "Inspiratie versus kopiëren",
    body: (
      <p>
        Inspiratie laten opdoen is welkom. Werk kopiëren is dat niet.
        Bij twijfel: neem contact op.
      </p>
    ),
  },
]

export default function CopyrightPage() {
  return (
    <LegalPageIndustrial
      code="Doc — 02 / Juridisch"
      title="Auteursrecht"
      updated={UPDATED}
      sections={sections}
    />
  )
}
