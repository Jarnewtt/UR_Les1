import type { Metadata } from "next"
import type { ReactNode } from "react"
import LegalPageIndustrial from "@/components/LegalPageIndustrial"

export const metadata: Metadata = {
  title: "Cookie-instellingen",
  description:
    "Informatie over het cookiebeleid van Jarne Waterschoot. Lees hoe analytische en functionele cookies worden gebruikt op dit portfolio.",
  robots: { index: false, follow: false },
}

type LegalSection = { heading: string; body: ReactNode }

const UPDATED = "April 2025"

const sections: LegalSection[] = [
  {
    heading: "Wat zijn cookies?",
    body: (
      <p>
        Cookies zijn kleine tekstbestanden die door een website op uw apparaat
        worden opgeslagen wanneer u die website bezoekt. Ze worden gebruikt om
        de werking van de website te verbeteren, voorkeuren te onthouden en
        anoniem bezoekersgedrag bij te houden.
      </p>
    ),
  },
  {
    heading: "Analytische cookies",
    body: (
      <>
        <p style={{ marginBottom: 12 }}>
          Deze website maakt gebruik van <strong>Google Analytics</strong> om
          anonieme bezoekersstatistieken bij te houden, zoals het aantal bezoekers,
          de bezochte pagina&apos;s en de gebruikte apparaten. Deze gegevens zijn
          volledig geanonimiseerd en worden niet gekoppeld aan persoonlijke informatie.
        </p>
        <p>
          Het doel van deze analyse is uitsluitend om de inhoud en gebruikservaring
          van het portfolio te verbeteren.
        </p>
      </>
    ),
  },
  {
    heading: "Functionele cookies",
    body: (
      <p>
        Deze website gebruikt functionele cookies om uw voorkeuren te onthouden,
        zoals het kleurthema (donker of licht). Deze cookies zijn strikt noodzakelijk
        voor de correcte werking van de website en worden niet gebruikt voor
        marketingdoeleinden.
      </p>
    ),
  },
  {
    heading: "Cookies beheren of verwijderen",
    body: (
      <>
        <p style={{ marginBottom: 12 }}>
          U kunt cookies te allen tijde beheren of verwijderen via de instellingen
          van uw browser. Raadpleeg de helpfunctie van uw browser voor instructies:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Chrome: Instellingen → Privacy en beveiliging → Cookies</li>
          <li>Firefox: Opties → Privacy en beveiliging → Cookies</li>
          <li>Safari: Voorkeuren → Privacy → Cookies beheren</li>
          <li>Edge: Instellingen → Privacy, zoeken en services → Cookies</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Geen tracking voor advertenties",
    body: (
      <p>
        Er worden op deze website geen advertentiecookies of third-party tracking
        cookies gebruikt. Uw browsegedrag wordt niet gedeeld met advertentienetwerken
        of commerciële derden.
      </p>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalPageIndustrial
      code="Doc — 03 / Privacy"
      title="Cookie-instellingen"
      updated={UPDATED}
      sections={sections}
    />
  )
}
