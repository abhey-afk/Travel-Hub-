import React from 'react';
import { ChevronRight, ChevronLeft, Tag } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Domestic Flights',
    description: 'Save up to ₹5000 on domestic flights',
    code: 'FLYNOW',
    image: 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    color: 'bg-blue-600',
  },
  {
    id: 2,
    title: 'International Hotels',
    description: 'Get 40% OFF on international hotels',
    code: 'GLOBAL40',
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    color: 'bg-purple-600',
  },
  {
    id: 3,
    title: 'Bus Tickets',
    description: 'Flat 15% OFF on all bus bookings',
    code: 'BUSGO',
    image: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    color: 'bg-green-600',
  },
  {
    id: 4,
    title: 'Holiday Packages',
    description: 'Special offers on holiday packages',
    code: 'HOLIDAY25',
    image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    color: 'bg-orange-500',
  },
];

const OffersSection = () => {
  const slideLeft = () => {
    const slider = document.getElementById('offers-slider');
    if (slider) {
      slider.scrollLeft = slider.scrollLeft - 300;
    }
  };

  const slideRight = () => {
    const slider = document.getElementById('offers-slider');
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + 300;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Great Offers & Deals</h2>
        <div className="flex space-x-2">
          <button 
            onClick={slideLeft}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={slideRight}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div 
          id="offers-slider" 
          className="flex overflow-x-scroll scroll-smooth scrollbar-hide gap-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className="min-w-[300px] md:min-w-[320px] flex-none rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-0 left-0 ${offer.color} text-white px-3 py-1 rounded-br-lg flex items-center`}>
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{offer.code}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{offer.title}</h3>
                <p className="text-gray-600 mt-1">{offer.description}</p>
                <button className="mt-3 text-blue-600 font-medium flex items-center hover:text-blue-800 transition duration-300">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersSection;