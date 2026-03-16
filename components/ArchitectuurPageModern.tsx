"use client";

import React, { useState, useEffect } from 'react';

type Panel = {
  id: number;
  imagePath: string;
  label: string;
};

export default function HeleneBinetOde() {
  const [isUnfolded, setIsUnfolded] = useState<boolean>(false);
  const [flippedPanels, setFlippedPanels] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // --- CURSOR LOGICA ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleFlip = (index: number) => {
    if (!isUnfolded) return;
    setFlippedPanels((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const contrasts = [
    "Chaotische lijn", "Organische lijn",
    "Geordende lijn", "",
    "Abstracte lijn", "Rechte lijn",
    "Ritmische lijn", "",
    "Doorlopende lijn", "Gebogen lijn",
    "Onregelmatige lijn", "Onderbroken lijn"
  ];

  const panels: Panel[] = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    imagePath: `/img/Paneel_${i + 1}.jpg`,
    label: contrasts[i]
  }));

  const galleryImages = [
    "/img/Gallerij_1.jpg", "/img/Gallerij_2.jpg", "/img/Gallerij_3.jpg",
    "/img/Gallerij_4.jpg", "/img/Gallerij_5.jpg", "/img/Gallerij_6.jpg",
    "/img/Gallerij_7.jpg", "/img/Gallerij_8.jpg", "/img/Gallerij_9.jpg",
    "/img/Gallerij_10.jpg"
  ];

  // --- NAVIGATIE LOGICA GALLERIJ ---
  const currentIndex = selectedImage ? galleryImages.indexOf(selectedImage) : -1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIdx]);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIdx]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-light selection:bg-white selection:text-black outline-none cursor-none">
      
      {/* --- CUSTOM CURSOR --- */}
      <div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[200] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHoveringLink ? 'scale-[2.5] bg-white/10' : 'scale-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      <div 
        className={`fixed top-0 left-0 w-2 h-2 bg-red-600 rounded-full pointer-events-none z-[200] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHoveringLink ? 'opacity-0' : 'opacity-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      <style jsx>{`
        .perspective-container { perspective: 3000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .panel-transition { transition: transform 1.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .grayscale-fade { filter: grayscale(100%) contrast(1.1); transition: filter 1s ease, transform 1s ease; }
        .panel-hover:hover .grayscale-fade { filter: grayscale(0%) contrast(1); }
        
        .lightbox-enter { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        :global(body) {
          cursor: none;
          background-color: black;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-start px-8 -mt-20 pt-48 pb-12 border-b border-white/5 bg-black">
        <h1 className="relative z-10 text-[18vw] font-bold leading-[0.75] tracking-tighter uppercase mb-20">
          Hélène <br /> Binet
        </h1>
        
        <div className="relative z-10 mt-auto flex justify-between items-baseline">
          <p className="text-xs tracking-[0.6em] uppercase opacity-40 italic">De 5 Tegenstellingen</p>
          <p className="text-xs font-mono opacity-40">FOMU Antwerpen — 2025</p>
        </div>
      </section>

      {/* Project Introductie */}
      <section className="px-8 py-24 max-w-4xl border-b border-white/5">
        <div className="space-y-10">
          <h2 className="text-xs tracking-[0.4em] uppercase opacity-30">Onderzoek & Tribuut</h2>
          <p className="text-2xl md:text-3xl leading-snug font-light">
            "Hoe zou <span className="italic">Hélène Binet</span> het doen?" 
          </p>
          <p className="text-lg opacity-60 leading-relaxed max-w-2xl">
            In opdracht van het <span className="font-bold">FOMU te Antwerpen</span> verkent dit project de grenzen van de architecturale waarneming. Door de lens van Binet's analoge, contrastrijke stijl hebben we vijf fundamentele tegenstellingen in lijnen vastgelegd. 
            <br /><br />
            Het is een zoektocht naar hoe licht een <span className="text-white italic">geordende lijn</span> kan transformeren tot chaos, of hoe een <span className="text-white">onderbroken lijn</span> een gevoel van oneindigheid kan oproepen.
          </p>
        </div>
      </section>

      {/* Interaction Trigger */}
      <div 
        onClick={() => setIsUnfolded(!isUnfolded)}
        onMouseEnter={() => setIsHoveringLink(true)}
        onMouseLeave={() => setIsHoveringLink(false)}
        className="group cursor-none border-b border-white/5 py-12 px-8 flex justify-between items-center hover:bg-white/5 transition-colors"
      >
        <span className="text-[2vw] uppercase tracking-widest font-bold">
          {isUnfolded ? "Sluit Studie" : "Bekijk de Lijnen"}
        </span>
        <div className="w-24 h-[1px] bg-white group-hover:w-48 transition-all duration-700"></div>
      </div>

      {/* Leporello Section */}
      <section className="relative py-32 perspective-container overflow-hidden">
        <div className="relative w-full h-[650px] flex items-center justify-center">
          {panels.map((panel, index) => {
            const isFlipped = !!flippedPanels[index];
            const rowIndex = Math.floor(index / 6);
            const colIndex = index % 6;

            const pWidth = 170;
            const pHeight = 260;
            const panelGap = 110;

            let transformStyle = "";
            if (!isUnfolded) {
              transformStyle = `translateX(0) translateY(0) rotateY(${index * 3}deg) rotateZ(${index * 0.5}deg) scale(0.85)`;
            } else {
              const xShift = (colIndex - 2.5) * pWidth;
              const yShift = (rowIndex - 0.5) * (pHeight + panelGap);
              transformStyle = `translateX(${xShift}px) translateY(${yShift}px) ${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'} scale(1)`;
            }

            return (
              <div
                key={panel.id}
                onClick={() => toggleFlip(index)}
                onMouseEnter={() => setIsHoveringLink(true)}
                onMouseLeave={() => setIsHoveringLink(false)}
                className="absolute cursor-none preserve-3d panel-transition panel-hover"
                style={{ 
                  width: `${pWidth}px`,
                  height: `${pHeight}px`,
                  transform: transformStyle, 
                  zIndex: isUnfolded ? 10 : 30 - index,
                }}
              >
                <div className="absolute inset-0 backface-hidden bg-[#050505] overflow-hidden border border-white/5">
                  <img 
                    src={panel.imagePath} 
                    alt={panel.label} 
                    className="w-full h-full object-cover grayscale-fade"
                  />
                </div>

                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white text-black p-6 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[8px] tracking-[0.3em] uppercase opacity-40">Tegenstelling</span>
                    <h3 className="text-sm font-bold leading-tight">{panel.label.toUpperCase()}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="h-[0.5px] w-full bg-black/20"></div>
                    <p className="text-[8px] uppercase tracking-[0.2em] leading-relaxed opacity-60">
                      Studie naar Lijnen <br /> FOMU x Binet
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10 Foto Galerij */}
      <section className="w-full">
        <div className="px-8 py-6 border-t border-white/5">
          <h2 className="text-xs tracking-[0.8em] uppercase opacity-30">Fotografisch Archief: 10 Fragmenten</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 w-full bg-black">
          {galleryImages.map((src, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedImage(src)}
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="group relative overflow-hidden aspect-[3/4] bg-black border-[0.5px] border-white/5 cursor-none"
            >
              <img 
                src={src} 
                alt={`Hélène Binet Stijlstudie ${index + 1}`}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0 contrast-110"
              />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-[8px] tracking-widest uppercase bg-black/50 px-2 py-1">P_{index + 1} — Vergroot</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal met Navigatie */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 lightbox-enter cursor-none"
          onClick={() => setSelectedImage(null)}
          onMouseEnter={() => setIsHoveringLink(true)}
          onMouseLeave={() => setIsHoveringLink(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Vorige Pijl */}
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-10 z-[110] text-white/30 hover:text-white transition-colors text-4xl p-4"
            >
              ←
            </button>

            <img 
              src={selectedImage} 
              className="max-w-full max-h-full object-contain shadow-2xl"
              alt="Volledige weergave"
            />

            {/* Volgende Pijl */}
            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-10 z-[110] text-white/30 hover:text-white transition-colors text-4xl p-4"
            >
              →
            </button>

            <button 
              className="absolute top-4 right-4 text-white uppercase text-[10px] tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => setSelectedImage(null)}
            >
              Sluiten [X]
            </button>
          </div>
        </div>
      )}

{/* Footer */}
      <footer className="h-[40vh] flex flex-col items-center justify-center space-y-6 group cursor-default">
        {/* De streep: van wit/0 naar wit/20 (default) en naar wit/60 bij hover */}
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/0 to-white/20 group-hover:to-white/60 transition-all duration-1000"></div>
        
        {/* De tekst: van opacity-30 naar opacity-100 bij hover */}
        <p className="text-[9px] tracking-[1.5em] uppercase opacity-30 group-hover:opacity-100 transition-opacity duration-1000 pl-[1.5em] text-center">
          Shadow is the architect of light
        </p>
      </footer>

    </div>
  );
}
