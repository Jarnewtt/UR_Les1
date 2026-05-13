const fire = (event: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}

// ── Paginagedrag ───────────────────────────────────────────────────────────────
// Hoever scrollt een bezoeker op een pagina?
export const trackScrollDepth = (depth: 25 | 50 | 75 | 100, page: string) =>
  fire('scroll_depth', { depth_percent: depth, page_path: page })

// Hoelang blijft een bezoeker op een pagina?
export const trackTimeOnPage = (seconds: number, page: string) =>
  fire('time_on_page', { duration_seconds: seconds, page_path: page })

// ── Navigatie ─────────────────────────────────────────────────────────────────
// Welk navbar-element wordt geklikt? (logo, menunaam, menu_open, menu_close)
export const trackNavClick = (element: string, destination: string) =>
  fire('nav_click', { element_name: element, destination_url: destination })

// Vorige / volgende / overzicht in de projectnavigatie onderaan een projectpagina
export const trackProjectNav = (
  direction: 'prev' | 'next' | 'overview',
  fromProject: string,
  toProject?: string
) => fire('project_nav_click', { direction, from_project: fromProject, to_project: toProject ?? '' })

// ── CTA-knoppen & links ───────────────────────────────────────────────────────
// Grote call-to-action knoppen (bv. "Bekijk Werk", "Neem contact op")
export const trackCTAClick = (buttonName: string, page: string) =>
  fire('cta_click', { button_name: buttonName, page_path: page })

// Instagram / e-mail links
export const trackSocialClick = (platform: 'instagram' | 'email', page: string) =>
  fire('social_link_click', { platform, page_path: page })

// Generieke tekstlinks
export const trackLinkClick = (linkName: string, destination: string, page: string) =>
  fire('link_click', { link_name: linkName, destination_url: destination, page_path: page })

// ── Footer ────────────────────────────────────────────────────────────────────
// De pijl-knop onderaan die de footer opent of sluit
export const trackFooterToggle = (action: 'open' | 'close') =>
  fire('footer_toggle', { action })

// Cookie-instellingen / Gebruiksvoorwaarden / Auteursrecht links in de footer
export const trackFooterLinkClick = (linkName: string) =>
  fire('footer_link_click', { link_name: linkName })

// ── Contact-paneel ────────────────────────────────────────────────────────────
// De blauwe "Contact" knop linksonder (of rechtsonder op mobiel)
export const trackContactToggle = (action: 'open' | 'close') =>
  fire('contact_panel_toggle', { action })

// ── Enquête-paneel ────────────────────────────────────────────────────────────
// De blauwe "Enquête" knop rechtsonder
export const trackSurveyToggle = (action: 'open' | 'close') =>
  fire('survey_panel_toggle', { action })

// Bezoeker markeert de enquête als ingediend
export const trackSurveySubmit = () =>
  fire('survey_submit', { source: 'survey_panel' })

// ── Lightbox ──────────────────────────────────────────────────────────────────
// Welk beeld wordt geopend in de lightbox, en op welke pagina?
export const trackLightboxOpen = (itemIndex: string, page: string) =>
  fire('lightbox_open', { item_index: itemIndex, page_path: page })

// Lightbox gesloten (via X, Escape of klik buiten het beeld)
export const trackLightboxClose = (page: string) =>
  fire('lightbox_close', { page_path: page })

// Vorige of volgende beeld in de lightbox
export const trackLightboxNav = (direction: 'prev' | 'next', toIndex: string) =>
  fire('lightbox_nav', { direction, to_index: toIndex })

// ── Geluid ────────────────────────────────────────────────────────────────────
// Geluid aan/uit op de CineCity pagina
export const trackSoundToggle = (action: 'mute' | 'unmute', page: string) =>
  fire('sound_toggle', { action, page_path: page })

// ── Thema ─────────────────────────────────────────────────────────────────────
// Bezoeker schakelt tussen licht en donker thema via de navbar
export const trackThemeChange = (theme: 'dark' | 'light') =>
  fire('theme_change', { theme_mode: theme })

// ── Carousel / slides ─────────────────────────────────────────────────────────
// Bezoeker navigeert naar een andere slide (homepage hero, Architectuur)
export const trackSlideChange = (index: number, page: string) =>
  fire('carousel_slide_change', { slide_index: index, page_path: page })

// ── Projectkaarten ────────────────────────────────────────────────────────────
// Klik op een projectkaart of -link richting een projectpagina
export const trackProjectClick = (projectName: string, destination: string, page: string) =>
  fire('project_card_click', { project_name: projectName, destination_url: destination, page_path: page })

// ── Formulieren ───────────────────────────────────────────────────────────────
// Formulier ingediend op de loginpagina
export const trackFormSubmit = (formName: string, page: string) =>
  fire('form_submit', { form_name: formName, page_path: page })

// Schakelen tussen tabs (bv. Login / Registreren)
export const trackTabSwitch = (tabName: string, page: string) =>
  fire('tab_switch', { tab_name: tabName, page_path: page })

// Wachtwoord tonen/verbergen in het loginformulier
export const trackPasswordToggle = (visible: boolean) =>
  fire('password_field_toggle', { is_visible: visible })

// ── UI-interacties ────────────────────────────────────────────────────────────
// Een uitklapbaar paneel openen/sluiten (bv. admin-paneel)
export const trackPanelToggle = (panelName: string, action: 'open' | 'close') =>
  fire('panel_toggle', { panel_name: panelName, action })

// Een accordion-element openen/sluiten (bv. leporello op Architectuur)
export const trackAccordionToggle = (label: string, action: 'open' | 'close', page: string) =>
  fire('accordion_toggle', { element_name: label, action, page_path: page })

// Bezoeker was inactief en heeft het idle-scherm gesloten
export const trackIdleWake = () =>
  fire('idle_screen_dismissed', { source: 'idle_overlay' })

// Bezoeker hoverde lang genoeg over een element om als engagement te tellen
export const trackHoverEngagement = (element: string, page: string) =>
  fire('hover_engagement', { element_name: element, page_path: page })
