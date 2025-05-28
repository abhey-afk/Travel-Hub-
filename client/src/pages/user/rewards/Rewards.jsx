import React from 'react';
import { Gift, Star, CreditCard, Clock } from 'lucide-react';

const Rewards = () => {
  // Mock data for rewards
  const rewards = [
    {
      id: 1,
      title: 'Free Weekend Rental',
      points: 500,
      description: 'Get a free weekend rental on any economy car.',
      expiryDate: '2024-12-31',
      status: 'available',
    },
    {
      id: 2,
      title: '10% Off Next Booking',
      points: 200,
      description: 'Get 10% off your next car rental booking.',
      expiryDate: '2024-06-30',
      status: 'available',
    },
    {
      id: 3,
      title: 'Premium Car Upgrade',
      points: 1000,
      description: 'Upgrade to a premium car for your next rental.',
      expiryDate: '2024-09-30',
      status: 'available',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Points Summary */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Your Rewards Points</h3>
                <p className="mt-1 text-sm text-gray-500">Earn points with every rental and redeem them for rewards.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">1,250</span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Available Rewards</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Redeem your points for these exclusive rewards.</p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Gift className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{reward.title}</h4>
                          <p className="text-sm text-gray-500">{reward.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{reward.points} points</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Redeem Reward
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards; 