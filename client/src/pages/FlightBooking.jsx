import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plane, Clock, Users, CreditCard } from 'lucide-react';
import PaymentForm from '../components/payment/PaymentForm';

const FlightBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flightDetails] = useState(location.state?.flight);
  const [formData, setFormData] = useState({
    passengers: [],
    contactEmail: '',
    contactPhone: '',
    paymentMethod: 'card'
  });

  useEffect(() => {
    if (!flightDetails) {
      navigate('/flights');
    } else {
      // Initialize passengers array based on the number of passengers
      const totalPassengers = parseInt(new URLSearchParams(location.search).get('adults') || '1');
      setFormData(prev => ({
        ...prev,
        passengers: Array(totalPassengers).fill({
          type: 'adult',
          title: '',
          firstName: '',
          lastName: '',
          dob: '',
        })
      }));
    }
  }, [flightDetails, navigate, location.search]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? `${match[2]}m` : '';
    return `${hours} ${minutes}`.trim();
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR'
    }).format(price);
  };

  const handleInputChange = (index, field, value) => {
    setFormData(prev => {
      const newPassengers = [...prev.passengers];
      newPassengers[index] = {
        ...newPassengers[index],
        [field]: value
      };
      return { ...prev, passengers: newPassengers };
    });
  };

  const handleContactInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Create booking payload
      const bookingData = {
        flightOffer: flightDetails,
        passengers: formData.passengers,
        contact: {
          email: formData.contactEmail,
          phone: formData.contactPhone
        },
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status
        }
      };

      // Make booking API call
      const response = await axios.post('/api/flights/book', bookingData);
      
      // Redirect to confirmation page or trips page
      navigate('/trips', { state: { bookingConfirmed: true, bookingId: response.data.bookingId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    }
  };

  const handlePaymentError = (error) => {
    setError(`Payment failed: ${error.message}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission is handled by the PaymentForm component
  };

  if (!flightDetails) {
    return null;
  }

  const firstSegment = flightDetails.itineraries[0].segments[0];
  const lastSegment = flightDetails.itineraries[0].segments[flightDetails.itineraries[0].segments.length - 1];
  const departure = formatDateTime(firstSegment.departure.at);
  const arrival = formatDateTime(lastSegment.arrival.at);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Flight Results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Passenger Information</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Passenger Forms */}
              {formData.passengers.map((passenger, index) => (
                <div key={index} className="mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Passenger {index + 1}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <select
                        value={passenger.title}
                        onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={passenger.dob}
                        onChange={(e) => handleInputChange(index, 'dob', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleContactInfoChange('contactEmail', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleContactInfoChange('contactPhone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Payment</h3>
                <PaymentForm
                  amount={parseFloat(flightDetails.price.total)}
                  currency={flightDetails.price.currency.toLowerCase()}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>

        {/* Flight Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Flight Summary</h2>
            
            <div className="space-y-4">
              {/* Flight Info */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <div className="font-semibold">{firstSegment.carrierCode}</div>
                  <div className="text-sm text-gray-500">Flight {firstSegment.number}</div>
                </div>
                <Plane className="w-6 h-6 text-gray-400" />
              </div>

              {/* Times */}
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Departure</div>
                  <div className="font-semibold">{departure.time}</div>
                  <div className="text-sm">{departure.date}</div>
                  <div className="text-sm text-gray-500">{firstSegment.departure.iataCode}</div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDuration(flightDetails.itineraries[0].duration)}
                </div>

                <div>
                  <div className="text-sm text-gray-500">Arrival</div>
                  <div className="font-semibold">{arrival.time}</div>
                  <div className="text-sm">{arrival.date}</div>
                  <div className="text-sm text-gray-500">{lastSegment.arrival.iataCode}</div>
                </div>
              </div>

              {/* Passengers */}
              <div className="flex items-center space-x-2 py-4 border-t">
                <Users className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {formData.passengers.length} Passenger(s)
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Total Price</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatPrice(flightDetails.price.total, flightDetails.price.currency)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Including all taxes and fees
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking; 