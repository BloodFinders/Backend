import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Droplet, Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex items-center transition-all duration-300 ${
      scrolled 
        ? 'h-[70px] bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm' 
        : 'h-20 bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-6 md:px-8 flex justify-between items-center w-full">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
          <div className="relative text-blood flex items-center">
            <Droplet className="filter drop-shadow-[0_0_8px_rgba(239,35,60,0.4)] animate-pulse" fill="currentColor" size={26} />
            <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-white" size={11} fill="currentColor" />
          </div>
          <span className="font-title text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blood bg-clip-text text-transparent">
            RakthaDan
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => `text-sm font-medium transition-colors duration-200 hover:text-slate-900 relative py-1 ${
              isActive ? 'text-blood after:w-full' : 'text-slate-600 after:w-0'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:height-[2px] after:h-[2px] after:bg-blood after:transition-all after:duration-300 after:rounded-full`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `text-sm font-medium transition-colors duration-200 hover:text-slate-900 relative py-1 ${
              isActive ? 'text-blood after:w-full' : 'text-slate-600 after:w-0'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:height-[2px] after:h-[2px] after:bg-blood after:transition-all after:duration-300 after:rounded-full`}
          >
            About
          </NavLink>
          <NavLink 
            to="/services" 
            className={({ isActive }) => `text-sm font-medium transition-colors duration-200 hover:text-slate-900 relative py-1 ${
              isActive ? 'text-blood after:w-full' : 'text-slate-600 after:w-0'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:height-[2px] after:h-[2px] after:bg-blood after:transition-all after:duration-300 after:rounded-full`}
          >
            Services
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `text-sm font-medium transition-colors duration-200 hover:text-slate-900 relative py-1 ${
              isActive ? 'text-blood after:w-full' : 'text-slate-600 after:w-0'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:height-[2px] after:h-[2px] after:bg-blood after:transition-all after:duration-300 after:rounded-full`}
          >
            Contact
          </NavLink>
          <NavLink 
            to="/contact" 
            className="bg-blood hover:bg-blood-dark text-white px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide uppercase transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-blood/10"
          >
            Join Now
          </NavLink>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-slate-800 hover:text-blood transition-colors focus:outline-none" 
          onClick={toggleMenu}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-30 md:hidden" onClick={closeMenu}></div>
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 w-[280px] h-screen bg-white/95 backdrop-blur-xl border-l border-slate-100 z-40 flex flex-col p-6 pt-24 transition-transform duration-300 ease-out md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col gap-5">
          <NavLink 
            to="/" 
            className={({ isActive }) => `text-lg font-semibold py-2.5 border-b border-slate-100 transition-all duration-200 ${
              isActive ? 'text-blood pl-2' : 'text-slate-700 hover:text-blood'
            }`} 
            onClick={closeMenu}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `text-lg font-semibold py-2.5 border-b border-slate-100 transition-all duration-200 ${
              isActive ? 'text-blood pl-2' : 'text-slate-700 hover:text-blood'
            }`} 
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink 
            to="/services" 
            className={({ isActive }) => `text-lg font-semibold py-2.5 border-b border-slate-100 transition-all duration-200 ${
              isActive ? 'text-blood pl-2' : 'text-slate-700 hover:text-blood'
            }`} 
            onClick={closeMenu}
          >
            Services
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `text-lg font-semibold py-2.5 border-b border-slate-100 transition-all duration-200 ${
              isActive ? 'text-blood pl-2' : 'text-slate-700 hover:text-blood'
            }`} 
            onClick={closeMenu}
          >
            Contact
          </NavLink>
          <NavLink 
            to="/contact" 
            className="bg-blood hover:bg-blood-dark text-white px-5 py-3 rounded-full text-center font-bold text-sm uppercase tracking-wide transition-all mt-4" 
            onClick={closeMenu}
          >
            Join Now
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
