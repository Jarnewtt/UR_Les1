"use client"

import { useState } from "react"
import SidebarSlider from "@/components/SidebarSlider"
import { GiHamburgerMenu } from "react-icons/gi"

export default function GlobalNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)

  return (
    <>
      {/* Hamburger menu icon button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
        onClick={() => setIsSidebarOpen(true)}
      >
        <GiHamburgerMenu size={24} />
      </button>

      {/* Sidebar */}
      <SidebarSlider isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <nav className="flex flex-col space-y-4">
          <a href="/home" className="hover:underline">Home</a>
          <a href="/about" className="hover:underline">About</a>

          {/* Project dropdown */}
          <div>
            <button
              onClick={() => setIsProjectOpen(!isProjectOpen)}
              className="flex w-full items-center justify-between hover:underline"
            >
              Project
              <span className="ml-2">{isProjectOpen ? "" : ""}</span>
            </button>

            {isProjectOpen && (
              <div className="ml-4 mt-2 flex flex-col space-y-2 text-sm">
                <a href="/Architectuur" className="hover:underline">Hélène Binet</a>
                <a href="/CineCity" className="hover:underline">CineCity</a>
                <a href="/Frisdrank" className="hover:underline">Easy Leaf</a>
              </div>
            )}
          </div>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/login" className="hover:underline">Login</a>
        </nav>
      </SidebarSlider>
    </>
  )
}


