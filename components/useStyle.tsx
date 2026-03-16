"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

export type StyleVariant = "industrial" | "modern"

interface StyleContextType {
  style: StyleVariant
  toggleStyle: () => void
  setStyle: (s: StyleVariant) => void
}

const StyleContext = createContext<StyleContextType>({
  style: "industrial",
  toggleStyle: () => {},
  setStyle: () => {},
})

export function StyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyleState] = useState<StyleVariant>("industrial")

  // Lees opgeslagen voorkeur bij mount
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-style") as StyleVariant | null
    if (saved === "industrial" || saved === "modern") {
      setStyleState(saved)
      document.documentElement.setAttribute("data-style", saved)
    }
  }, [])

  const setStyle = (s: StyleVariant) => {
    setStyleState(s)
    localStorage.setItem("portfolio-style", s)
    document.documentElement.setAttribute("data-style", s)
  }

  const toggleStyle = () => setStyle(style === "industrial" ? "modern" : "industrial")

  return (
    <StyleContext.Provider value={{ style, toggleStyle, setStyle }}>
      {children}
    </StyleContext.Provider>
  )
}

export function useStyle() {
  return useContext(StyleContext)
}