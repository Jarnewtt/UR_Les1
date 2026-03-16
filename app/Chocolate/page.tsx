"use client";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const heroImage = "/img/2526_BDL3_PACK_H4_WaterschootJ.jpg";

  // --- CURSOR STATE ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  // Gallery images
  const gallery = [
    "/img/2526_BDL3_PACK_H1_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H2_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H3_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H5_WaterschootJ.jpg",
    "/img/2526_BDL3_PACK_H6_WaterschootJ.jpg",
    "/img/2526_BLD3_PACK_H7_WaterschootJ.jpg",
  ];

  // Modal navigatie: hero + gallery
  const modalItems = [heroImage, ...gallery];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % modalItems.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        (selectedIndex - 1 + modalItems.length) % modalItems.length
      );
    }
  };

  // Cursor & Scroll listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="relative w-full bg-stone-950 text-stone-200 selection:bg-amber-900 selection:text-white cursor-none">
      
      {/* ================= CUSTOM CURSOR ================= */}
      <div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[100] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHoveringLink ? 'scale-[2.5] bg-white/10' : 'scale-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      <div 
        className={`fixed top-0 left-0 w-2 h-2 bg-amber-600 rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHoveringLink ? 'opacity-0' : 'opacity-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] scale-105"
          style={{ backgroundImage: `url('${heroImage}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/60 to-stone-950"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 pt-24">
          <div className="inline-block animate-fadeIn delay-100">
            <span className="py-2 px-4 border border-amber-500/30 rounded-full text-xs uppercase tracking-[0.25em] text-amber-100 backdrop-blur-sm bg-black/20">
              BELvue Museum • Packaging
            </span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium text-amber-50 leading-none tracking-tight animate-fadeIn delay-200 drop-shadow-2xl">
            <span className="italic text-amber-600/90">C</span> for chocolate
          </h1>

          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-light animate-fadeIn delay-300">
            Een exclusieve pralinelijn waar Brusselse Art Deco en culinaire luxe samenkomen.
          </p>

          <div className="pt-8 animate-fadeIn delay-500">
             <button 
                onMouseEnter={() => setIsHoveringLink(true)}
                onMouseLeave={() => setIsHoveringLink(false)}
                onClick={() => document.getElementById('concept')?.scrollIntoView({ behavior: 'smooth'})}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-stone-600 hover:border-amber-500 text-stone-300 hover:text-white transition-all duration-300 rounded-sm overflow-hidden"
             >
                <span className="relative z-10 text-sm uppercase tracking-widest font-semibold">Ontdek het verhaal</span>
                <div className="absolute inset-0 bg-amber-900/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
             </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow opacity-50">
          <span className="text-2xl text-amber-50">↓</span>
        </div>
      </section>


      {/* ================= CONCEPT STORY ================= */}
      <section id="concept" className="py-24 md:py-32 bg-stone-950 relative">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <h3 className="text-amber-500 text-sm uppercase tracking-[0.2em] font-semibold">De Inspiratie</h3>
            <div className="space-y-6 text-stone-400 font-light leading-relaxed text-lg">
              <p>
                Geïnspireerd door de architecturale pracht van de Brusselse Art Deco, heb ik gekozen voor een vormentaal die luxe en geschiedenis ademt. 
              </p>
              <p>
                De verpakking is niet slechts een omhulsel, maar een verlengstuk van de smaakervaring. De geometrische gouden lijnen op een diepe achtergrond creëren een spel van licht en schaduw, vergelijkbaar met de gevels van de jaren '20.
              </p>
            </div>
            
            <div className="flex gap-4 pt-4">
               <div className="h-px flex-1 bg-gradient-to-r from-amber-900/50 to-transparent my-auto"></div>
               <span className="font-serif italic text-amber-700">Est. 2025</span>
            </div>
          </div>

          <div 
            className="relative group cursor-none" 
            onMouseEnter={() => setIsHoveringLink(true)}
            onMouseLeave={() => setIsHoveringLink(false)}
            onClick={() => openModal(0)}
          >
            <div className="absolute inset-0 bg-amber-600 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <img
              src={heroImage}
              alt="Concept detail"
              className="relative rounded-lg shadow-2xl border border-white/5 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 text-xs text-white uppercase tracking-wider rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
               Vergroot
            </div>
          </div>

        </div>
      </section>


      {/* ================= GALLERY ================= */}
      <section className="bg-stone-900 py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20 text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-amber-50 mb-6">
              Design Explorations
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto">
              Details van de branding en verpakkingsontwerp.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((img, i) => {
              const modalIndex = modalItems.indexOf(img);
              return (
                <div
                  key={i}
                  onMouseEnter={() => setIsHoveringLink(true)}
                  onMouseLeave={() => setIsHoveringLink(false)}
                  className="relative group cursor-none overflow-hidden rounded-md bg-black"
                  onClick={() => openModal(modalIndex)}
                >
                  <img
                    src={img}
                    alt={`Design shot ${i + 1}`}
                    className="h-80 w-full object-cover opacity-80 group-hover:opacity-100 transform transition duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ================= CTA / FOOTER ================= */}
      <footer className="py-24 bg-stone-950 border-t border-stone-900 text-center">
          <div className="max-w-2xl mx-auto px-6 space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl text-amber-50">
                Op zoek naar een unieke merkidentiteit?
            </h2>
            <p className="text-stone-400 leading-relaxed">
                Ik help merken om hun verhaal te vertalen naar tastbaar design. Laten we samen iets moois creëren.
            </p>
            <a 
                onMouseEnter={() => setIsHoveringLink(true)}
                onMouseLeave={() => setIsHoveringLink(false)}
                href="mailto:jouwemail@voorbeeld.com" 
                className="inline-block px-10 py-4 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-sm transition-colors duration-300 shadow-[0_0_20px_rgba(180,83,9,0.3)] hover:shadow-[0_0_30px_rgba(180,83,9,0.5)]"
            >
                Start een project
            </a>
          </div>
      </footer>


      {/* ================= MODAL ================= */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-stone-950/95 backdrop-blur-xl flex items-center justify-center z-[100] animate-fadeIn cursor-none"
          onClick={closeModal}
        >
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12 pointer-events-none">
             <button
                onMouseEnter={() => setIsHoveringLink(true)}
                onMouseLeave={() => setIsHoveringLink(false)}
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-105"
              >
                ←
              </button>
              <button
                onMouseEnter={() => setIsHoveringLink(true)}
                onMouseLeave={() => setIsHoveringLink(false)}
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-105"
              >
                →
              </button>
          </div>

          <button
            onMouseEnter={() => setIsHoveringLink(true)}
            onMouseLeave={() => setIsHoveringLink(false)}
            className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors"
            onClick={closeModal}
          >
            <span className="text-sm uppercase tracking-widest mr-2">Sluiten</span>
            <span className="text-2xl align-middle">&times;</span>
          </button>

          <img
            src={modalItems[selectedIndex]}
            alt="Selected"
            className="max-h-[85vh] max-w-[90vw] shadow-2xl rounded-sm pointer-events-auto select-none"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-widest">
             {selectedIndex + 1} / {modalItems.length}
          </div>
        </div>
      )}

      <style jsx global>{`
        :global(body) {
          cursor: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(10px) translateX(-50%); }
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