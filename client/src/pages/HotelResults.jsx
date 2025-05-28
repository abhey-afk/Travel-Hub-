import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, MapPin, Users } from 'lucide-react';
import HotelSearch from '../components/search/HotelSearch';

const HotelResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const cityCode = searchParams.get('cityCode');
    // Only fetch hotels if essential search parameters are present
    if (cityCode) {
      setHasSearched(true);
      setLoading(true);
      const fetchHotels = async () => {
        try {
          const params = {
            cityCode,
            checkInDate: searchParams.get('checkInDate'),
            checkOutDate: searchParams.get('checkOutDate'),
            adults: searchParams.get('adults') || '2',
            roomQuantity: searchParams.get('rooms') || '1',
          };

          if (searchParams.get('priceRange')) {
            params.priceRange = searchParams.get('priceRange');
          }

          if (searchParams.get('ratings')) {
            params.ratings = searchParams.get('ratings').split(',');
          }

          const response = await axios.post('/api/hotels/search', params);
          setHotels(response.data);
        } catch (err) {
          console.error('Error fetching hotels:', err);
          setError('Failed to fetch hotels. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchHotels();
    } else {
      setHasSearched(false);
      setHotels([]);
      setLoading(false);
      setError(null);
    }
  }, [location.search]);

  // Format price
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  // Render star rating
  const renderStarRating = (rating) => {
    return [...Array(Math.round(rating))].map((_, index) => (
      <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
    ));
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
      {/* Hotel Search Component */}
      <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <HotelSearch />
      </div>

      {/* Conditional Rendering for Search Results */}
      {hasSearched && (
        <>
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold mt-4">
              Hotels in {searchParams.get('cityName')}
            </h1>
            <p className="text-gray-600">
              {searchParams.get('checkInDate')} to {searchParams.get('checkOutDate')}
            </p>
          </div>

          {!loading && !error && hotels.length === 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">No hotels found!</strong>
              <span className="block sm:inline"> Try different search criteria.</span>
            </div>
          )}

          {!loading && !error && hotels.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Hotel Image */}
                  <div className="relative h-48">
                    <img
                      src={hotel.media?.[0]?.uri || 'https://via.placeholder.com/400x200?text=Hotel+Image'}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    {hotel.rating && (
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
                        {renderStarRating(hotel.rating)}
                      </div>
                    )}
                  </div>

                  {/* Hotel Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
                    <div className="flex items-start mb-2 text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 mt-1 flex-shrink-0" />
                      <p className="text-sm">{hotel.address?.lines?.join(', ')}</p>
                    </div>
                    <div className="flex items-center mb-4 text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <p className="text-sm">{searchParams.get('adults')} guests, {searchParams.get('rooms')} room</p>
                    </div>

                    {/* Amenities */}
                    {hotel.amenities && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Per night</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatPrice(hotel.offers?.[0]?.price?.total, hotel.offers?.[0]?.price?.currency)}
                        </p>
                      </div>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelResults; 