"use client"

import { useState } from "react"
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full  backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🎵</span>
            </div>
            <span className="text-xl font-bold text-foreground">Gulf Coast</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition">
              Artists
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition">
              Venues
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition">
              News
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition">Sign In</button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition font-medium">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            <Link href="#" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition">
              Artists
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition">
              Venues
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition">
              News
            </Link>
            <button className="text-foreground hover:text-primary transition text-left">Sign In</button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition font-medium w-full">
              Sign Up
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
