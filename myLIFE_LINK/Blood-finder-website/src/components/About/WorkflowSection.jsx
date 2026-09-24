import React from 'react';

export default function WorkflowSection() {
  return (
    <div className="max-w-4xl mx-auto mt-12 bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
      <h3 className="font-title text-2xl md:text-3xl font-extrabold text-slate-900 text-center mb-10">
        How The App Works
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blood text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(239,35,60,0.3)]">
            1
          </div>
          <h5 className="font-bold text-slate-800 mb-2">Post or Find</h5>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            Hospitals or patient families post a blood request detailing location, quantity, and blood type.
          </p>
        </div>
        
        {/* Step 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blood text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(239,35,60,0.3)]">
            2
          </div>
          <h5 className="font-bold text-slate-800 mb-2">Match & Chat</h5>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            Compatible local donors are notified. Once accepted, a secure bridge opens to sync coordinate details.
          </p>
        </div>
        
        {/* Step 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blood text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(239,35,60,0.3)]">
            3
          </div>
          <h5 className="font-bold text-slate-800 mb-2">Donate & Save</h5>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            The donor arrives at the verified clinical center, completes the donation, and earns lifesaver coins.
          </p>
        </div>
      </div>
    </div>
  );
}
