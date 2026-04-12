You are a senior UI designer and frontend developer.
Build premium, dark and light-themed interfaces.
Use subtle animations, proper spacing, and visual hierarchy.
No emoji icons. No inline styles. No generic gradients. 

---

# Development Rules

## 🔴 Lees dit altijd eerst
- Dit is een Next.js portfolio project, gedeployd via Netlify via GitHub
- Wijzig NOOIT iets zonder dit bestand eerst te lezen
- Vraag om bevestiging voor grote structuurwijzigingen
- Test altijd lokaal met `npm run dev` voor je pusht

## 🧱 Tech Stack
- **Next.js 16** met Turbopack
- **React** – functionele componenten met hooks
- **Tailwind CSS** – voor alle styling
- **Framer Motion** – voor animaties en transities
- **D3.js** – voor data visualisaties
- **Three.js** – voor 3D graphics en scenes
- **Spline** – voor interactieve 3D objecten
- Gehost op **Netlify** via **GitHub**

## 🎨 Design & Stijl
- Kleurenpalet: zie `tailwind.config.js`
- Fonts: zie `tailwind.config.js` en `app/layout.tsx`
- Stijl: modern, minimalistisch, professioneel

## 📁 Projectstructuur
- `/app` – pagina's en layouts (Next.js App Router)
- `/components` – herbruikbare React componenten
- `/public` – afbeeldingen en static files

## ✅ Coding regels
- Gebruik altijd **functionele componenten** met hooks
- Componentnamen in **PascalCase**
- Bestandsnamen in **kebab-case**
- **Geen inline styles** – altijd Tailwind classes
- Geen onnodige packages installeren zonder toestemming

## 🎬 Animaties & 3D (gelaagde aanpak)

### Framer Motion
- Gebruik voor **UI animaties** en pagina transities
- Gebruik `motion.div` voor geanimeerde elementen
- Gebruik `AnimatePresence` voor in/out transities
- Houd animaties subtiel en professioneel

### Three.js
- Gebruik voor **3D scenes en graphics** in de browser
- Altijd via **useRef + useEffect** in React
- Gebruik `@react-three/fiber` en `@react-three/drei` als wrapper
- Maak scenes **responsive** met canvas resize handling
- Lazy load zware 3D scenes met `dynamic()` van Next.js

### Spline
- Gebruik voor **interactieve 3D objecten en decoraties**
- Importeer via `@splinetool/react-spline`
- Altijd lazy loaden met Next.js `dynamic()`:
```js
  const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })
```
- Combineer met Framer Motion voor scroll-triggered activatie

## 📊 Data Visualisaties (D3)
- Combineer D3 met **useRef en useEffect** in React
- D3 beheert de SVG rendering, React beheert de state
- Maak visualisaties **responsive** met ResizeObserver

## ⚡ Performance regels
- Zware componenten (Three.js, Spline) altijd **lazy loaden**
- Gebruik `Suspense` met een loading fallback
- Controleer Lighthouse score na grote wijzigingen
- Animaties uitschakelen bij `prefers-reduced-motion`

## 🚫 Verboden
- Nooit de `/public` map leegmaken
- Nooit `.env.local` aanpassen of committen
- Nooit rechtstreeks op `main` branch pushen
- Geen andere animatie libraries naast Framer Motion / Three.js / Spline
- Geen andere chart libraries naast D3
- Nooit Three.js of Spline zonder lazy loading importeren