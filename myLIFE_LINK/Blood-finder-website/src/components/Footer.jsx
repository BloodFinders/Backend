import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { GithubIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from './SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-16 text-slate-600">
      <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
        {/* Brand */}
        <div className="flex flex-col gap-5 text-left">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative text-blood flex items-center">
              <Droplet className="filter drop-shadow-[0_0_8px_rgba(239,35,60,0.4)] animate-pulse" fill="currentColor" size={24} />
              <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-white" size={10} fill="currentColor" />
            </div>
            <span className="font-title text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 to-blood bg-clip-text text-transparent">
              RakthaDan
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-500">
            Connecting donors and recipients in seconds. A platform designed to manage inventories, broadcast emergencies, and save lives through community action.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-blood hover:text-white hover:border-blood transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blood/10" aria-label="Twitter">
              <TwitterIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-blood hover:text-white hover:border-blood transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blood/10" aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-blood hover:text-white hover:border-blood transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blood/10" aria-label="LinkedIn">
              <LinkedinIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-blood hover:text-white hover:border-blood transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blood/10" aria-label="Github">
              <GithubIcon size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-left">
          <h3 className="font-title font-bold text-slate-800 text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-blood after:rounded-full">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/" className="hover:text-blood transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-blood transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-blood transition-colors">Our Services</Link></li>
            <li><Link to="/contact" className="hover:text-blood transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-left">
          <h3 className="font-title font-bold text-slate-800 text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-blood after:rounded-full">
            Get In Touch
          </h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-blood mt-0.5 flex-shrink-0" />
              <span className="text-slate-600">+1 (800) RAKTHADAN</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-blood mt-0.5 flex-shrink-0" />
              <span className="text-slate-600">support@rakthadan.org</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blood mt-0.5 flex-shrink-0" />
              <span className="text-slate-600">100 Health Science Pkwy, Suite 400</span>
            </li>
          </ul>
        </div>

        {/* Download Badges */}
        <div className="text-left">
          <h3 className="font-title font-bold text-slate-800 text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-blood after:rounded-full">
            Download the App
          </h3>
          <p className="text-sm leading-relaxed mb-4 text-slate-500">Available now on iOS and Android devices. Save a life today.</p>
          <div className="flex flex-col gap-3">
            <a href="#" className="inline-block w-fit">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="h-10 border border-slate-200 rounded-md transition-all duration-300 hover:scale-[1.02] hover:border-blood hover:shadow-sm"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 py-6 border-t border-slate-100 bg-slate-100/50 text-xs text-slate-500">
        <div className="container mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p>&copy; {new Date().getFullYear()} RakthaDan. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blood transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blood transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blood transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
