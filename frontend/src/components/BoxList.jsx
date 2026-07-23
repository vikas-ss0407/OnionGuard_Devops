import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Add motion for smooth transitions

export default function BoxList({ boxes, onRemove, onEdit, onUpdateAlert }) {
  // Remove edit-related states (editId, editBoxNumber, etc.)
  const [activeAlertBox, setActiveAlertBox] = useState(null); // popup state

  // We can remove startEdit/submitEdit since editing is moved to a modal

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const today = new Date();

  if (!boxes || boxes.length === 0) {
    return <p className="text-gray-600 text-center text-lg py-10">No boxes available. Click "+ Add Box" to get started.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {boxes.map((box) => {
        const imageSrc =
          box.type === "Bulb Onion"
            ? "/images/bulb onion.jpg"
            : "/images/shallot onion.jpg";

        // Check if any alert needs notification
        const alertToNotify = box.maintenanceAlerts?.find(
          (a) =>
            a.status !== "completed" &&
            new Date(a.notifyDate) <= today
        );

        return (
          <motion.div
            key={box._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg w-80 transition transform hover:scale-[1.02] relative border border-gray-100"
          >
            {/* Notification Symbol */}
            {alertToNotify && (
              <div
                onClick={() => setActiveAlertBox(box)}
                className="absolute top-3 right-3 w-7 h-7 bg-red-600 text-white flex items-center justify-center rounded-full cursor-pointer shadow-lg z-10 animate-pulse"
                title="Maintenance Alert - Click to view"
              >
                🚨
              </div>
            )}

            {/* Image container */}
            <div className="h-48 w-full overflow-hidden rounded-t-xl">
              <img
                src={imageSrc}
                alt={box.type}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Box info */}
            <div className="p-4 space-y-2">
              <p className="font-extrabold text-xl text-indigo-700 border-b pb-1">
                Box: {box.boxNumber}
              </p>
              <p className="text-base">
                <strong>Type:</strong> {box.type}
              </p>
              <p className="text-base">
                <strong>Quantity:</strong> <span className="font-medium text-gray-700">{box.quantity} kg</span>
              </p>
              <p className="text-base">
                <strong>Price/kg:</strong> <span className="font-medium text-gray-700">₹ {box.pricePerKg}</span>
              </p>
              <p className="text-xs text-gray-500 pt-1">
                Created At: {formatDateTime(box.createdAt)}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 pt-3 border-t">
                <button
                  onClick={() => onEdit(box)} // Calls parent to open edit modal
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm font-semibold transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onRemove(box._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm font-semibold transition"
                >
                  🗑️ Remove
                </button>
              </div>
            </div>

            {/* Alert Popup (now using AnimatePresence) */}
            <AnimatePresence>
              {activeAlertBox && activeAlertBox._id === box._id && alertToNotify && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setActiveAlertBox(null)} // Close on overlay click
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                  >
                    <h3 className="text-xl font-bold mb-4 text-red-600 border-b pb-2">Maintenance Alert</h3>
                    <p className="text-gray-700 mb-4">
                      Box <strong>{box.boxNumber}</strong> is due for the{" "}
                      <span className="font-semibold">{alertToNotify.days}-day</span> maintenance schedule.
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                      <button
                        onClick={() => {
                          onUpdateAlert(box._id, alertToNotify.days, "completed");
                          setActiveAlertBox(null);
                        }}
                        className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 font-semibold transition"
                      >
                        ✅ Mark as Completed
                      </button>
                      <button
                        onClick={() => {
                          onUpdateAlert(box._id, alertToNotify.days, "remind");
                          setActiveAlertBox(null);
                        }}
                        className="bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 font-semibold transition"
                      >
                        🔔 Remind me in 1 day
                      </button>
                      <button
                        onClick={() => setActiveAlertBox(null)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold transition"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}