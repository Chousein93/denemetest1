import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Stats from './Stats';
import Testimonials from './Testimonials';
import CTA from './CTA';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;