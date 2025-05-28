import React from 'react';
import TrainSearch from '../components/TrainSearch';

const TrainResults = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Search Train Tickets
        </h1>
        <TrainSearch />
      </div>
    </div>
  );
};

export default TrainResults;