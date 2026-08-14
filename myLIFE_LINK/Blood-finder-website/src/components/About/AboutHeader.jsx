import React from 'react';

export default function AboutHeader() {
  return (
    <div className="max-w-5xl mx-auto text-center mb-20">
      {/* Intro Header */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blood/10 border border-blood/20 text-blood text-xs font-bold uppercase tracking-wider mb-4">
          Our Mission
        </div>
        <h1 className="font-title text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          Bridging the Gap Between <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 to-blood font-black">
            Compassion and Urgent Need.
          </span>
        </h1>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
          RakthaDan was founded with a singular, vital vision: to ensure that no life is lost due to a delay in finding blood. By leveraging modern real-time tracking, geolocation matching, and localized push alerts, we turn a process that used to take hours into a seamless match that takes minutes.
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:border-blood/30 transition-all duration-300">
          <h3 className="font-title text-3xl font-extrabold text-slate-900 mb-1">15k+</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Registered Donors</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:border-blood/30 transition-all duration-300">
          <h3 className="font-title text-3xl font-extrabold text-slate-900 mb-1">180+</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verified Clinics</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:border-blood/30 transition-all duration-300">
          <h3 className="font-title text-3xl font-extrabold text-slate-900 mb-1">9,800+</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Successful Matches</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:border-blood/30 transition-all duration-300">
          <h3 className="font-title text-3xl font-extrabold text-slate-900 mb-1">99.8%</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Response Rate</p>
        </div>
      </div>
    </div>
  );
}
