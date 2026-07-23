import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

import ManageShops from "./pages/ManageShops";
import ManageBoxes from "./pages/ManageBoxes"; 
import AddBox from "./pages/AddBox";
import Billing from "./pages/Billing";
import PrintBill from "./pages/PrintBill";
import ManageSensors from "./pages/ManageSensors";

import ProtectedRoute from "./components/ProtectedRoute"; // ✅ import ProtectedRoute

export default function App() {
  const location = useLocation();
  const showNavbar =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/manage-shops") ||
    location.pathname.startsWith("/manage-boxes") || 
    location.pathname.startsWith("/addbox") ||
    location.pathname.startsWith("/billing") ||
    location.pathname.startsWith("/print-bill") ||
    location.pathname.startsWith("/manage-sensors");

  return (
    <div className="min-h-screen bg-gray-100">
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-shops"
          element={
            <ProtectedRoute>
              <ManageShops />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-boxes"
          element={
            <ProtectedRoute>
              <ManageBoxes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addbox"
          element={
            <ProtectedRoute>
              <AddBox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/print-bill"
          element={
            <ProtectedRoute>
              <PrintBill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-sensors"
          element={
            <ProtectedRoute>
              <ManageSensors />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
