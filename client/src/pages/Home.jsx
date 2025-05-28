import React from 'react';
import HeroBanner from '../components/HeroBanner';
import OffersSection from '../components/OffersSection';
import PopularDestinations from '../components/PopularDestinations';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <OffersSection />
      <PopularDestinations />
    </div>
  );
};

export default Home; 