import React, { useState, useEffect } from 'react';
import { CalendarDays, Map, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define interfaces for type safety
interface CityAddress {
  cityName: string;
  countryName: string;
}

interface City {
  id: string;
  name: string;
  iataCode: string;
  address: CityAddress;
}

const HotelSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState<City[]>([]);
  const [showCityResults, setShowCityResults] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)); // 2 days from now
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [priceRange, setPriceRange] = useState('');
  const [ratings, setRatings] = useState<string[]>([]);
  
  // Search for cities
  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCityResults([]);
      return;
    }
    
    try {
      const response = await axios.get(`/api/hotels/cities?keyword=${encodeURIComponent(query)}`);
      setCityResults(response.data);
    } catch (error) {
      console.error('Error searching cities:', error);
      setCityResults([]);
    }
  };
  
  // Debounce city search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cityQuery) searchCities(cityQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [cityQuery]);
  
  // Format date for API
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCity || !checkInDate || !checkOutDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    // Build search params
    const params = new URLSearchParams();
    params.append('cityCode', selectedCity.iataCode);
    params.append('cityName', selectedCity.address.cityName);
    params.append('checkInDate', formatDate(checkInDate));
    params.append('checkOutDate', formatDate(checkOutDate));
    params.append('rooms', rooms.toString());
    params.append('adults', adults.toString());
    if (priceRange) params.append('priceRange', priceRange);
    if (ratings.length > 0) params.append('ratings', ratings.join(','));
    
    // Navigate to results page with search params
    navigate(`/hotels?${params.toString()}`);
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City Selection */}
          <div className="relative lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">CITY</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Map className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Enter city"
                value={selectedCity ? selectedCity.address.cityName : cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setSelectedCity(null);
                  setShowCityResults(true);
                }}
                onFocus={() => setShowCityResults(true)}
              />
              {selectedCity && (
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedCity(null);
                    setCityQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* City Results Dropdown */}
            {showCityResults && cityResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {cityResults.map((city) => (
                  <div
                    key={city.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityResults(false);
                    }}
                  >
                    <div className="font-medium">{city.address.cityName}</div>
                    <div className="text-xs text-gray-500">
                      {city.address.countryName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">CHECK-IN</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
              <DatePicker
                selected={checkInDate}
                onChange={(date: Date | null) => date && setCheckInDate(date)}
                className="w-full focus:outline-none"
                dateFormat="EEE, dd MMM"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">CHECK-OUT</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
              <DatePicker
                selected={checkOutDate}
                onChange={(date: Date | null) => date && setCheckOutDate(date)}
                className="w-full focus:outline-none"
                dateFormat="EEE, dd MMM"
                minDate={checkInDate}
              />
            </div>
          </div>
        </div>

        {/* Rooms & Guests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">ROOMS</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <select 
                className="w-full focus:outline-none bg-transparent"
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">GUESTS</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <select 
                className="w-full focus:outline-none bg-transparent"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">PRICE RANGE</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <select 
                className="w-full focus:outline-none bg-transparent"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-300">$200 - $300</option>
                <option value="300-500">$300 - $500</option>
                <option value="500-1000">$500 - $1000</option>
                <option value="1000-">$1000+</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md transition duration-300 font-medium text-lg disabled:bg-red-300"
              disabled={loading}
            >
              {loading ? 'SEARCHING...' : 'SEARCH HOTELS'}
            </button>
          </div>
        </div>

        {/* Star Rating Filter */}
        <div className="flex flex-wrap gap-3 pt-4">
          <span className="text-sm font-medium text-gray-700">Star Rating:</span>
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600 rounded"
                checked={ratings.includes(rating.toString())}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRatings([...ratings, rating.toString()]);
                  } else {
                    setRatings(ratings.filter(r => r !== rating.toString()));
                  }
                }}
              />
              <span className="ml-2">{rating} Star</span>
            </label>
          ))}
        </div>
      </form>
    </div>
  );
};

export default HotelSearch;