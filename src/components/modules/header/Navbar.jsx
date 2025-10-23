"use client"

import { useState } from "react"
import Link from "next/link"
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const dropdownData = {
    artists: {
      title: "Artists",
      items: ["Rap", "Country", "Pop", "Rock", "Jazz", "Reggae", "EDM", "Classical", "Other"]
    },
    venues: {
      title: "Venues",
      items: ["New Orleans", "Biloxi", "Mobile", "Pensacola"]
    },
    news: {
      title: "News",
      items: ["New Orleans", "Biloxi", "Mobile", "Pensacola"]
    }
  }

  const handleDropdownEnter = (dropdown) => {
    setActiveDropdown(dropdown)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <header className="fixed top-0 w-full backdrop-blur-sm border-b border-border z-50 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Gulf Coast Music Logo" width={80} height={50} />
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            
            {/* Artists Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('artists')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="flex items-center">
                <button className="text-foreground hover:text-primary transition flex items-center gap-1 py-2">
                  Artists
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                      activeDropdown === 'artists' ? 'rotate-180' : 'rotate-0'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
              </div>
              
              {/* Dropdown with connected hover area */}
              {activeDropdown === 'artists' && (
                <div 
                  className="absolute top-full left-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-200"
                  onMouseEnter={() => handleDropdownEnter('artists')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownData.artists.items.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 hover:translate-x-1"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Venues Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('venues')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="flex items-center">
                <button className="text-foreground hover:text-primary transition flex items-center gap-1 py-2">
                  Venues
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                      activeDropdown === 'venues' ? 'rotate-180' : 'rotate-0'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
              </div>
              
              {activeDropdown === 'venues' && (
                <div 
                  className="absolute top-full left-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-200"
                  onMouseEnter={() => handleDropdownEnter('venues')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownData.venues.items.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 hover:translate-x-1"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* News Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('news')}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="flex items-center">
                <button className="text-foreground hover:text-primary transition flex items-center gap-1 py-2">
                  News
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                      activeDropdown === 'news' ? 'rotate-180' : 'rotate-0'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
              </div>
              
              {activeDropdown === 'news' && (
                <div 
                  className="absolute top-full left-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-200"
                  onMouseEnter={() => handleDropdownEnter('news')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownData.news.items.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 hover:translate-x-1"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition hover:scale-105 duration-200">
              Sign In
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-all duration-200 font-medium hover:scale-105 hover:shadow-lg">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button with Animation */}
          <button 
            className="md:hidden text-foreground transition-transform duration-300 hover:scale-110" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation with Animations */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4 animate-in fade-in-50 slide-in-from-top-2 duration-300">
            <Link 
              href="#" 
              className="text-foreground hover:text-primary transition py-2 hover:translate-x-2 duration-200"
            >
              Home
            </Link>
            
            {/* Mobile Artists Dropdown */}
            <div className="flex flex-col">
              <button 
                className="text-foreground hover:text-primary transition py-2 text-left flex items-center justify-between hover:translate-x-2 duration-200"
                onClick={() => setActiveDropdown(activeDropdown === 'artists-mobile' ? null : 'artists-mobile')}
              >
                <span>Artists</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                    activeDropdown === 'artists-mobile' ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </button>
              {activeDropdown === 'artists-mobile' && (
                <div className="ml-4 mt-2 flex flex-col gap-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                  {dropdownData.artists.items.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="text-gray-600 hover:text-primary transition py-1 hover:translate-x-2 duration-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Venues Dropdown */}
            <div className="flex flex-col">
              <button 
                className="text-foreground hover:text-primary transition py-2 text-left flex items-center justify-between hover:translate-x-2 duration-200"
                onClick={() => setActiveDropdown(activeDropdown === 'venues-mobile' ? null : 'venues-mobile')}
              >
                <span>Venues</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                    activeDropdown === 'venues-mobile' ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </button>
              {activeDropdown === 'venues-mobile' && (
                <div className="ml-4 mt-2 flex flex-col gap-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                  {dropdownData.venues.items.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="text-gray-600 hover:text-primary transition py-1 hover:translate-x-2 duration-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile News Dropdown */}
            <div className="flex flex-col">
              <button 
                className="text-foreground hover:text-primary transition py-2 text-left flex items-center justify-between hover:translate-x-2 duration-200"
                onClick={() => setActiveDropdown(activeDropdown === 'news-mobile' ? null : 'news-mobile')}
              >
                <span>News</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                    activeDropdown === 'news-mobile' ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </button>
              {activeDropdown === 'news-mobile' && (
                <div className="ml-4 mt-2 flex flex-col gap-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                  {dropdownData.news.items.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="text-gray-600 hover:text-primary transition py-1 hover:translate-x-2 duration-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button className="text-foreground hover:text-primary transition text-left py-2 hover:translate-x-2 duration-200">
              Sign In
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-all duration-200 font-medium w-full hover:scale-105 hover:shadow-lg">
              Sign Up
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}