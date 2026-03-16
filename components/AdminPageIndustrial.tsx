"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ArchitectuurPageIndustrail from "@/components/ArchitectuurPageIndustrial"
;

type Panel = {
  id: number;
  imagePath: string;
  label: string;
  sub: string;
};

const defaultPanels: Panel[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  imagePath: `/img/Paneel_${i + 1}.jpg`,
  label: [
    "Chaotische lijn","Organische lijn","Geordende lijn","Abstracte lijn",
    "Rechte lijn","Ritmische lijn","Doorlopende lijn","Gebogen lijn",
    "Onregelmatige lijn","Onderbroken lijn","Scherpe lijn","Zachte lijn"
  ][i],
  sub: `Paneel ${String(i + 1).padStart(2,"0")}`,
}));

const SURVEY_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";

export default function AdminPage() {
  const [titleTop, setTitleTop]       = useState("Shadow &");
  const [titleBottom, setTitleBottom] = useState("Light");
  const [tribute, setTribute]         = useState("Een tribuut aan Hélène Binet");
  const [introText, setIntroText]     = useState("");
  const [panels, setPanels]           = useState<Panel[]>(defaultPanels);
  const [panelOpen, setPanelOpen]     = useState(false);

  const floatRef  = useRef<HTMLDivElement>(null);
  const posRef    = useRef({ x: 0, y: 200 });
  const dragRef   = useRef({ active: false, ox: 0, oy: 0 });

  // Apply position directly to DOM — zero React re-renders during drag
  const applyPos = useCallback((x: number, y: number) => {
    if (!floatRef.current) return;
    const maxX = window.innerWidth  - floatRef.current.offsetWidth;
    const maxY = window.innerHeight - 60;
    const cx = Math.max(0, Math.min(x, maxX));
    const cy = Math.max(0, Math.min(y, maxY));
    posRef.current = { x: cx, y: cy };
    floatRef.current.style.transform = `translate(${cx}px,${cy}px)`;
  }, []);

  // Attach global listeners once
  useEffect(() => {
    // Set initial position
    applyPos(0, 200);

    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      applyPos(
        e.clientX - dragRef.current.ox,
        e.clientY - dragRef.current.oy,
      );
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
      applyPos(
        t.clientX - dragRef.current.ox,
        t.clientY - dragRef.current.oy,
      );
    };

    const onTouchEnd = () => {
      dragRef.current.active = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove",  onMove,     { passive: true });
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
    dragRef.current = {
      active: true,
      ox: clientX - posRef.current.x,
      oy: clientY - posRef.current.y,
    };
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

  const handlePanelChange = (id: number, field: keyof Panel, value: string) => {
    setPanels(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <>
      <div style={{ width: "100%", minHeight: "100vh" }}>
        <ArchitectuurPageIndustrail
          heroTop={titleTop}
          heroBottom={titleBottom}
          tribute={tribute}
          introText={introText}
          panels={panels}
        />
      </div>

      {/* Floating panel — position via transform, NOT via left/top state */}
      <div
        ref={floatRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          transform: "translate(0px, 200px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "flex-start",
          willChange: "transform",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.65))",
        }}
      >
        {/* Toggle button */}
        <button
          onClick={() => setPanelOpen(o => !o)}
          style={{
            background: panelOpen
              ? "linear-gradient(180deg,#cc4400,#aa3300)"
              : "linear-gradient(180deg,#FF6B00,#E05500)",
            width: "52px",
            minHeight: "160px",
            borderRadius: panelOpen ? "14px 0 0 14px" : "14px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 28px rgba(255,107,0,0.55)",
            padding: 0,
            flexShrink: 0,
            transition: "background 0.2s, border-radius 0.2s",
          }}
          title={panelOpen ? "Sluit paneel" : "Open beheer"}
        >
          {panelOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <span style={{
              color: "#fff", fontWeight: 900, fontSize: "11px",
              letterSpacing: "0.22em", textTransform: "uppercase",
              writingMode: "vertical-rl", transform: "rotate(180deg)",
              userSelect: "none", lineHeight: 1,
            }}>
              BEHEER
            </span>
          )}
        </button>

        {/* Drawer */}
        <div style={{
          width: panelOpen ? "340px" : "0px",
          maxHeight: "calc(100vh - 80px)",
          overflowY: panelOpen ? "auto" : "hidden",
          overflowX: "hidden",
          transition: "width 0.32s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(10,10,10,0.96)",
          backdropFilter: "blur(20px)",
          borderRadius: "0 16px 16px 0",
          flexShrink: 0,
        }}>
          {panelOpen && (
            <div style={{ padding: "0 0 48px", minWidth: "340px" }}>

              {/* Drag handle */}
              <div
                onMouseDown={onHandleMouseDown}
                onTouchStart={onHandleTouchStart}
                style={{
                  background: "linear-gradient(90deg,#1a1a1a,#222)",
                  borderBottom: "1px solid #2a2a2a",
                  padding: "10px 18px",
                  cursor: "grab",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "0 16px 0 0",
                  userSelect: "none",
                  touchAction: "none",
                }}
              >
                {/* Grip dots */}
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", opacity: 0.6 }}>
                  {[0,1,2].map(r => (
                    <div key={r} style={{ display: "flex", gap: "3px" }}>
                      {[0,1].map(c => (
                        <div key={c} style={{
                          width: "3px", height: "3px",
                          borderRadius: "50%", background: "#FF6B00",
                        }} />
                      ))}
                    </div>
                  ))}
                </div>
                <span style={{ color: "#555", fontSize: "10px", letterSpacing: "0.1em" }}>
                  Sleep om te verplaatsen
                </span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#FF6B00", boxShadow: "0 0 8px #FF6B00",
                    display: "inline-block",
                  }} />
                  <span style={{ color: "#FF6B00", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>
                    LIVE
                  </span>
                </div>
              </div>

              <div style={{ padding: "22px 22px 0" }}>

                <div style={{ marginBottom: "20px" }}>
                  <span style={{
                    color: "#FF6B00", fontSize: "12px", fontWeight: 800,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                  }}>
                    Beheer Paneel
                  </span>
                  <p style={{ color: "#555", fontSize: "11px", margin: "3px 0 0" }}>
                    Pas de tentoonstelling live aan
                  </p>
                </div>

                {/* Survey button */}
                <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "9px", width: "100%", padding: "13px 0", marginBottom: "22px",
                    background: "linear-gradient(135deg,#FF6B00,#FFA040)",
                    color: "#fff", fontWeight: 800, fontSize: "12px",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    borderRadius: "10px", textDecoration: "none",
                    boxShadow: "0 4px 22px rgba(255,107,0,0.4)", boxSizing: "border-box",
                  }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0
                      2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 16h8v1H8v-1zm0-3h8v1H8v-1zm0-3h5v1H8v-1z"/>
                  </svg>
                  Vul de Google Enquête in
                </a>

                <Divider />
                <SectionTitle icon="🖼" label="Hero Tekst" />
                <Field label="Titel — Bovenste regel"
                  hint='Eerste deel van de grote paginatitel, bv. "Shadow &"'
                  value={titleTop} onChange={setTitleTop} />
                <Field label="Titel — Onderste regel"
                  hint='Tweede deel van de hoofdtitel, bv. "Light"'
                  value={titleBottom} onChange={setTitleBottom} />
                <Field label="Toewijding"
                  hint="Ondertitel die onder de hoofdtitel staat"
                  value={tribute} onChange={setTribute} />

                <Divider />
                <SectionTitle icon="📝" label="Inleidingstekst" />
                <p style={{ color: "#555", fontSize: "11px", marginBottom: "8px" }}>
                  Tekst boven de panelen. Laat leeg om over te slaan.
                </p>
                <textarea rows={4} value={introText}
                  onChange={e => setIntroText(e.target.value)}
                  placeholder="Schrijf hier een korte inleiding…"
                  style={{
                    ...inputBase, resize: "vertical", minHeight: "88px",
                    lineHeight: "1.55", marginBottom: "6px", fontFamily: "inherit",
                  }}
                />

                <Divider />
                <SectionTitle icon="🗂" label="Panelen" />
                <p style={{ color: "#555", fontSize: "11px", marginBottom: "14px" }}>
                  Bewerk per paneel de naam, het nummer en de afbeelding.
                </p>

                {panels.map(panel => (
                  <div key={panel.id} style={{
                    background: "#161616", border: "1.5px solid #252525",
                    borderRadius: "11px", padding: "14px 14px 10px", marginBottom: "10px",
                  }}>
                    <div style={{ marginBottom: "10px" }}>
                      <span style={{
                        background: "linear-gradient(135deg,#FF6B00,#FFA040)",
                        color: "#fff", fontWeight: 800, fontSize: "9px",
                        letterSpacing: "0.13em", padding: "3px 9px",
                        borderRadius: "20px", textTransform: "uppercase",
                      }}>
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
                      placeholder="/img/Paneel_1.png"
                      style={{ ...inputBase, fontFamily: "monospace", fontSize: "11px", color: "#aaa" }} />
                    <p style={{ color: "#3a3a3a", fontSize: "10px", marginTop: "4px" }}>
                      Relatief pad vanuit de /public map
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
      <span style={{ fontSize: "14px" }}>{icon}</span>
      <span style={{ color: "#FF6B00", fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function MiniLabel({ text }: { text: string }) {
  return (
    <p style={{ color: "#666", fontSize: "10px", marginBottom: "4px", letterSpacing: "0.04em" }}>
      {text}
    </p>
  );
}

function Field({ label, hint, value, onChange }: {
  label: string; hint: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", color: "#bbb", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
        {label}
      </label>
      <input value={value} onChange={e => onChange(e.target.value)} style={inputBase}
        onFocus={e => (e.currentTarget.style.borderColor = "#FF6B00")}
        onBlur={e => (e.currentTarget.style.borderColor = "#2e2e2e")}
      />
      <p style={{ color: "#4a4a4a", fontSize: "11px", marginTop: "4px" }}>{hint}</p>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #1f1f1f", margin: "20px 0" }} />;
}

const inputBase: React.CSSProperties = {
  width: "100%", padding: "9px 11px",
  background: "#0d0d0d", border: "1.5px solid #2e2e2e",
  borderRadius: "8px", color: "#f0f0f0", fontSize: "13px",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
}