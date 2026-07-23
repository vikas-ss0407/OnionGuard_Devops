import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedUser = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  // Map routes to display titles
  const routeTitles = {
    "/dashboard": "Dashboard",
    "/manage-shops": "Manage Shops",
    "/manage-boxes": "Manage Boxes",
    "/addbox": "Add Box",
    "/billing": "Billing",
    "/print-bill": "Print Bill",
    "/manage-sensors": "Manage Sensors",
    "/profile": "Profile",
  };

  // Get the title based on the current path
  const pageTitle = routeTitles[location.pathname] || "";

  return (
    <motion.nav
      className="bg-indigo-700 text-white p-4 flex justify-end items-center shadow-lg relative sticky top-0 z-50 backdrop-blur-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      {/* Dynamic title */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <span className="text-2xl font-black tracking-wider">
          OnionGuard {pageTitle}
        </span>
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:bg-indigo-600 p-2 rounded transition-colors duration-200"
        >
          <FaUserCircle size={28} />
          <span className="font-semibold">{user ? user.name : "Guest"}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 bg-white text-gray-800 rounded-lg shadow-xl w-40 z-50 overflow-hidden">
            <button
              onClick={goToProfile}
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 text-sm"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm border-t border-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
