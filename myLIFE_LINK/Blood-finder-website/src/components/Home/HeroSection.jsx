import React, { useState } from 'react';
import { Droplet, Heart } from 'lucide-react';

export default function HeroSection() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [donorCount, setDonorCount] = useState(12842);

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
    setDonorCount(prev => isAvailable ? prev - 1 : prev + 1);
  };

  return (
    <header className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-white">
      <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Copywriting & Downloads */}
        <div className="md:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blood/10 border border-blood/20 text-blood text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blood animate-pulse"></span>
            <span>Emergency Network Active</span>
          </div>
          
          <h1 className="font-title text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 mb-6">
            Saves Lives in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blood to-red-500 font-black">
              a Few Taps.
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed">
            Connecting volunteer blood donors with patients in urgent need instantly. Real-time matching, live inventory tracking, emergency broadcasts, and a rewarding donation system right in your pocket.
          </p>

          {/* Badges for Download */}
          <div className="flex flex-col gap-3.5 mb-10 w-full">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Download the RakthaDan Mobile App
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-block transition-transform duration-300 hover:scale-[1.03]">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-10 border border-slate-200 rounded-md"
                />
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex lg:items-center lg:gap-12 mt-2 w-full">
            <div>
              <h3 className="font-title text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                {donorCount.toLocaleString()}
              </h3>
              <p className="text-[9px] sm:text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider leading-tight">
                Active Donors
              </p>
            </div>
            <div className="hidden lg:block w-[1px] h-8 bg-slate-200"></div>
            <div>
              <h3 className="font-title text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                9,820+
              </h3>
              <p className="text-[9px] sm:text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider leading-tight">
                Lives Impacted
              </p>
            </div>
            <div className="hidden lg:block w-[1px] h-8 bg-slate-200"></div>
            <div>
              <h3 className="font-title text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                15 Min
              </h3>
              <p className="text-[9px] sm:text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider leading-tight">
                Avg Match Time
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Mobile Mockup */}
        <div className="md:col-span-5 flex justify-center w-full md:-mt-2 lg:-mt-4">
          <div className="relative">
            {/* Phone Wrapper */}
            <div className="relative w-[230px] md:w-[250px] aspect-[9/18.5] bg-[#07080b] rounded-[42px] p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border-[5px] border-gray-800 animate-float z-10">
              
              {/* Phone Earpiece */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-20 flex justify-center items-center">
                <div className="w-10 h-0.5 bg-gray-800 rounded-full mb-0.5"></div>
              </div>

              {/* Phone Screen */}
              <div className="relative w-full h-full bg-slate-50 rounded-[32px] overflow-hidden flex flex-col border border-slate-200">
                
                {/* Status Bar */}
                <div className="h-6 flex justify-between items-center px-4 text-[8px] font-semibold text-slate-600 z-10 pt-1 bg-white">
                  <span>9:41</span>
                  <div className="flex gap-1 items-center">
                    <span>📶</span>
                    <span>🔋 98%</span>
                  </div>
                </div>

                {/* App Header */}
                <div className="h-9 flex justify-between items-center px-3 bg-white border-b border-slate-100 z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blood/10 flex items-center justify-center text-blood">
                      <Droplet fill="currentColor" size={11} />
                    </div>
                    <span className="font-title font-extrabold text-[10px] text-slate-800 tracking-tight">RakthaDan</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-blood animate-pulse"></span>
                </div>

                {/* App Content */}
                <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto bg-slate-50/50">
                  
                  {/* Donor Map Widget */}
                  <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col gap-1.5 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[9px] font-bold text-slate-800">Nearby Donors Map</h4>
                      <span className="text-[7px] bg-blood/15 text-blood font-extrabold px-1 py-0.5 rounded">LIVE</span>
                    </div>
                    <div className="relative h-20 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                      
                      {/* Radar circle effect */}
                      <div className="radar-circle"></div>

                      {/* Map Pins */}
                      {isAvailable && (
                        <div className="absolute w-2.5 h-2.5 bg-blood rounded-full border border-white shadow-[0_0_6px_#ef233c] animate-bounce z-10">
                          <span className="absolute -inset-1 bg-blood/40 rounded-full animate-ping"></span>
                        </div>
                      )}
                      
                      {/* Peer Pins */}
                      <div className="absolute top-4 left-6 w-2 h-2 bg-blood/60 rounded-full border border-white"></div>
                      <div className="absolute bottom-4 right-8 w-2 h-2 bg-blood/60 rounded-full border border-white"></div>
                      <div className="absolute top-8 right-12 w-2 h-2 bg-blood/60 rounded-full border border-white"></div>
                    </div>
                  </div>

                  {/* Toggle Availability Widget */}
                  <div className="bg-white border border-slate-100 rounded-xl p-2 flex justify-between items-center shadow-sm">
                    <div className="flex flex-col text-left">
                      <h5 className="text-[9.5px] font-bold text-slate-800">Available to Donate</h5>
                      <p className="text-[7px] text-slate-500 mt-0.5">
                        {isAvailable ? "Visible to hospitals" : "Hidden from search"}
                      </p>
                    </div>
                    
                    {/* Toggle Button */}
                    <button 
                      className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${
                        isAvailable ? 'bg-blood' : 'bg-slate-300'
                      }`}
                      onClick={handleToggle}
                      aria-label="Toggle donation availability status"
                    >
                      <span className={`w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${
                        isAvailable ? 'translate-x-3' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>

                  {/* Urgent Request Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col gap-1.5 text-left shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blood/10 text-blood text-[9px] font-black font-title flex items-center justify-center shadow-inner">
                        O+
                      </div>
                      <div>
                        <h5 className="text-[9px] font-bold text-slate-800">Urgent Blood Request</h5>
                        <p className="text-[7px] text-slate-500">City Hospital (2.4 km away)</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-0.5 pt-1.5 border-t border-slate-100">
                      <span className="text-[7px] text-slate-400 font-semibold flex items-center gap-0.5">
                        ⏳ 45m left
                      </span>
                      <button className="bg-blood hover:bg-blood-dark text-white font-bold text-[7px] px-2.5 py-1 rounded-full transition-all uppercase tracking-wider">
                        Accept
                      </button>
                    </div>
                  </div>

                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-slate-300 rounded-full z-10"></div>
              </div>

            </div>

            {/* Glowing background shadows */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blood/10 to-transparent blur-3xl opacity-30 -z-10 rounded-[60px]"></div>
          </div>
        </div>

      </div>
    </header>
  );
}
