import React from 'react';
import { Droplet, Bell, Database, Gift, PhoneCall, ShieldAlert } from 'lucide-react';

export default function Services() {
  const servicesList = [
    {
      icon: <Droplet className="text-blood" size={24} />,
      title: "Real-Time Group Matching",
      description: "Uses advanced geolocation to locate active donors who have compatible blood groups within a 5km radius, triggering immediate route updates."
    },
    {
      icon: <Bell className="text-amber-500" size={24} />,
      title: "Emergency Push Broadcasts",
      description: "When a critical request goes live, our server broadcasts high-priority notifications, bypassing silent mode on donor devices for absolute urgency."
    },
    {
      icon: <Database className="text-indigo-500" size={24} />,
      title: "Live Blood Stock Registry",
      description: "Real-time blood repository inventory dashboard showing available bags by type (A+, O-, B+, etc.) across all partner hospital databases."
    },
    {
      icon: <Gift className="text-emerald-500" size={24} />,
      title: "Donor Rewards & Milestones",
      description: "Keep track of your health logs, monitor donation rest periods, and earn exclusive rewards points redeemable at local pharmacy clinics."
    },
    {
      icon: <PhoneCall className="text-sky-500" size={24} />,
      title: "Express Coordination Helplines",
      description: "Secure, double-masked VOIP calling that connects hospital coordinates and family members with volunteer donors without exposing private numbers."
    },
    {
      icon: <ShieldAlert className="text-rose-500" size={24} />,
      title: "Immediate Disaster Response",
      description: "A centralized command module activated during regional disasters (earthquakes, mass accidents) to batch-dispatch critical blood stock."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blood/10 border border-blood/20 text-blood text-xs font-bold uppercase tracking-wider mb-4">
            Our Features
          </div>
          <h1 className="font-title text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            How RakthaDan Empowers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 to-blood font-black">
              Emergency Healthcare.
            </span>
          </h1>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg">
            Our technology suite operates seamlessly across mobile devices, hospitals, and cloud databases to manage blood demands rapidly, accurately, and safely.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div 
              key={index}
              className="glass rounded-3xl p-8 border border-slate-100 hover:border-blood/35 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-start text-left shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors">
                {service.icon}
              </div>
              <h3 className="font-title font-bold text-xl text-slate-800 mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* App Showcase banner */}
        <div className="mt-20 bg-gradient-to-r from-slate-50 to-red-50/20 border border-slate-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="text-left md:max-w-[60%]">
            <h4 className="font-title text-2xl font-bold text-slate-900 mb-3">
              Need to manage your hospital inventory?
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              We provide specific hospital portal credentials to update stock registries, place verified request batches, and review matching metrics on the go.
            </p>
          </div>
          <a 
            href="/contact" 
            className="bg-blood hover:bg-blood-dark text-white px-7 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5 shadow-lg shadow-blood/10 whitespace-nowrap"
          >
            Register Facility
          </a>
        </div>

      </div>
    </div>
  );
}
