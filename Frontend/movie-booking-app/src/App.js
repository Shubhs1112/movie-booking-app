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

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />
          <Route path="/selectSeat" element={<SeatBooking />} />

          <Route path="/admin" element={<AdminLandingPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/updateProfile" element={<AdminUpdateProfile />} />
          <Route path="/admin/add-movie" element={<AddMovie />} />
          <Route path="/admin/update-movie/:id" element={<UpdateMovie />} />      
          <Route path="/admin/add-show" element={<AddShow />} />
          <Route path="/admin/update-show/:id" element={<UpdateShow />} />      
      </Routes>
      </BrowserRouter>
  );
}

export default App;
