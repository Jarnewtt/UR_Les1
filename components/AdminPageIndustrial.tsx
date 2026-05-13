"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ArchitectuurPageIndustrail from "@/components/ArchitectuurPageIndustrial";
import { trackPanelToggle } from "@/lib/analytics";

type Panel = { id: number; imagePath: string; label: string; sub: string };
type Slide = { src: string; caption: string };

const ACCENT = "#C9A96E";
const FONT_PRESETS = [
  { label: "Bebas Neue",       value: "Bebas Neue",       preview: "BEBAS" },
  { label: "Playfair Display", value: "Playfair Display", preview: "Playfair" },
  { label: "Anton",            value: "Anton",            preview: "ANTON" },
  { label: "Oswald",           value: "Oswald",           preview: "OSWALD" },
];

const defaultPanels: Panel[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  imagePath: `/img/Paneel_${i + 1}.jpg`,
  label: [
    "Chaotische lijn","Organische lijn","Geordende lijn","Abstracte lijn",
    "Rechte lijn","Ritmische lijn","Doorlopende lijn","Gebogen lijn",
    "Onregelmatige lijn","Onderbroken lijn","Scherpe lijn","Zachte lijn",
  ][i],
  sub: `Paneel ${String(i + 1).padStart(2,"0")}`,
}));

const defaultGallery = Array.from({ length: 10 }, (_, i) => `/img/Gallerij_${i + 1}.jpg`);
const defaultSlides: Slide[] = [
  { src: "/img/Gallerij_1.jpg", caption: "Licht als architectuur" },
  { src: "/img/Gallerij_3.jpg", caption: "Lijn als herinnering" },
  { src: "/img/Gallerij_2.jpg", caption: "Schaduw als taal" },
];

type Section = "tekst" | "stijl" | "hero" | "galerij" | "panelen";

