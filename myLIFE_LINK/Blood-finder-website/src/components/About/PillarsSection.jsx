import React from 'react';
import { Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function PillarsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
      {/* Pillar 1 */}
      <div className="glass rounded-3xl p-8 border border-slate-100 hover:border-blood/20 transition-all duration-300 text-left">
        <div className="w-12 h-12 rounded-xl bg-blood/10 border border-blood/20 flex items-center justify-center text-blood mb-6 shadow-inner">
          <Compass size={22} />
        </div>
        <h4 className="font-title text-xl font-bold text-slate-800 mb-3">Real-Time Routing</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          We locate compatible donors within a 5-mile radius and route them to hospitals via live navigation maps, minimizing vital transportation delays.
        </p>
      </div>

      {/* Pillar 2 */}
      <div className="glass rounded-3xl p-8 border border-slate-100 hover:border-blood/20 transition-all duration-300 text-left">
        <div className="w-12 h-12 rounded-xl bg-blood/10 border border-blood/20 flex items-center justify-center text-blood mb-6 shadow-inner">
          <ShieldCheck size={22} />
        </div>
        <h4 className="font-title text-xl font-bold text-slate-800 mb-3">Vetted Security</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          Donor medical logs and private contact numbers are encrypted. We never share user identities with anyone other than authorized clinical staff.
        </p>
      </div>

      {/* Pillar 3 */}
      <div className="glass rounded-3xl p-8 border border-slate-100 hover:border-blood/20 transition-all duration-300 text-left">
        <div className="w-12 h-12 rounded-xl bg-blood/10 border border-blood/20 flex items-center justify-center text-blood mb-6 shadow-inner">
          <HeartHandshake size={22} />
        </div>
        <h4 className="font-title text-xl font-bold text-slate-800 mb-3">Mutual Community</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          RakthaDan isn't just an app—it's a network of real human beings dedicating their time and health to support one another in moments of critical need.
        </p>
      </div>
    </div>
  );
}
