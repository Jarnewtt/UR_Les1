"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ArchitectuurPageModern from "@/components/ArchitectuurPageModern";

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


export default function AdminPageModern() {
  // --- PAGE STATE ---
  const [titleTop, setTitleTop]       = useState("Hélène");
  const [titleBottom, setTitleBottom] = useState("Binet");
  const [tribute, setTribute]         = useState("De 5 Tegenstellingen");
  const [introText, setIntroText]     = useState("");
  const [panels, setPanels]           = useState<Panel[]>(defaultPanels);
  const [panelOpen, setPanelOpen]     = useState(false);

  // --- DRAGGABLE FLOAT ---
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
    const onTouchEnd = () => {
      dragRef.current.active = false;
      document.body.style.userSelect = "";
    };
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

  const handlePanelChange = (id: number, field: keyof Panel, value: string) => {
    setPanels(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="min-h-screen bg-black text-white font-light selection:bg-white selection:text-black outline-none">

      <style jsx>{`
        .admin-scroll::-webkit-scrollbar { width: 3px; }
        .admin-scroll::-webkit-scrollbar-track { background: transparent; }
        .admin-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .admin-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>

      {/* Page content — props drive the live preview */}
      <ArchitectuurPageModern
        heroTop={titleTop}
        heroBottom={titleBottom}
        tribute={tribute}
        introText={introText}
        panels={panels}
      />

      {/* Floating admin panel — B&W stijl */}
      <div
        ref={floatRef}
        style={{
          position: "fixed", top: 0, left: 0,
          transform: "translate(0px, 200px)",
          zIndex: 8000, display: "flex", alignItems: "flex-start",
          willChange: "transform",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.85))",
        }}
      >
        {/* Toggle — wit/grijs */}
        <button
          onClick={() => setPanelOpen(o => !o)}
          style={{
            background: panelOpen
              ? "linear-gradient(180deg,#2a2a2a,#111)"
              : "linear-gradient(180deg,#e8e8e8,#c0c0c0)",
            width: "52px", minHeight: "160px",
            borderRadius: panelOpen ? "14px 0 0 14px" : "14px",
            border: panelOpen ? "1px solid #333" : "1px solid #999",
            cursor: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: panelOpen
              ? "0 0 28px rgba(255,255,255,0.05)"
              : "0 0 28px rgba(255,255,255,0.15)",
            padding: 0, flexShrink: 0,
            transition: "background 0.2s, border-radius 0.2s, border-color 0.2s",
          }}
          title={panelOpen ? "Sluit paneel" : "Open beheer"}
        >
          {panelOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <span style={{
              color: "#111", fontWeight: 900, fontSize: "10px",
              letterSpacing: "0.22em", textTransform: "uppercase",
              writingMode: "vertical-rl", transform: "rotate(180deg)",
              userSelect: "none", lineHeight: 1,
            }}>BEHEER</span>
          )}
        </button>

        {/* Drawer — donker met witte accenten */}
        <div
          className="admin-scroll"
          style={{
            width: panelOpen ? "min(340px, calc(100vw - 52px))" : "0px",
            maxHeight: "calc(100vh - 80px)",
            overflowY: panelOpen ? "auto" : "hidden",
            overflowX: "hidden",
            transition: "width 0.32s cubic-bezier(0.4,0,0.2,1)",
            background: "rgba(8,8,8,0.98)",
            backdropFilter: "blur(24px)",
            borderRadius: "0 16px 16px 0",
            borderTop: panelOpen ? "1px solid #222" : "none",
            borderRight: panelOpen ? "1px solid #222" : "none",
            borderBottom: panelOpen ? "1px solid #222" : "none",
            borderLeft: "none",
            flexShrink: 0,
          }}
        >
          {panelOpen && (
            <div style={{ padding: "0 0 48px", minWidth: "min(340px, calc(100vw - 52px))" }}>

              {/* Drag handle */}
              <div
                onMouseDown={onHandleMouseDown}
                onTouchStart={onHandleTouchStart}
                style={{
                  background: "#0f0f0f",
                  borderBottom: "1px solid #1e1e1e",
                  padding: "10px 18px", cursor: "grab",
                  display: "flex", alignItems: "center", gap: "10px",
                  borderRadius: "0 16px 0 0",
                  userSelect: "none", touchAction: "none",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", opacity: 0.4 }}>
                  {[0,1,2].map(r => (
                    <div key={r} style={{ display: "flex", gap: "3px" }}>
                      {[0,1].map(c => (
                        <div key={c} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#fff" }} />
                      ))}
                    </div>
                  ))}
                </div>
                <span style={{ color: "#444", fontSize: "10px", letterSpacing: "0.1em" }}>Sleep om te verplaatsen</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.6)", display: "inline-block" }} />
                  <span style={{ color: "#888", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>LIVE</span>
                </div>
              </div>

              <div style={{ padding: "22px 22px 0" }}>
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ color: "#fff", fontSize: "12px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>Beheer Paneel</span>
                  <p style={{ color: "#444", fontSize: "11px", margin: "3px 0 0" }}>Pas de tentoonstelling live aan</p>
                </div>

                <AdminDivider />
                <AdminSectionTitle label="Hero Tekst" marker="01" />
                <AdminField label="Titel — Bovenste regel" hint='bv. "Hélène"' value={titleTop} onChange={setTitleTop} />
                <AdminField label="Titel — Onderste regel" hint='bv. "Binet"' value={titleBottom} onChange={setTitleBottom} />
                <AdminField label="Ondertitel / Toewijding" hint="Kleine cursieve tekst onder de hero" value={tribute} onChange={setTribute} />

                <AdminDivider />
                <AdminSectionTitle label="Inleidingstekst" marker="02" />
                <p style={{ color: "#444", fontSize: "11px", marginBottom: "8px" }}>Vervangt de standaard intro. Laat leeg voor de standaard tekst.</p>
                <textarea rows={4} value={introText} onChange={e => setIntroText(e.target.value)}
                  placeholder="Schrijf hier een korte inleiding…"
                  style={{ ...adminInputBase, resize: "vertical", minHeight: "88px", lineHeight: "1.55", marginBottom: "6px", fontFamily: "inherit" }}
                />

                <AdminDivider />
                <AdminSectionTitle label="Panelen" marker="03" />
                <p style={{ color: "#444", fontSize: "11px", marginBottom: "14px" }}>Bewerk per paneel de naam, het nummer en de afbeelding.</p>

                {panels.map(panel => (
                  <div key={panel.id} style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "10px", padding: "14px 14px 10px", marginBottom: "10px" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <span style={{ background: "transparent", border: "1px solid #333", color: "#888", fontWeight: 700, fontSize: "9px", letterSpacing: "0.13em", padding: "3px 9px", borderRadius: "20px", textTransform: "uppercase" }}>
                        {panel.sub}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <AdminMiniLabel text="Naam lijntype" />
                        <input value={panel.label} onChange={e => handlePanelChange(panel.id, "label", e.target.value)} placeholder="bv. Chaotische lijn" style={adminInputBase} />
                      </div>
                      <div style={{ width: "80px" }}>
                        <AdminMiniLabel text="Nummer" />
                        <input value={panel.sub} onChange={e => handlePanelChange(panel.id, "sub", e.target.value)} placeholder="Paneel 01" style={adminInputBase} />
                      </div>
                    </div>
                    <AdminMiniLabel text="Afbeeldingspad" />
                    <input value={panel.imagePath} onChange={e => handlePanelChange(panel.id, "imagePath", e.target.value)}
                      placeholder="/img/Paneel_1.jpg"
                      style={{ ...adminInputBase, fontFamily: "monospace", fontSize: "11px", color: "#777" }} />
                    <p style={{ color: "#2e2e2e", fontSize: "10px", marginTop: "4px" }}>Relatief pad vanuit de /public map</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminSectionTitle({ label, marker }: { label: string; marker: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
      <span style={{ color: "#333", fontSize: "9px", fontWeight: 700, fontFamily: "monospace" }}>{marker}</span>
      <div style={{ width: "16px", height: "1px", background: "#333" }} />
      <span style={{ color: "#ccc", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function AdminMiniLabel({ text }: { text: string }) {
  return <p style={{ color: "#555", fontSize: "10px", marginBottom: "4px", letterSpacing: "0.04em" }}>{text}</p>;
}

function AdminField({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", color: "#aaa", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} style={adminInputBase}
        onFocus={e => (e.currentTarget.style.borderColor = "#fff")}
        onBlur={e => (e.currentTarget.style.borderColor = "#222")} />
      <p style={{ color: "#383838", fontSize: "11px", marginTop: "4px" }}>{hint}</p>
    </div>
  );
}

function AdminDivider() {
  return <div style={{ borderTop: "1px solid #161616", margin: "20px 0" }} />;
}

const adminInputBase: React.CSSProperties = {
  width: "100%", padding: "9px 11px",
  background: "#000", border: "1px solid #222",
  borderRadius: "7px", color: "#e8e8e8", fontSize: "13px",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
};