import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import LandingPage from './components/user/LandingPage';
import Login from './components/Login';
import Register from './components/user/Register';
import UpdateProfile from './components/user/UpdateProfile';
import AdminLandingPage from './components/admin/LandingPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ForgotPassword from './components/user/ForgotPassword';
import SeatBooking from './components/user/SeatInterface';
import AdminUpdateProfile from './components/admin/AdminUpdateProfile';
import AddMovie from './components/admin/AddMovie';
import AddShow from './components/admin/AddShow';
import UpdateMovie from './components/admin/UpdateMovie';
import UpdateShow from './components/admin/UpdateShow';
import ManageReviews from './components/admin/ManageReviews';
import UserDashboard from './components/user/UserDashboard';
import BookMovie from './components/user/BookMovie';
import SelectShow from './components/user/SelectShow';
import SelectSeat from './components/user/SelectSeat';
import MakePayment from './components/user/Payment';
import Confirmation from './components/user/ConfirmationPage';
import MyBookings from './components/user/MyBookings';


function App() {
  return (
      <BrowserRouter>
        <Routes>
          
          {/* Common Routes for Customer and Admin*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* Customer Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/update-profile" element={<UpdateProfile />} />
          <Route path="/user/my-bookings" element={<MyBookings />} />
          <Route path="/user/selectSeat" element={<SeatBooking />} />
          <Route path="/user/book-movie/:movieId" element={<BookMovie />} />
          <Route path="/user/select-show/:movieId" element={<SelectShow />} />
          <Route path="/user/book-seats/:showId/" element={<SelectSeat />} />
          <Route path="/user/payment/:showId/" element={<MakePayment />} />
          <Route path="/user/booking-confirmed/" element={<Confirmation />} />

          {/* <Route path="/user/select-seat" element={<SeatInterface />} /> */}




          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLandingPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/updateProfile" element={<AdminUpdateProfile />} />
          <Route path="/admin/add-movie" element={<AddMovie />} />
          <Route path="/admin/update-movie/:id" element={<UpdateMovie />} />      
          <Route path="/admin/add-show" element={<AddShow />} />
          <Route path="/admin/update-show/:id" element={<UpdateShow />} />
          <Route path="/admin/manage-reviews/:movieId" element={<ManageReviews />} />   

      </Routes>
      </BrowserRouter>
  );
}

export default App;
