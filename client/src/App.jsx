import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import OffersSection from './components/OffersSection';
import PopularDestinations from './components/PopularDestinations';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/user/profile/Profile';
import Trips from './pages/user/trips/Trips';
import Rewards from './pages/user/rewards/Rewards';
import FlightResults from './pages/FlightResults';
import FlightBooking from './pages/FlightBooking';
import HotelResults from './pages/HotelResults';
import TrainResults from './pages/TrainResults';
import BusResults from './pages/BusResults';
import PaymentSuccess from './pages/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/flights" element={<FlightResults />} />
          <Route path="/hotels" element={<HotelResults />} />
          <Route path="/trains" element={<TrainResults />} />
          <Route path="/buses" element={<BusResults />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          
          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/flights/booking" element={<FlightBooking />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;