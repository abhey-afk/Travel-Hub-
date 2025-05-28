import React, { useState } from 'react';
import { Menu, X, User, CreditCard, Award, Bell, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../features/auth/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Travel Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/flights" className="text-gray-700 hover:text-blue-600 font-medium">Flights</Link>
            <Link to="/hotels" className="text-gray-700 hover:text-blue-600 font-medium">Hotels</Link>
            <Link to="/trains" className="text-gray-700 hover:text-blue-600 font-medium">Trains</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="#" className="text-gray-700 hover:text-blue-600">
              <Bell className="w-5 h-5" />
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center text-gray-700 hover:text-blue-600"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="mr-1">{user?.name || 'My Account'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                    <Link to="/trips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      My Trips
                    </Link>
                    <Link to="/rewards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      My Rewards
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Login / Signup
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-4 shadow-md">
          <div className="flex flex-col space-y-2">
            <Link to="/flights" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Flights</Link>
            <Link to="/hotels" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Hotels</Link>
            <Link to="/trains" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Trains</Link>
            <div className="border-t border-gray-200 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">My Profile</Link>
                  <Link to="/trips" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">My Trips</Link>
                  <Link to="/rewards" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">My Rewards</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md font-medium">Login / Signup</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;