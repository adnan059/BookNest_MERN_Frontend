import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/List";
import Hotel from "./pages/Hotel";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicRoute from "./components/publicRoute";
import AdminRoute from "./components/AdminRoute";
import Admin from "./pages/adminPages/Admin";

import CreateHotel from "./pages/adminPages/CreateHotel";
import ViewAndUpdateHotel from "./pages/adminPages/ViewAndUpdateHotel";
import CreateRoom from "./pages/adminPages/CreateRoom";
import ViewAndUpdateRoom from "./pages/adminPages/ViewAndUpdateRoom";
import RoomsByHotel from "./pages/adminPages/RoomsByHotel";

const BookingApp = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<List />} />
          <Route path="/hotels/:id" element={<Hotel />} />

          <Route path="/*" element={<PublicRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/admin/*" element={<AdminRoute />}>
            <Route path="" element={<Admin />} />
            <Route path="create-hotel" element={<CreateHotel />} />
            <Route path="hotel/:hotelId" element={<ViewAndUpdateHotel />} />
            <Route path="hotel/:hotelId/create-room" element={<CreateRoom />} />

            <Route path="hotel/:hotelId/rooms" element={<RoomsByHotel />} />

            <Route path="room/:roomId" element={<ViewAndUpdateRoom />} />
          </Route>

          {/* <Route path="/*" element={<h1>Page Not Found</h1>} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default BookingApp;
