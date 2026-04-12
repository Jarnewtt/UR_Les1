"use client"

import { useStyle } from "@/components/useStyle"
import { AnimatePresence, motion } from "framer-motion"
import LegalPageModern    from "@/components/LegalPageModern"
import LegalPageIndustrial from "@/components/LegalPageIndustrial"
import type { LegalSection } from "@/components/LegalPageModern"

const UPDATED = "April 2025"

const sections: LegalSection[] = [
  {
    heading: "Doel van deze website",
    body: (
      <p>
        Deze website dient als persoonlijk portfolio van Jarne Waterschoot en is
        uitsluitend bedoeld ter presentatie van creatief en grafisch werk. De inhoud
        is samengesteld voor persoonlijke en professionele evaluatiedoeleinden.
      </p>
    ),
  },
  {
    heading: "Toegestaan gebruik",
    body: (
      <>
        <p style={{ marginBottom: 12 }}>
          Bezoekers mogen de inhoud van deze website bekijken voor persoonlijke
          of professionele evaluatie. Het delen van een link naar deze website
          is toegestaan.
        </p>
        <p>
          Het kopiëren, reproduceren, verspreiden of publiceren van enige inhoud
          — inclusief teksten, afbeeldingen, ontwerpen en visueel materiaal — is
          zonder voorafgaande schriftelijke toestemming van Jarne Waterschoot
          uitdrukkelijk verboden.
        </p>
      </>
    ),
  },
  {
    heading: "Intellectuele eigendom",
    body: (
      <p>
        Alle inhoud op deze website, waaronder maar niet beperkt tot ontwerpen,
        typografie, fotografie en concepten, is het exclusieve intellectuele
        eigendom van Jarne Waterschoot, tenzij uitdrukkelijk anders vermeld.
        Gebruik zonder toestemming kan juridische gevolgen hebben.
      </p>
    ),
  },
  {
    heading: "Aansprakelijkheid",
    body: (
      <p>
        Jarne Waterschoot is niet aansprakelijk voor enige directe of indirecte
        schade voortvloeiend uit het gebruik van of de onmogelijkheid tot gebruik
        van deze website, noch voor eventuele technische storingen of
        onnauwkeurigheden in de gepresenteerde inhoud.
      </p>
    ),
  },
  {
    heading: "Wijzigingen",
    body: (
      <p>
        Deze gebruiksvoorwaarden kunnen te allen tijde worden gewijzigd zonder
        voorafgaande kennisgeving. Het blijven gebruiken van de website na een
        wijziging impliceert aanvaarding van de bijgewerkte voorwaarden.
      </p>
    ),
  },
]

export default function TermsPage() {
  const { style } = useStyle()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={style}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {style === "industrial" ? (
          <LegalPageIndustrial
            code="Doc — 01 / Juridisch"
            title="Gebruiksvoorwaarden"
            updated={UPDATED}
            sections={sections}
          />
        ) : (
          <LegalPageModern
            number="Juridisch — 01"
            title="Gebruiksvoorwaarden"
            updated={UPDATED}
            sections={sections}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
