import React from 'react';
import { CalendarDays, Map, Users } from 'lucide-react';

const TrainSearch = () => {
  return (
    <div className="space-y-6">
      {/* From and To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">FROM</label>
          <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Map className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full focus:outline-none"
              placeholder="Enter city or station"
              defaultValue="New Delhi"
            />
          </div>
        </div>

        {/* To */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">TO</label>
          <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Map className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full focus:outline-none"
              placeholder="Enter city or station"
              defaultValue="Mumbai Central"
            />
          </div>
        </div>
      </div>

      {/* Travel Date and Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Travel Date */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">TRAVEL DATE</label>
          <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full focus:outline-none"
              placeholder="Select date"
              defaultValue="Thu, 25 Jul"
            />
          </div>
        </div>

        {/* Class */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">CLASS</label>
          <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <select className="w-full focus:outline-none bg-transparent">
              <option>All Classes</option>
              <option>Sleeper Class (SL)</option>
              <option>AC 3 Tier (3A)</option>
              <option>AC 2 Tier (2A)</option>
              <option>AC First Class (FC)</option>
              <option>Chair Car (CC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex">
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md transition duration-300 font-medium text-lg">
          SEARCH TRAINS
        </button>
      </div>

      {/* Special quotas */}
      <div className="flex flex-wrap gap-3 pt-2">
        <span className="text-sm font-medium text-gray-700">Special quotas:</span>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">Tatkal</span>
        </label>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">Ladies</span>
        </label>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">Senior Citizen</span>
        </label>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">Person with Disability</span>
        </label>
      </div>
    </div>
  );
};

export default TrainSearch;