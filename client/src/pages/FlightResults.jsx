import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Plane } from 'lucide-react';
import FlightSearch from '../components/search/FlightSearch';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fromParam = searchParams.get('from');
    // Only fetch flights if essential search parameters are present
    if (fromParam) { // Check if a search has been initiated
      setHasSearched(true);
      setLoading(true);
      const fetchFlights = async () => {
        try {
          const params = {
            originLocationCode: fromParam,
            destinationLocationCode: searchParams.get('to'),
            departureDate: searchParams.get('departureDate'),
            adults: searchParams.get('adults') || '1',
            travelClass: searchParams.get('travelClass') || 'ECONOMY'
          };

          if (searchParams.get('returnDate')) {
            params.returnDate = searchParams.get('returnDate');
          }

          const response = await axios.post('/api/flights/search', params);
          setFlights(response.data);
        } catch (err) {
          console.error('Error fetching flights:', err);
          setError('Failed to fetch flights. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchFlights();
    } else {
      // Reset states if no search params are present (e.g., initial load or navigated back)
      setHasSearched(false);
      setFlights([]);
      setLoading(false);
      setError(null);
    }
  }, [location.search]);

  // Format duration (e.g., PT2H30M to 2h 30m)
  const formatDuration = (duration) => {
    if (!duration) return '';
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? `${match[2]}m` : '';
    return `${hours} ${minutes}`.trim();
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  // Format price
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Flight Search Component */}
      <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <FlightSearch />
      </div>

      {/* Conditional Rendering for Search Results */}
      {hasSearched && (
        <>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {!loading && !error && flights.length === 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">No flights found!</strong>
              <span className="block sm:inline"> Try different search criteria.</span>
            </div>
          )}

          {!loading && !error && flights.length > 0 && (
            <>
              <div className="mb-6">
                <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
                <h1 className="text-2xl font-bold mt-4">
                  Flights from {searchParams.get('fromCity')} to {searchParams.get('toCity')}
                </h1>
                <p className="text-gray-600">
                  {searchParams.get('departureDate')}
                  {searchParams.get('returnDate') ? ` - ${searchParams.get('returnDate')}` : ''}
                </p>
              </div>
              <div className="space-y-4">
                {flights.map((flight, index) => {
                  const itinerary = flight.itineraries[0];
                  const firstSegment = itinerary.segments[0];
                  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                  const departure = formatDateTime(firstSegment.departure.at);
                  const arrival = formatDateTime(lastSegment.arrival.at);

                  return (
                    <div key={index} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        {/* Airline */}
                        <div className="mb-4 md:mb-0 md:mr-6">
                          <div className="font-semibold">{firstSegment.carrierCode}</div>
                          <div className="text-sm text-gray-500">Flight {firstSegment.number}</div>
                        </div>
                        
                        {/* Flight times */}
                        <div className="flex-grow grid grid-cols-3 gap-2 mb-4 md:mb-0">
                          {/* Departure */}
                          <div>
                            <div className="text-lg font-bold">{departure.time}</div>
                            <div className="text-sm">{departure.date}</div>
                            <div className="text-xs text-gray-500">{firstSegment.departure.iataCode}</div>
                          </div>
                          
                          {/* Duration */}
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-xs text-gray-500 mb-1">{formatDuration(itinerary.duration)}</div>
                            <div className="relative w-full">
                              <div className="absolute h-0.5 bg-gray-300 w-full top-1/2"></div>
                              <div className="absolute left-0 -mt-1">
                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                              </div>
                              <div className="absolute right-0 -mt-1">
                                <Plane className="w-4 h-4 text-gray-500" />
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {itinerary.segments.length > 1 ? `${itinerary.segments.length - 1} stop(s)` : 'Direct'}
                            </div>
                          </div>
                          
                          {/* Arrival */}
                          <div className="text-right">
                            <div className="text-lg font-bold">{arrival.time}</div>
                            <div className="text-sm">{arrival.date}</div>
                            <div className="text-xs text-gray-500">{lastSegment.arrival.iataCode}</div>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="w-full md:w-auto">
                          <div className="text-xl font-bold text-blue-600">
                            {formatPrice(flight.price.total, flight.price.currency)}
                          </div>
                          <button 
                            onClick={() => navigate('/flights/booking', { 
                              state: { flight }, 
                              search: location.search 
                            })}
                            className="mt-2 w-full md:w-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                      
                      {/* Flight details (expandable) */}
                      {itinerary.segments.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            {itinerary.segments.length - 1} Stop(s): 
                            {itinerary.segments.slice(0, -1).map((segment, i) => (
                              <span key={i} className="ml-1">
                                {segment.arrival.iataCode}{i < itinerary.segments.length - 2 ? ',' : ''}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            Total duration: {formatDuration(itinerary.duration)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FlightResults;