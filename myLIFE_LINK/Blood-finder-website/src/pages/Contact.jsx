import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required.";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long.";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API post call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blood/10 border border-blood/20 text-blood text-xs font-bold uppercase tracking-wider mb-4">
            Get In Touch
          </div>
          <h1 className="font-title text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            How Can We <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 to-blood font-black">
              Help You Save Lives?
            </span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Have questions about the app, hospital portal integrations, or donor logs? Reach out to our technical support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          {/* Contact Details Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blood/10 border border-blood/20 flex items-center justify-center text-blood flex-shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="font-title font-bold text-slate-800 text-sm mb-1">Emergency Support</h4>
                <p className="text-xs text-slate-600">+1 (800) 543-3546</p>
                <p className="text-[10px] text-slate-450 mt-0.5">24/7 Hotline support</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blood/10 border border-blood/20 flex items-center justify-center text-blood flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="font-title font-bold text-slate-800 text-sm mb-1">General Inquiries</h4>
                <p className="text-xs text-slate-600">info@rakthadan.org</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Response within 2 hours</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blood/10 border border-blood/20 flex items-center justify-center text-blood flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-title font-bold text-slate-800 text-sm mb-1">Main Headquarters</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  100 Health Science Pkwy<br />Suite 400, NY 10012
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-8">
            <div className="glass rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-10 fade-in-anim">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 shadow-md shadow-emerald-500/10">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="font-title text-2xl font-black text-slate-900 mb-2">Message Dispatched!</h3>
                  <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                    Thank you, <span className="text-slate-800 font-bold">{formData.name}</span>. We have received your inquiry. One of our regional coordinators will respond to you at <span className="text-slate-800 font-bold">{formData.email}</span> shortly.
                  </p>
                  <button 
                    onClick={() => { setIsSubmitted(false); setFormData({ name:'', email:'', subject:'General Inquiry', message:'' }); }} 
                    className="mt-8 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className={`bg-slate-50 border ${errors.name ? 'border-blood' : 'border-slate-200 focus:border-blood'} rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-colors`}
                        placeholder="John Doe"
                      />
                      {errors.name && <span className="text-[10px] text-blood font-semibold">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={`bg-slate-50 border ${errors.email ? 'border-blood' : 'border-slate-200 focus:border-blood'} rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-colors`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <span className="text-[10px] text-blood font-semibold">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topic</label>
                    <div className="relative">
                      <select 
                        id="subject" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blood rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-colors cursor-pointer appearance-none"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Hospital Registration">Hospital Facility Integration</option>
                        <option value="Donor Dispute">Donor / Account Issues</option>
                        <option value="Bug Report">Technical Bug Report</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      value={formData.message} 
                      onChange={handleInputChange} 
                      className={`bg-slate-50 border ${errors.message ? 'border-blood' : 'border-slate-200 focus:border-blood'} rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-colors resize-none`}
                      placeholder="Write your query details here..."
                    />
                    {errors.message && <span className="text-[10px] text-blood font-semibold">{errors.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="mt-2 bg-blood hover:bg-blood-dark text-white px-6 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg shadow-blood/15 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
