import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { updateProfile, getProfile } from "../api/auth";
// 🚨 ASSUMED: Import your Navbar component
import Navbar from "../components/Navbar"; 

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        if (res.user) setUser(res.user);
        calculateCompletion(res.user);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  const calculateCompletion = (userData) => {
    const fields = ["name", "email", "phone", "address"];
    let filled = fields.filter((f) => userData[f] && String(userData[f]).trim() !== "").length;
    setCompletion(Math.round((filled / fields.length) * 100));
  };

  const handleSave = async () => {
    try {
      const dataToUpdate = {
        name: user.name,
        phone: user.phone,
        address: user.address,
      };
      
      const res = await updateProfile(dataToUpdate);

      if (res.user) {
        setUser(res.user);
        setEditMode(false);
        calculateCompletion(res.user);
        alert("Profile updated successfully!");
      } else {
        alert(res.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  // Circle settings
  const radius = 50; 
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (completion / 100) * circumference;
  
  const progressColor = completion === 100 ? "#10b981" : "#3b82f6"; 
  const statusText = completion === 100 ? "Profile Complete 🎉" : "In Progress...";

// 🔑 CHANGE: Wrap everything in a main Fragment or Div.
// I've removed `min-h-screen bg-gray-50` from the internal div and placed the
// entire profile content inside a new structure to accommodate the Navbar.
return (
    <>
      {/* 1. Navbar component at the top */}
      <Navbar />

      {/* 2. Main content container. Retains background and minimum height. */}
      <div className="min-h-screen bg-gray-50 pt-16 px-4"> 
        {/* Loading State or No User Found */}
        {!user ? (
            <div className="p-6 max-w-lg mx-auto">
              <p className="text-red-500 text-center font-semibold">
                {user === null ? "Loading profile..." : "No user found"}
              </p>
            </div>
        ) : (
            // Profile Card Content
            <div className="flex justify-center items-start">
              <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg overflow-hidden">
                {/* Header Section - Progress Circle */}
                <div className="bg-indigo-600 p-8 text-white flex flex-col items-center">
                  <div className="relative w-28 h-28 mb-3">
                    <svg height={radius * 2} width={radius * 2}>
                      {/* Background Circle */}
                      <circle stroke="#ffffff40" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                      {/* Progress Circle */}
                      <circle 
                        stroke={progressColor} 
                        fill="transparent" 
                        strokeWidth={stroke} 
                        strokeLinecap="round" 
                        r={normalizedRadius} 
                        cx={radius} 
                        cy={radius} 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        transform={`rotate(-90 ${radius} ${radius})`} 
                      />
                    </svg>
                    {/* Percentage Text */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-extrabold text-white leading-none">
                      {completion}%
                    </div>
                  </div>
                  <h2 className="text-3xl font-extrabold mt-2">{user.name || "User Profile"}</h2>
                  <p className="text-indigo-200 mt-1">{statusText}</p>
                </div>

                {/* Profile Details / Form Section */}
                <div className="p-8">
                  {editMode ? (
                    <div className="space-y-6">
                      {["name","email","phone","address"].map((field) => (
                        <div key={field}>
                          <label className="block text-gray-700 font-semibold mb-2 text-sm">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            value={user[field] || ""}
                            onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                            readOnly={field === "email"}
                            placeholder={field === "address" ? "Enter your full address" : `Enter your ${field}`}
                            className={`w-full p-3 border border-gray-300 rounded-lg transition duration-150 focus:outline-none focus:ring-2 
                              ${field === "email" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "focus:ring-indigo-500 focus:border-indigo-500"}`}
                          />
                        </div>
                      ))}
                      <div className="flex justify-end gap-3 pt-4">
                        <button 
                          onClick={() => setEditMode(false)} 
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition shadow-md"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSave} 
                          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {["name","email","phone","address"].map((field) => (
                        <div key={field} className="grid grid-cols-2 gap-4 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-600">
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                          </span>
                          <span className={`text-gray-800 break-words ${!user[field] && 'text-gray-400 italic'}`}>
                            {user[field] || (field === "email" ? "" : "Not Provided")}
                          </span>
                        </div>
                      ))}
                      <div className="text-center pt-4">
                        <button 
                          onClick={() => setEditMode(true)} 
                          className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-600 transition transform hover:scale-[1.01]"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
    </>
);
}