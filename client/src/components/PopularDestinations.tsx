import React from 'react';
import { MapPin } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Goa',
    description: 'Beach paradise with vibrant nightlife',
    image: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: '₹12,999',
  },
  {
    id: 2,
    name: 'Kerala',
    description: 'Serene backwaters and lush greenery',
    image: 'https://images.pexels.com/photos/1310755/pexels-photo-1310755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: '₹15,499',
  },
  {
    id: 3,
    name: 'Rajasthan',
    description: 'Royal palaces and desert adventures',
    image: 'https://images.pexels.com/photos/14865356/pexels-photo-14865356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: '₹18,999',
  },
  {
    id: 4,
    name: 'Himachal',
    description: 'Scenic mountains and adventure sports',
    image: 'https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: '₹14,499',
  },
  {
    id: 5,
    name: 'Andaman',
    description: 'Pristine beaches and coral reefs',
    image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: '₹22,999',
  },
  {
    id: 6,
    name: 'Ladakh',
    description: 'Breathtaking landscapes and monasteries',
    image: 'https://images.pexels.com/photos/6650184/pexels-photo-6650184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: '₹20,499',
  },
];

const PopularDestinations = () => {
  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Popular Destinations in India
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div 
            key={destination.id} 
            className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="w-full h-full object-cover transition duration-500 hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-bold text-xl">{destination.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-3">{destination.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-blue-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>View Packages</span>
                </div>
                <div className="font-bold text-gray-800">{destination.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium">
          Explore All Destinations
        </button>
      </div>
    </div>
  );
};

export default PopularDestinations;