import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Award, ChevronRight } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Why RakthaDan Makes a Difference
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Traditional blood requests take hours. RakthaDan matches urgent patient requests with volunteer blood donors in minutes using live location technology.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="glass rounded-3xl p-8 border border-slate-100 hover:border-blood/30 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blood/10 border border-blood/20 flex items-center justify-center text-blood group-hover:bg-blood group-hover:text-white group-hover:border-blood transition-all duration-300 mb-6">
              <Clock size={22} />
            </div>
            <h3 className="font-title font-bold text-xl text-slate-800 mb-3">
              Instant Alert Broadcasts
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              When hospitals log urgent blood requirements, nearby compatible donors receive instant push notifications to request direct coordinate donation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass rounded-3xl p-8 border border-slate-100 hover:border-blood/30 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-all duration-300 mb-6">
              <Shield size={22} />
            </div>
            <h3 className="font-title font-bold text-xl text-slate-800 mb-3">
              Verified Medical Facilities
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We vet every connected hospital, clinic, and blood storage facility. Your details remain private, and donation processes follow strict medical guidelines.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass rounded-3xl p-8 border border-slate-100 hover:border-blood/30 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300 mb-6">
              <Award size={22} />
            </div>
            <h3 className="font-title font-bold text-xl text-slate-800 mb-3">
              Lifesaver Reward Program
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every checkout, check-in, or verified donation earns points that can be redeemed for health diagnostic vouchers, organic supplements, and badges.
            </p>
          </div>
        </div>

        {/* CTAs Bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            to="/about" 
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 hover:border-blood/30 px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5"
          >
            Learn Our Story <ChevronRight size={16} />
          </Link>
          <Link 
            to="/services" 
            className="bg-transparent border border-slate-200 hover:border-blood hover:bg-blood/5 text-slate-700 px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5"
          >
            Explore App Services
          </Link>
        </div>

      </div>
    </section>
  );
}
