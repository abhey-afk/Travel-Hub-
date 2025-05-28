import React, { useState } from 'react';
import { Plane, Hotel, Train, Bus } from 'lucide-react';
import FlightSearch from './search/FlightSearch';
import HotelSearch from './search/HotelSearch';
import TrainSearch from './search/TrainSearch';
import BusSearch from './search/BusSearch';

const SearchTabs = () => {
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: <Plane className="w-5 h-5" /> },
    { id: 'hotels', label: 'Hotels', icon: <Hotel className="w-5 h-5" /> },
    { id: 'trains', label: 'Trains', icon: <Train className="w-5 h-5" /> },
    { id: 'buses', label: 'Buses', icon: <Bus className="w-5 h-5" /> },
  ];

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightSearch />;
      case 'hotels':
        return <HotelSearch />;
      case 'trains':
        return <TrainSearch />;
      case 'buses':
        return <BusSearch />;
      default:
        return <FlightSearch />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mx-auto max-w-5xl -mt-10 relative z-10">
      {/* Tabs */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-2 flex items-center justify-center space-x-2 transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${tab.id === 'flights' ? 'rounded-tl-lg' : ''} ${
              tab.id === 'buses' ? 'rounded-tr-lg' : ''
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="p-6">{renderSearchForm()}</div>
    </div>
  );
};

export default SearchTabs;