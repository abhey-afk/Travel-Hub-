import React from 'react';
import { CalendarDays, Map } from 'lucide-react';

const BusSearch = () => {
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
              placeholder="Enter city"
              defaultValue="Bangalore"
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
              placeholder="Enter city"
              defaultValue="Mysore"
            />
          </div>
        </div>
      </div>

      {/* Travel Date and Search */}
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

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md transition duration-300 font-medium text-lg">
            SEARCH BUSES
          </button>
        </div>
      </div>

      {/* Bus type */}
      <div className="flex flex-wrap gap-3 pt-2">
        <span className="text-sm font-medium text-gray-700">Bus type:</span>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">Seater</span>
        </label>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">Sleeper</span>
        </label>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">AC</span>
        </label>
        <label className="inline-flex items-center text-sm">
          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
          <span className="ml-2">Non-AC</span>
        </label>
      </div>
    </div>
  );
};

export default BusSearch;