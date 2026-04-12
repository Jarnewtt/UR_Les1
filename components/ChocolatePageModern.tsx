"use client";
import { useState, useEffect } from "react";

type Tokens = {
  bg: string;
  bgAlt: string;
  ink: string;
  inkSub: string;
  heroInk: string;
  heroInkSub: string;
  amber: string;
  amberBorder: string;
  badgeBg: string;
  badgeText: string;
  heroBadgeBorder: string;
  heroOverlay: string;
  btnBorder: string;
  btnHoverBg: string;
  imgBorder: string;
  vergroot: string;
  galleryBg: string;
  gallerySectionBg: string;
  divider: string;
  footerBg: string;
  footerDivider: string;
  footerInkSub: string;
  ctaBg: string;
  ctaHoverBg: string;
  modalBg: string;
  modalBtn: string;
  modalBtnHover: string;
  modalCounter: string;
  isLight: boolean;
};

const DARK: Tokens = {
  bg:               "#0c0a09",
  bgAlt:            "#111009",
  ink:              "#f5f0e8",
  inkSub:           "#a89880",
  heroInk:          "#f5f0e8",
  heroInkSub:       "#c8b090",
  amber:            "#d97706",
  amberBorder:      "rgba(217,119,6,0.3)",
  badgeBg:          "rgba(0,0,0,0.25)",
  badgeText:        "#fef3c7",
  heroBadgeBorder:  "rgba(217,119,6,0.4)",
  heroOverlay:      "linear-gradient(to bottom, rgba(12,10,9,0.7) 0%, rgba(12,10,9,0.5) 50%, #0c0a09 100%)",
  btnBorder:        "#57534e",
  btnHoverBg:       "rgba(120,53,15,0.2)",
  imgBorder:        "rgba(255,255,255,0.05)",
  vergroot:         "rgba(0,0,0,0.6)",
  galleryBg:        "#000",
  gallerySectionBg: "#111009",
  divider:          "rgba(255,255,255,0.05)",
  footerBg:         "#0c0a09",
  footerDivider:    "#1c1a17",
  footerInkSub:     "#a89880",
  ctaBg:            "#b45309",
  ctaHoverBg:       "#d97706",
  modalBg:          "rgba(12,10,9,0.95)",
  modalBtn:         "rgba(255,255,255,0.1)",
  modalBtnHover:    "rgba(255,255,255,0.15)",
  modalCounter:     "rgba(255,255,255,0.4)",
  isLight:          false,
};

const LIGHT: Tokens = {
  bg:               "#faf7f2",
  bgAlt:            "#f3ece0",
  ink:              "#1c1208",
  inkSub:           "#6b5540",
  heroInk:          "#fef3c7",
  heroInkSub:       "#e8d5b0",
  amber:            "#92400e",
  amberBorder:      "rgba(146,64,14,0.35)",
  badgeBg:          "rgba(12,8,4,0.45)",
  badgeText:        "#fde68a",
  heroBadgeBorder:  "rgba(253,230,138,0.35)",
  heroOverlay:      "linear-gradient(to bottom, rgba(12,8,4,0.68) 0%, rgba(12,8,4,0.62) 60%, rgba(12,8,4,0.45) 78%, #faf7f2 100%)",
  btnBorder:        "rgba(232,213,176,0.55)",
  btnHoverBg:       "rgba(232,213,176,0.1)",
  imgBorder:        "rgba(0,0,0,0.08)",
  vergroot:         "rgba(250,247,242,0.85)",
  galleryBg:        "#e8dfd0",
  gallerySectionBg: "#f3ece0",
  divider:          "rgba(0,0,0,0.07)",
  footerBg:         "#faf7f2",
  footerDivider:    "#e8dfd0",
  footerInkSub:     "#6b5540",
  ctaBg:            "#92400e",
  ctaHoverBg:       "#b45309",
  modalBg:          "rgba(250,247,242,0.96)",
  modalBtn:         "rgba(0,0,0,0.06)",
  modalBtnHover:    "rgba(0,0,0,0.12)",
  modalCounter:     "rgba(0,0,0,0.35)",
  isLight:          true,
};

