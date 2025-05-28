import React from 'react';
import SearchTabs from './SearchTabs';

const HeroBanner = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div 
        className="bg-cover bg-center h-96" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/40"></div>
        <div className="relative container mx-auto px-4 py-16 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Travel the world with <span className="text-yellow-400">Travel Hub</span>
          </h1>
          <p className="text-white text-xl md:text-2xl max-w-2xl">
            Book flights, hotels, trains and buses at the best prices
          </p>
        </div>
      </div>
      
      {/* Search Tabs will be removed from here */}
      {/* 
      <div className="container mx-auto px-4 relative">
        <SearchTabs />
      </div>
      */}
    </div>
  );
};

export default HeroBanner;