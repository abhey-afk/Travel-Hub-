import React, { useState, useEffect } from 'react';
import { CalendarDays, Map, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define interfaces for type safety
interface LocationAddress {
  cityName?: string;
  countryName?: string;
}

interface Location {
  id: string;
  name: string;
  iataCode: string;
  address?: LocationAddress;
}

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [loading, setLoading] = useState(false);
  
  // Form state with proper types
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromResults, setFromResults] = useState<Location[]>([]);
  const [toResults, setToResults] = useState<Location[]>([]);
  const [showFromResults, setShowFromResults] = useState(false);
  const [showToResults, setShowToResults] = useState(false);
  
  const [selectedFrom, setSelectedFrom] = useState<Location | null>(null);
  const [selectedTo, setSelectedTo] = useState<Location | null>(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
const [passengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState('ECONOMY');
  
  // Search for locations (airports/cities) with proper types
  const searchLocations = async (query: string, setResults: React.Dispatch<React.SetStateAction<Location[]>>) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    
    try {
      const response = await axios.get(`/api/flights/locations?keyword=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    }
  };
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromQuery) searchLocations(fromQuery, setFromResults);
    }, 300);
    return () => clearTimeout(timer);
  }, [fromQuery]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (toQuery) searchLocations(toQuery, setToResults);
    }, 300);
    return () => clearTimeout(timer);
  }, [toQuery]);
  
  // Format date for API with proper type
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Handle search submission with proper event type
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFrom || !selectedTo || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    // Build search params
    const params = new URLSearchParams();
    params.append('from', selectedFrom.iataCode);
    params.append('to', selectedTo.iataCode);
    params.append('fromCity', selectedFrom.name);
    params.append('toCity', selectedTo.name);
    params.append('departureDate', formatDate(departureDate));
    params.append('adults', passengers.adults.toString());
    params.append('travelClass', travelClass);
    
    if (tripType === 'roundtrip' && returnDate) {
      params.append('returnDate', formatDate(returnDate));
    }
    
    // Navigate to results page with search params
    navigate(`/flights?${params.toString()}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Trip Type Selection */}
      <div className="flex space-x-6">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="tripType"
            value="oneway"
            checked={tripType === 'oneway'}
            onChange={() => setTripType('oneway')}
          />
          <span className="ml-2">One-way</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="tripType"
            value="roundtrip"
            checked={tripType === 'roundtrip'}
            onChange={() => setTripType('roundtrip')}
          />
          <span className="ml-2">Round-trip</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="tripType"
            value="multicity"
            checked={tripType === 'multicity'}
            onChange={() => setTripType('multicity')}
          />
          <span className="ml-2">Multi-city</span>
        </label>
      </div>

      {/* Flight Search Form */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* From */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">FROM</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Map className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Enter city or airport"
                value={selectedFrom ? selectedFrom.name : fromQuery}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setSelectedFrom(null);
                  setShowFromResults(true);
                }}
                onFocus={() => setShowFromResults(true)}
              />
              {selectedFrom && (
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedFrom(null);
                    setFromQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* From Results Dropdown */}
            {showFromResults && fromResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {fromResults.map((location) => (
                  <div
                    key={location.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedFrom(location);
                      setShowFromResults(false);
                    }}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500">
                      {location.iataCode} - {location.address?.cityName}, {location.address?.countryName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">TO</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Map className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Enter city or airport"
                value={selectedTo ? selectedTo.name : toQuery}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setSelectedTo(null);
                  setShowToResults(true);
                }}
                onFocus={() => setShowToResults(true)}
              />
              {selectedTo && (
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedTo(null);
                    setToQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* To Results Dropdown */}
            {showToResults && toResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {toResults.map((location) => (
                  <div
                    key={location.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedTo(location);
                      setShowToResults(false);
                    }}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500">
                      {location.iataCode} - {location.address?.cityName}, {location.address?.countryName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Departure */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">DEPARTURE</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
              <DatePicker
                selected={departureDate}
                onChange={(date: Date | null) => date && setDepartureDate(date)}
                className="w-full focus:outline-none"
                dateFormat="EEE, dd MMM"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Return */}
          <div className={`relative ${tripType !== 'roundtrip' ? 'opacity-50' : ''}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">RETURN</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
              <DatePicker
                selected={returnDate}
                onChange={(date: Date | null) => date && setReturnDate(date)}
                className="w-full focus:outline-none"
                dateFormat="EEE, dd MMM"
                minDate={departureDate}
                disabled={tripType !== 'roundtrip'}
              />
            </div>
          </div>
        </div>

        {/* Travelers & Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="relative lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">TRAVELLERS & CLASS</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <select 
                className="w-full focus:outline-none bg-transparent"
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2 flex items-end">
            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md transition duration-300 font-medium text-lg disabled:bg-red-300"
              disabled={loading}
            >
              {loading ? 'SEARCHING...' : 'SEARCH FLIGHTS'}
            </button>
          </div>
        </div>

        {/* Special fares */}
        <div className="flex flex-wrap gap-3 pt-4">
          <span className="text-sm font-medium text-gray-700">Special fares:</span>
          <label className="inline-flex items-center text-sm">
            <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
            <span className="ml-2">Student</span>
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
            <span className="ml-2">Armed Forces</span>
          </label>
        </div>
      </form>
    </div>
  );
};

export default FlightSearch;