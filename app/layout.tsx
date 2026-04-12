// app/layout.tsx

import { AppToaster }          from "@/components/ui/toast"
import GlobalNavbar            from "@/components/GlobalNavbar"
import Footer                  from "@/components/Footer"
import GlobalCursor            from "@/components/GlobalCursor"
import Script                  from "next/script"
import GoogleAnalyticsTracker  from "@/components/GoogleAnalyticsTracker"
import { StyleProvider }       from "@/components/useStyle"
import IdleScreen from "@/components/IdleScreen"
import SurveyButton from "@/components/SurveyButton"
import "./globals.css"

export const metadata = {
  title: "Jarne Waterschoot — Portfolio",
  description: "Graphic designer gespecialiseerd in branding, packaging en digitale campagnes.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <style>{`
          @media (hover:hover) and (pointer:fine) {
            *, *::before, *::after { cursor: none !important; }
          }
        `}</style>
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

        <StyleProvider>
          {/* GlobalCursor staat hier — actief over navbar, pagina én footer */}
          <GlobalCursor />
          <IdleScreen />

          <GlobalNavbar  />

          <main className="flex-1 mx-auto w-full">
            {children}
          </main>

          <Footer />
          <SurveyButton />
        </StyleProvider>

        <AppToaster />

      </body>
    </html>
  )
}