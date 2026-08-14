import React from 'react';
import AboutHeader from '../components/About/AboutHeader';
import PillarsSection from '../components/About/PillarsSection';
import WorkflowSection from '../components/About/WorkflowSection';

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-8">
        <AboutHeader />
        <PillarsSection />
        <WorkflowSection />
      </div>
    </div>
  );
}