function useModernChocTheme(): Tokens {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("theme-light"));
    const h = (e: Event) => setIsDark((e as CustomEvent).detail.isDark);
    window.addEventListener("theme-change", h);
    return () => window.removeEventListener("theme-change", h);
  }, []);
  return isDark ? DARK : LIGHT;
}

export default function ChocolatePageModern() {
  const T = useModernChocTheme();
  const heroImage = "/img/2526_BDL3_PACK_H4_WaterschootJ.jpg";

  const gallery = [
    "/img/2526_BDL3_PACK_H1_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H2_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H3_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H5_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H6_WaterschootJ.jpg",
    "/img/2526_BLD3_PACK_H7_WaterschootJ.jpg",
  ];

  const modalItems = [heroImage, ...gallery];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal  = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);
  const nextImage  = () => selectedIndex !== null && setSelectedIndex((selectedIndex + 1) % modalItems.length);
  const prevImage  = () => selectedIndex !== null && setSelectedIndex((selectedIndex - 1 + modalItems.length) % modalItems.length);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")      closeModal();
      if (e.key === "ArrowRight")  nextImage();
      if (e.key === "ArrowLeft")   prevImage();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [selectedIndex]);

  return (
    <div
      className="relative w-full transition-colors duration-500"
      style={{ background: T.bg, color: T.ink }}
    >

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url('${heroImage}')` }}
        >
          <div className="absolute inset-0" style={{ background: T.heroOverlay }}/>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center space-y-8 pt-24">
          <div className="inline-block animate-fadeIn delay-100">
            <span
              className="py-2.5 px-8 border rounded-full text-xs uppercase tracking-[0.25em] backdrop-blur-sm"
              style={{ borderColor: T.heroBadgeBorder, background: T.badgeBg, color: T.badgeText }}
            >
              BELvue Museum • Verpakking
            </span>
          </div>

          <h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium leading-none tracking-tight animate-fadeIn delay-200 drop-shadow-2xl"
            style={{ color: T.heroInk }}
          >
            <span className="italic" style={{ color: T.amber }}>C</span> for chocolate
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light animate-fadeIn delay-300"
            style={{ color: T.heroInkSub }}
          >
            Een exclusieve pralinelijn waar Brusselse Art Deco en culinaire luxe samenkomen.
          </p>

          <div className="pt-8 animate-fadeIn delay-500">
            <button
              onClick={() => document.getElementById("concept")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent rounded-sm overflow-hidden cursor-pointer transition-all duration-300"
              style={{ border: `1px solid ${T.btnBorder}`, color: T.heroInkSub }}
            >
              <span className="relative z-10 text-sm uppercase tracking-widest font-semibold">Ontdek het verhaal</span>
              <div
                className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                style={{ background: T.btnHoverBg }}
              />
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow opacity-40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>


      {/* ── CONCEPT STORY ── */}
      <section
        id="concept"
        className="py-32 md:py-44 relative"
        style={{ background: T.bg }}
      >
        <div className="max-w-6xl mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-16 md:gap-24 items-center">

          <div className="space-y-10">
            <h3
              className="text-sm uppercase tracking-[0.22em] font-semibold"
              style={{ color: T.amber }}
            >
              De Inspiratie
            </h3>
            <div className="space-y-7 font-light leading-[1.85] text-lg" style={{ color: T.inkSub }}>
              <p>
                Geïnspireerd door de architecturale pracht van de Brusselse Art Deco, heb ik gekozen voor een vormentaal die luxe en geschiedenis ademt.
              </p>
              <p>
                De verpakking is niet slechts een omhulsel, maar een verlengstuk van de smaakervaring. De geometrische gouden lijnen op een diepe achtergrond creëren een spel van licht en schaduw, vergelijkbaar met de gevels van de jaren '20.
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <div
                className="h-px flex-1 my-auto"
                style={{ background: `linear-gradient(to right, ${T.amberBorder}, transparent)` }}
              />
              <span className="font-serif italic" style={{ color: T.amber }}>Est. 2026</span>
            </div>
          </div>

          <div className="relative group cursor-pointer" onClick={() => openModal(0)}>
            <div
              className="absolute inset-0 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-xl"
              style={{ background: T.amber }}
            />
            <img
              src={heroImage}
              alt="Concept detail"
              className="relative rounded-xl shadow-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]"
              style={{ border: `1px solid ${T.imgBorder}` }}
            />
            <div
              className="absolute bottom-4 left-4 backdrop-blur-md px-4 py-2 text-xs uppercase tracking-wider rounded border opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: T.vergroot, color: T.ink, borderColor: T.imgBorder }}
            >
              Vergroot
            </div>
          </div>

        </div>
      </section>


      {/* ── GALLERY ── */}
      <section
        className="py-32 md:py-44"
        style={{ background: T.gallerySectionBg, borderTop: `1px solid ${T.divider}` }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="mb-20 text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6" style={{ color: T.ink }}>
              Ontwerpen verpakking
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: T.inkSub }}>
              Details van de branding en verpakkingsontwerp.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {gallery.map((img, i) => {
              const modalIndex = modalItems.indexOf(img);
              return (
                <div
                  key={i}
                  className="relative group cursor-pointer overflow-hidden rounded-xl"
                  style={{ background: T.galleryBg }}
                  onClick={() => openModal(modalIndex)}
                >
                  <img
                    src={img}
                    alt={`Design shot ${i + 1}`}
                    className="h-80 w-full object-cover opacity-90 group-hover:opacity-100 transform transition duration-700 ease-out group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 opacity-60 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ── FOOTER CTA ── */}
      <footer
        className="py-32 md:py-40 text-center"
        style={{ background: T.footerBg, borderTop: `1px solid ${T.footerDivider}` }}
      >
        <div className="max-w-2xl mx-auto px-8 space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl" style={{ color: T.ink }}>
            Op zoek naar een unieke merkidentiteit?
          </h2>
          <p className="leading-relaxed" style={{ color: T.footerInkSub }}>
            Ik help merken om hun verhaal te vertalen naar tastbaar design. Laten we samen iets moois creëren.
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 text-white font-medium rounded-sm transition-colors duration-300"
            style={{
              background: T.ctaBg,
              boxShadow: `0 0 24px ${T.amberBorder}`,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = T.ctaHoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = T.ctaBg)}
          >
            Start een project
          </a>
        </div>
      </footer>


      {/* ── MODAL ── */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999] animate-fadeIn"
          style={{ background: T.modalBg, backdropFilter: "blur(20px)" }}
          onClick={closeModal}
        >
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12 pointer-events-none">
            <button
              onClick={e => { e.stopPropagation(); prevImage(); }}
              className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border transition-all hover:scale-105 cursor-pointer"
              style={{ borderColor: T.amberBorder, background: T.modalBtn, color: T.ink }}
            >
              ←
            </button>
            <button
              onClick={e => { e.stopPropagation(); nextImage(); }}
              className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border transition-all hover:scale-105 cursor-pointer"
              style={{ borderColor: T.amberBorder, background: T.modalBtn, color: T.ink }}
            >
              →
            </button>
          </div>

          <button
            className="absolute top-6 right-6 z-50 transition-colors cursor-pointer"
            style={{ color: T.inkSub }}
            onClick={closeModal}
          >
            <span className="text-sm uppercase tracking-widest mr-2">Sluiten</span>
            <span className="text-2xl align-middle">&times;</span>
          </button>

          <img
            src={modalItems[selectedIndex]}
            alt="Selected"
            className="max-h-[85vh] max-w-[90vw] shadow-2xl rounded-sm pointer-events-auto select-none"
            onClick={e => e.stopPropagation()}
            style={{ border: `1px solid ${T.imgBorder}` }}
          />

          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm tracking-widest"
            style={{ color: T.modalCounter }}
          >
            {selectedIndex + 1} / {modalItems.length}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50%       { transform: translateY(10px) translateX(-50%); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.3s; }
        .delay-300 { animation-delay: 0.5s; }
        .delay-500 { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
}