export default function AdminPage() {
  // Content
  const [titleTop,    setTitleTop]    = useState("Schaduw &");
  const [titleBottom, setTitleBottom] = useState("Licht");
  const [tribute,     setTribute]     = useState("Een tribuut aan Hélène Binet");
  const [introText,   setIntroText]   = useState("");

  // Style
  const [accentColor,  setAccentColor]  = useState(ACCENT);
  const [headingFont,  setHeadingFont]  = useState("Bebas Neue");

  // Media
  const [heroSlides,    setHeroSlides]    = useState<Slide[]>(defaultSlides);
  const [galleryImages, setGalleryImages] = useState<string[]>(defaultGallery);

  // Panels
  const [panels, setPanels] = useState<Panel[]>(defaultPanels);

  // UI
  const [panelOpen,      setPanelOpen]      = useState(false);
  const [activeSection,  setActiveSection]  = useState<Section>("tekst");

  const floatRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef({ x: 0, y: 200 });
  const dragRef  = useRef({ active: false, ox: 0, oy: 0 });

  const applyPos = useCallback((x: number, y: number) => {
    if (!floatRef.current) return;
    const maxX = window.innerWidth  - floatRef.current.offsetWidth;
    const maxY = window.innerHeight - 60;
    const cx = Math.max(0, Math.min(x, maxX));
    const cy = Math.max(0, Math.min(y, maxY));
    posRef.current = { x: cx, y: cy };
    floatRef.current.style.transform = `translate(${cx}px,${cy}px)`;
  }, []);

  useEffect(() => {
    applyPos(0, 200);
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      applyPos(e.clientX - dragRef.current.ox, e.clientY - dragRef.current.oy);
    };
    const onUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      if (floatRef.current) floatRef.current.style.cursor = "";
      document.body.style.userSelect = "";
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.active) return;
      e.preventDefault();
      const t = e.touches[0];
      applyPos(t.clientX - dragRef.current.ox, t.clientY - dragRef.current.oy);
    };
    const onTouchEnd = () => { dragRef.current.active = false; document.body.style.userSelect = ""; };
    window.addEventListener("mousemove",  onMove,      { passive: true });
    window.addEventListener("mouseup",    onUp);
    window.addEventListener("touchmove",  onTouchMove, { passive: false });
    window.addEventListener("touchend",   onTouchEnd);
    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [applyPos]);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    dragRef.current = { active: true, ox: clientX - posRef.current.x, oy: clientY - posRef.current.y };
    document.body.style.userSelect = "none";
    if (floatRef.current) floatRef.current.style.cursor = "grabbing";
  }, []);

  const onHandleMouseDown = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["input","textarea","button","a","select"].includes(tag)) return;
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
  };
  const onHandleTouchStart = (e: React.TouchEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["input","textarea","button","a","select"].includes(tag)) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handlePanelChange = (id: number, field: keyof Panel, value: string) =>
    setPanels(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const handleSlideChange = (i: number, field: keyof Slide, value: string) =>
    setHeroSlides(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  const handleGalleryChange = (i: number, value: string) =>
    setGalleryImages(prev => prev.map((v, idx) => idx === i ? value : v));

  const NAV: { id: Section; label: string }[] = [
    { id: "tekst",   label: "Tekst"   },
    { id: "stijl",   label: "Stijl"   },
    { id: "hero",    label: "Hero"    },
    { id: "galerij", label: "Galerij" },
    { id: "panelen", label: "Panelen" },
  ];

  return (
    <>
      <style>{`
        .admin-drag-hint { display: flex; }
        .admin-toggle { min-height: 160px; }
        @media (max-width: 640px) {
          .admin-drag-hint { display: none !important; }
          .admin-toggle { min-height: 80px !important; }
          .admin-panel-input { font-size: 16px !important; padding: 10px 12px !important; }
        }
      `}</style>

      <div style={{ width: "100%" }}>
        <ArchitectuurPageIndustrail
          heroTop={titleTop}
          heroBottom={titleBottom}
          tribute={tribute}
          introText={introText}
          panels={panels}
          accentColor={accentColor}
          headingFont={headingFont}
          galleryImages={galleryImages}
          heroSlides={heroSlides}
        />
      </div>

      {/* Floating admin panel */}
      <div
        ref={floatRef}
        style={{
          position: "fixed", top: 0, left: 0,
          transform: "translate(0px, 200px)",
          zIndex: 8000, display: "flex", alignItems: "flex-start",
          willChange: "transform",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.65))",
        }}
      >
        {/* Toggle button */}
        <button
          className="admin-toggle"
          onClick={() => { const next = !panelOpen; setPanelOpen(next); trackPanelToggle('admin', next ? 'open' : 'close'); }}
          style={{
            background: panelOpen ? "#0F0FCC" : "#1A1AFF",
            width: "52px", minHeight: "160px", borderRadius: 0,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(26,26,255,0.55)",
            padding: 0, flexShrink: 0, transition: "background 0.2s",
          }}
          title={panelOpen ? "Sluit paneel" : "Open beheer"}
        >
          {panelOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <span style={{
              color: "#fff", fontWeight: 900, fontSize: "16px",
              letterSpacing: "0.22em", textTransform: "uppercase",
              writingMode: "vertical-rl", transform: "rotate(180deg)",
              userSelect: "none", lineHeight: 1,
            }}>BEHEER</span>
          )}
        </button>

        {/* Drawer */}
        <div style={{
          width: panelOpen ? "min(360px, calc(100vw - 52px))" : "0px",
          maxHeight: "calc(100vh - 20px)",
          overflowY: panelOpen ? "auto" : "hidden",
          overflowX: "hidden",
          transition: "width 0.32s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(10,10,10,0.97)",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
        }}>
          {panelOpen && (
            <div style={{ minWidth: "min(360px, calc(100vw - 52px))" }}>

              {/* Drag handle */}
              <div
                onMouseDown={onHandleMouseDown}
                onTouchStart={onHandleTouchStart}
                style={{
                  background: "linear-gradient(90deg,#1a1a1a,#222)",
                  borderBottom: "1px solid #2a2a2a",
                  padding: "10px 18px", cursor: "grab",
                  display: "flex", alignItems: "center", gap: "10px",
                  userSelect: "none", touchAction: "none",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", opacity: 0.6 }}>
                  {[0,1,2].map(r => (
                    <div key={r} style={{ display: "flex", gap: "3px" }}>
                      {[0,1].map(c => (
                        <div key={c} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#1A1AFF" }} />
                      ))}
                    </div>
                  ))}
                </div>
                <span className="admin-drag-hint" style={{ color: "#555", fontSize: "13px", letterSpacing: "0.1em" }}>
                  Sleep om te verplaatsen
                </span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1A1AFF", boxShadow: "0 0 8px #1A1AFF", display: "inline-block" }} />
                  <span style={{ color: "#1A1AFF", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em" }}>LIVE</span>
                </div>
              </div>

              {/* Section nav */}
              <div style={{ display: "flex", borderBottom: "1px solid #1f1f1f" }}>
                {NAV.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setActiveSection(n.id)}
                    style={{
                      flex: 1, padding: "10px 0",
                      background: activeSection === n.id ? "#1A1AFF" : "none",
                      border: "none", cursor: "pointer",
                      color: activeSection === n.id ? "#fff" : "#555",
                      fontSize: "11px", fontWeight: 700,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>

              {/* Section content */}
              <div style={{ padding: "22px 22px 48px" }}>

                {/* ── TEKST ── */}
                {activeSection === "tekst" && (
                  <div>
                    <SectionTitle label="Hero Tekst" />
                    <Field label="Titel — Bovenste regel"
                      hint='Eerste deel van de grote paginatitel, bv. "Schaduw &"'
                      value={titleTop} onChange={setTitleTop} />
                    <Field label="Titel — Onderste regel"
                      hint='Tweede deel van de hoofdtitel, bv. "Licht"'
                      value={titleBottom} onChange={setTitleBottom} />
                    <Field label="Toewijding"
                      hint="Ondertitel die onder de hoofdtitel staat"
                      value={tribute} onChange={setTribute} />
                    <Divider />
                    <SectionTitle label="Inleidingstekst" />
                    <p style={{ color: "#555", fontSize: "13px", marginBottom: "8px" }}>
                      Tekst boven de panelen. Laat leeg om over te slaan.
                    </p>
                    <textarea rows={4} value={introText}
                      onChange={e => setIntroText(e.target.value)}
                      placeholder="Schrijf hier een korte inleiding…"
                      style={{ ...inputBase, resize: "vertical", minHeight: "88px", lineHeight: "1.55", fontFamily: "inherit" }}
                    />
                  </div>
                )}

                {/* ── STIJL ── */}
                {activeSection === "stijl" && (
                  <div>
                    <SectionTitle label="Kleuraccent" />
                    <p style={{ color: "#555", fontSize: "13px", marginBottom: "12px" }}>
                      De accentkleur die door de hele pagina gebruikt wordt.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <input
                        type="color"
                        value={accentColor}
                        onChange={e => setAccentColor(e.target.value)}
                        style={{ width: 44, height: 44, border: "1.5px solid #2e2e2e", borderRadius: 0, padding: 2, background: "#0d0d0d", cursor: "pointer" }}
                      />
                      <input
                        value={accentColor}
                        onChange={e => setAccentColor(e.target.value)}
                        placeholder="#C9A96E"
                        style={{ ...inputBase, flex: 1, fontFamily: "monospace" }}
                      />
                      <button
                        onClick={() => setAccentColor(ACCENT)}
                        style={{ padding: "9px 14px", background: "none", border: "1.5px solid #2e2e2e", color: "#666", fontSize: "11px", letterSpacing: "0.12em", cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        Reset
                      </button>
                    </div>

                    {/* Color presets */}
                    <p style={{ color: "#444", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Snelle keuzes</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                      {[
                        { label: "Goud",    color: "#C9A96E" },
                        { label: "Kobalt",  color: "#1A1AFF" },
                        { label: "Ivoor",   color: "#F0EDE8" },
                        { label: "Rood",    color: "#CC2200" },
                        { label: "Groen",   color: "#2E7D52" },
                        { label: "Zilver",  color: "#9A9A98" },
                      ].map(p => (
                        <button
                          key={p.color}
                          onClick={() => setAccentColor(p.color)}
                          title={p.label}
                          style={{
                            width: 32, height: 32,
                            background: p.color,
                            border: accentColor === p.color ? "2px solid #fff" : "2px solid transparent",
                            cursor: "pointer",
                            boxShadow: accentColor === p.color ? `0 0 0 1px ${p.color}` : "none",
                            transition: "border 0.15s",
                          }}
                        />
                      ))}
                    </div>

                    <Divider />
                    <SectionTitle label="Typografie" />
                    <p style={{ color: "#555", fontSize: "13px", marginBottom: "14px" }}>
                      Lettertype voor titels en kopjes.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {FONT_PRESETS.map(f => (
                        <button
                          key={f.value}
                          onClick={() => setHeadingFont(f.value)}
                          style={{
                            padding: "14px 12px",
                            background: headingFont === f.value ? "#1A1AFF" : "#161616",
                            border: headingFont === f.value ? "1.5px solid #1A1AFF" : "1.5px solid #252525",
                            cursor: "pointer",
                            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
                            transition: "background 0.2s, border-color 0.2s",
                          }}
                        >
                          <span style={{
                            fontSize: "22px", lineHeight: 1,
                            color: headingFont === f.value ? "#fff" : "#ccc",
                            fontFamily: `'${f.value}', sans-serif`,
                          }}>
                            {f.preview}
                          </span>
                          <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: headingFont === f.value ? "rgba(255,255,255,0.7)" : "#555" }}>
                            {f.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── HERO ── */}
                {activeSection === "hero" && (
                  <div>
                    <SectionTitle label="Hero Slideshow" />
                    <p style={{ color: "#555", fontSize: "13px", marginBottom: "16px" }}>
                      3 afbeeldingen die automatisch wisselen in de hero.
                    </p>
                    {heroSlides.map((slide, i) => (
                      <div key={i} style={{ background: "#161616", border: "1.5px solid #252525", padding: "14px", marginBottom: "10px" }}>
                        <div style={{ marginBottom: "10px" }}>
                          <span style={{ background: "#1A1AFF", color: "#fff", fontWeight: 800, fontSize: "13px", letterSpacing: "0.13em", padding: "3px 9px", textTransform: "uppercase" }}>
                            Slide {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <MiniLabel text="Afbeeldingspad" />
                        <input
                          value={slide.src}
                          onChange={e => handleSlideChange(i, "src", e.target.value)}
                          placeholder="/img/Gallerij_1.jpg"
                          style={{ ...inputBase, fontFamily: "monospace", fontSize: "13px", color: "#aaa", marginBottom: 8 }}
                        />
                        <MiniLabel text="Bijschrift" />
                        <input
                          value={slide.caption}
                          onChange={e => handleSlideChange(i, "caption", e.target.value)}
                          placeholder="bv. Licht als architectuur"
                          style={inputBase}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ── GALERIJ ── */}
                {activeSection === "galerij" && (
                  <div>
                    <SectionTitle label="Fotogalerij" />
                    <p style={{ color: "#555", fontSize: "13px", marginBottom: "16px" }}>
                      10 afbeeldingen in het fotografisch archief onderaan.
                    </p>
                    {galleryImages.map((src, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <span style={{ color: "#1A1AFF", fontSize: "13px", fontWeight: 800, letterSpacing: "0.1em", width: 24, flexShrink: 0 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <input
                          value={src}
                          onChange={e => handleGalleryChange(i, e.target.value)}
                          placeholder={`/img/Gallerij_${i + 1}.jpg`}
                          style={{ ...inputBase, fontFamily: "monospace", fontSize: "13px", color: "#aaa" }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ── PANELEN ── */}
                {activeSection === "panelen" && (
                  <div>
                    <SectionTitle label="Leporello Panelen" />
                    <p style={{ color: "#555", fontSize: "13px", marginBottom: "14px" }}>
                      12 panelen in de uitvouwbare leporello sectie.
                    </p>
                    {panels.map(panel => (
                      <div key={panel.id} style={{ background: "#161616", border: "1.5px solid #252525", padding: "14px 14px 10px", marginBottom: "10px" }}>
                        <div style={{ marginBottom: "10px" }}>
                          <span style={{ background: "#1A1AFF", color: "#fff", fontWeight: 800, fontSize: "13px", letterSpacing: "0.13em", padding: "3px 9px", textTransform: "uppercase" }}>
                            {panel.sub}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                          <div style={{ flex: 1 }}>
                            <MiniLabel text="Naam lijntype" />
                            <input value={panel.label}
                              onChange={e => handlePanelChange(panel.id, "label", e.target.value)}
                              placeholder="bv. Chaotische lijn" style={inputBase} />
                          </div>
                          <div style={{ width: "80px" }}>
                            <MiniLabel text="Nummer" />
                            <input value={panel.sub}
                              onChange={e => handlePanelChange(panel.id, "sub", e.target.value)}
                              placeholder="Paneel 01" style={inputBase} />
                          </div>
                        </div>
                        <MiniLabel text="Afbeeldingspad" />
                        <input value={panel.imagePath}
                          onChange={e => handlePanelChange(panel.id, "imagePath", e.target.value)}
                          placeholder="/img/Paneel_1.jpg"
                          style={{ ...inputBase, fontFamily: "monospace", fontSize: "13px", color: "#aaa" }} />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <span style={{ color: "#1A1AFF", fontSize: "13px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function MiniLabel({ text }: { text: string }) {
  return <p style={{ color: "#666", fontSize: "12px", marginBottom: "4px", letterSpacing: "0.04em" }}>{text}</p>;
}

function Field({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", color: "#bbb", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
        {label}
      </label>
      <input value={value} onChange={e => onChange(e.target.value)} style={inputBase}
        onFocus={e => (e.currentTarget.style.borderColor = "#1A1AFF")}
        onBlur={e => (e.currentTarget.style.borderColor = "#2e2e2e")}
      />
      <p style={{ color: "#4a4a4a", fontSize: "12px", marginTop: "4px" }}>{hint}</p>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #1f1f1f", margin: "20px 0" }} />;
}

const inputBase: React.CSSProperties = {
  width: "100%", padding: "9px 11px",
  background: "#0d0d0d", border: "1.5px solid #2e2e2e",
  color: "#f0f0f0", fontSize: "13px",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
};
