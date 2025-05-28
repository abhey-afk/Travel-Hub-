import React, { useState, useEffect } from 'react';
import { Plane, Train, Hotel, Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchTrips();
  }, [activeFilter]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const params = activeFilter !== 'all' ? { status: activeFilter } : {};
      const response = await axios.get('/api/trips', { params });
      setTrips(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (tripId) => {
    try {
      await axios.patch(`/api/trips/${tripId}/cancel`);
      fetchTrips(); // Refresh trips after cancellation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel trip');
    }
  };

  const getTripIcon = (tripType) => {
    switch (tripType) {
      case 'flight':
        return <Plane className="h-6 w-6 text-blue-500" />;
      case 'train':
        return <Train className="h-6 w-6 text-green-500" />;
      case 'hotel':
        return <Hotel className="h-6 w-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">My Trips</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">View and manage your travel bookings</p>
          </div>

          {/* Filters */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('upcoming')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'upcoming'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'completed'
                    ? 'bg-gray-100 text-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveFilter('cancelled')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
              <div className="flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Trips List */}
          <div className="divide-y divide-gray-200">
            {trips.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-gray-500">No trips found</p>
              </div>
            ) : (
              trips.map((trip) => (
                <div key={trip._id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getTripIcon(trip.tripType)}
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(trip.status)}`}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">Booking ID: {trip.bookingId}</span>
                      </div>
                    </div>
                    {trip.status === 'upcoming' && (
                      <button
                        onClick={() => handleCancelTrip(trip._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Trip Details based on type */}
                    {trip.tripType === 'flight' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Flight Date</p>
                            <p className="text-sm text-gray-900">{formatDate(trip.travelDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Route</p>
                            <p className="text-sm text-gray-900">
                              {trip.flight.departure.city} → {trip.flight.arrival.city}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Flight</p>
                            <p className="text-sm text-gray-900">
                              {trip.flight.airline} - {trip.flight.flightNumber}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {trip.tripType === 'hotel' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Stay Dates</p>
                            <p className="text-sm text-gray-900">
                              {formatDate(trip.hotel.checkIn)} - {formatDate(trip.hotel.checkOut)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Hotel</p>
                            <p className="text-sm text-gray-900">{trip.hotel.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Hotel className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Room Info</p>
                            <p className="text-sm text-gray-900">
                              {trip.hotel.roomType} - {trip.hotel.rooms} room(s)
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {trip.tripType === 'train' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Journey Date</p>
                            <p className="text-sm text-gray-900">{formatDate(trip.travelDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Route</p>
                            <p className="text-sm text-gray-900">
                              {trip.train.from.station} → {trip.train.to.station}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Train className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Train</p>
                            <p className="text-sm text-gray-900">
                              {trip.train.trainName} ({trip.train.trainNumber})
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Booked on {formatDate(trip.bookingDate)}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {trip.price.currency} {trip.price.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips; 