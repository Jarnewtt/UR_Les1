import GlobalNavbarIndustrial from "@/components/GlobalNavbarIndustrial"

export default function GlobalNavbar() {
  return (
    <>
      <GlobalNavbarIndustrial />
      <div aria-hidden style={{ height: "var(--navbar-h, 72px)", flexShrink: 0 }} />
    </>
  )
}
