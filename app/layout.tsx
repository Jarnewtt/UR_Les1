// app/layout.tsx

import { AppToaster }          from "@/components/ui/toast"
import GlobalNavbar            from "@/components/GlobalNavbar"
import Footer                  from "@/components/Footer"
import GlobalCursor            from "@/components/GlobalCursor"
import Script                  from "next/script"
import GoogleAnalyticsTracker  from "@/components/GoogleAnalyticsTracker"
import ScrollDepthTracker      from "@/components/ScrollDepthTracker"
import EngagementTracker       from "@/components/EngagementTracker"
import IdleScreen from "@/components/IdleScreen"
import SurveyButton from "@/components/SurveyButton"
import ContactButton from "@/components/ContactButton"
import "./globals.css"

export const metadata: import("next").Metadata = {
  metadataBase: new URL("https://jwcreative.netlify.app"),
  title: {
    default: "Jarne Waterschoot — Portfolio",
    template: "%s — Jarne Waterschoot",
  },
  description:
    "Grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes. Tactiele visuele verhalen voor merken die durven opvallen.",
  keywords: [
    "grafisch ontwerper", "branding", "verpakking", "portfolio", "Jarne Waterschoot", "België",
    "graphic designer", "packaging", "branding Belgium", "visual identity", "graphic design UK",
    "designer graphique", "identité visuelle", "packaging Belgique",
  ],
  authors: [{ name: "Jarne Waterschoot" }],
  creator: "Jarne Waterschoot",
  openGraph: {
    type: "website",
    locale: "nl_BE",
    alternateLocale: ["fr_BE", "fr_FR", "en_US", "en_GB"],
    siteName: "Jarne Waterschoot",
    title: "Jarne Waterschoot — Portfolio",
    description:
      "Grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes. Tactiele visuele verhalen voor merken die durven opvallen.",
    images: [
      {
        url: "/img/portfolio_about.png",
        width: 1200,
        height: 630,
        alt: "Jarne Waterschoot — Grafisch ontwerper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jarne Waterschoot — Portfolio",
    description:
      "Grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes.",
    creator: "@jarne_wtt",
    images: ["/img/portfolio_about.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "description:nl-BE":
      "Grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes. Tactiele visuele verhalen voor merken die durven opvallen.",
    "description:fr-BE":
      "Designer graphique spécialisé en branding, packaging et campagnes digitales. Des histoires visuelles tactiles pour les marques qui osent se démarquer — basé en Belgique.",
    "description:fr-FR":
      "Designer graphique spécialisé en branding, packaging et campagnes digitales. Des histoires visuelles tactiles pour les marques qui osent se démarquer.",
    "description:en-US":
      "Graphic designer specializing in branding, packaging and digital campaigns. Tactile visual stories for brands that dare to stand out.",
    "description:en-GB":
      "Graphic designer specialising in branding, packaging and digital campaigns. Tactile visual stories for brands that dare to stand out.",
    "og:see_also": "https://www.instagram.com/jarne_wtt/",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var h=new Date().getHours();var d=h<7||h>=19;document.documentElement.classList.toggle('theme-dark',d);document.documentElement.classList.toggle('theme-light',!d);}catch(e){}})();` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=Dancing+Script:wght@400;700&family=Inter:wght@300;400;500;600&family=Oswald:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Jarne Waterschoot",
              "url": "https://jwcreative.netlify.app",
              "email": "jarnewaterschoot@hotmail.com",
              "jobTitle": "Grafisch Ontwerper",
              "description": "Grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes.",
              "nationality": { "@type": "Country", "name": "Belgium" },
              "sameAs": [
                "https://www.instagram.com/jarne_wtt/",
                "mailto:jarnewaterschoot@hotmail.com"
              ],
              "knowsAbout": ["Branding", "Verpakkingsontwerp", "Grafisch ontwerp", "Digitale campagnes", "Typografie"],
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
        
        <GoogleAnalyticsTracker />
        <ScrollDepthTracker />
        <EngagementTracker />

        {/* GlobalCursor staat hier — actief over navbar, pagina én footer */}
        <GlobalCursor />
        <IdleScreen />

        <GlobalNavbar />

        <main className="flex-1 mx-auto w-full">
          {children}
        </main>

        <Footer />
        <SurveyButton />
        <ContactButton />

        <AppToaster />

      </body>
    </html>
  )
}