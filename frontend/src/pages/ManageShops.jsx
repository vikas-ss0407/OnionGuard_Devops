import { useEffect, useState } from "react";
import { getShops, createShop, deleteShop, updateShop } from "../api/shops";
import { motion, AnimatePresence } from "framer-motion";
import ShopForm from "../components/ShopForm"; 

// --- Modal Component (Unchanged) ---
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
      onClick={onClose} 
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">{title}</h2>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-light leading-none"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </motion.div>
    </div>
  );
};

// --- Main ManageShops Component ---

export default function ManageShops() {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getShops();
        setShops(Array.isArray(data) ? data : []);
        setIsError(false);
      } catch (e) {
        console.error("Failed to fetch shops:", e);
        setIsError(true);
        setShops([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const triggerSuccessNotification = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 3000);
  };

  // --- Modal & CRUD Logic (Unchanged) ---
  const openAddModal = () => {
    setEditingShop(null); 
    setIsModalOpen(true);
  };

  const openEditModal = (shop) => {
    setEditingShop(shop); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShop(null); 
  };

  const handleSaveShop = async (shopData) => {
    closeModal();
    
    if (editingShop && editingShop._id) {
      // EDIT operation
      try {
        const updated = await updateShop(editingShop._id, shopData);
        setShops(shops.map((s) => (s._id === editingShop._id ? updated : s)));
        triggerSuccessNotification(`Shop "${updated.name}" updated successfully!`);
      } catch (error) {
        alert("Failed to update shop. Check console.");
        console.error("Update failed:", error);
      }
    } else {
      // ADD operation
      try {
        const newShop = await createShop(shopData);
        setShops([...shops, newShop]);
        triggerSuccessNotification(`Shop "${newShop.name}" added successfully!`);
      } catch (error) {
        alert("Failed to create shop. Check console.");
        console.error("Create failed:", error);
      }
    }
  };

  const handleDeleteShop = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;
    try {
      await deleteShop(id);
      setShops(shops.filter((s) => s._id !== id));
      triggerSuccessNotification("Shop removed successfully!");
    } catch (error) {
      alert("Failed to delete shop. Check console.");
      console.error("Delete failed:", error);
    }
  };

  // --- Success Notification Component (Unchanged) ---
  const SuccessNotification = () => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed bottom-5 right-5 z-[101] flex items-center bg-green-500 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-2xl border-2 border-green-700"
    >
      ✅ {successMessage}
    </motion.div>
  );

  // --- Table Content Renderer (Updated font size) ---
  const tableBodyContent = () => {
    if (isLoading) {
      // ... loading state ...
      return (
        <tr className="bg-white">
          <td colSpan={5} className="text-center py-6 text-indigo-600">
            <div className="flex justify-center items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading shop data...
            </div>
          </td>
        </tr>
      );
    }
    
    if (isError) {
      // ... error state ...
      return (
        <tr className="bg-red-50">
          <td colSpan={5} className="text-center py-6 text-red-700 font-medium">
            🚨 Error loading data. Please try refreshing.
          </td>
        </tr>
      );
    }

    if (shops.length === 0) {
      // ... empty state ...
      return (
        <tr className="bg-white">
          <td colSpan={5} className="text-center py-6 text-gray-500">
            No shops found. Click the '+' button to get started.
          </td>
        </tr>
      );
    }

    // Actual data rows: Using text-base for standard table text size
    return shops.map((shop, index) => (
      <motion.tr 
        key={shop._id} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={index % 2 === 0 ? "bg-white hover:bg-gray-50 transition duration-150" : "bg-gray-50 hover:bg-white transition duration-150"}
      >
        {/* Shop Name: font-semibold, text-gray-800 - OK */}
        <td className="p-3 font-semibold text-base text-gray-800">{shop.name}</td>
        
        {/* FIX: Address - Updated to text-gray-800 and font-medium */}
        <td className="p-3 text-base text-gray-800 font-medium">{shop.address}</td>
        
        {/* Phone: text-indigo-600, font-medium (as a link) - OK */}
        <td className="p-3 text-base text-indigo-600 font-medium">{shop.phone}</td>
        
        {/* FIX: FSSAI - Updated to text-gray-800 and font-medium */}
        <td className="p-3 text-base text-gray-800 font-medium">{shop.fssai}</td>
        
        {/* Actions - OK */}
        <td className="p-3 space-x-3 whitespace-nowrap text-center">
          <button
            onClick={() => openEditModal(shop)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-md text-sm transition duration-150"
            title="Edit Shop Details"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => handleDeleteShop(shop._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-md text-sm transition duration-150"
            title="Delete Shop"
          >
            🗑️ Remove
          </button>
        </td>
      </motion.tr>
    ));
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      
      {/* FIX: Reintroducing a centered title block to fill the gap at the top */}
      <div className="text-center mb-10 pt-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Manage Retail Shops</h1>
        <p className="text-lg text-gray-500 mt-1">Add, update, or remove shop details from the system.</p>
      </div>
      
      {/* SHOPS TABLE CARD (Content remains centered and sized) */}
      <div className="bg-white p-6 rounded-xl shadow-2xl overflow-x-auto border border-gray-100 max-w-6xl mx-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-indigo-50 text-indigo-800 uppercase text-base leading-normal shadow-md rounded-lg"> 
              <th className="p-3 text-left rounded-tl-xl">Shop Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">FSSAI No</th>
              <th className="p-3 text-center rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-light divide-y divide-gray-200">
            {tableBodyContent()}
          </tbody>
        </table>
      </div>
      
      {/* FLOATING ADD SHOP BUTTON (FAB) with Tooltip */}
        <div className="fixed bottom-6 right-6 z-40 group flex items-center">
            {/* Tooltip text: Using explicit font size and bold to ensure visibility */}
            <div
                className="
                    bg-gray-800 text-white text-base font-bold py-3 px-4 rounded-lg shadow-xl 
                    mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    pointer-events-none whitespace-nowrap
                "
            >
                Add New Shop
            </div>

            {/* The Floating Action Button */}
            <motion.button
                onClick={openAddModal}
                className="
                    p-4 rounded-full bg-indigo-600 text-white shadow-2xl 
                    hover:bg-indigo-700 transition duration-300 transform hover:scale-110 
                    focus:outline-none focus:ring-4 focus:ring-indigo-300
                "
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                aria-label="Add New Shop"
            >
                {/* The icon provides the 'symbol' */}
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                </svg>
            </motion.button>
        </div>

      {/* MODAL FORM */}
      <AnimatePresence>
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title={editingShop ? 'Edit Shop Details' : 'Add New Shop'}
        >
            <ShopForm 
              initialData={editingShop}
              onSave={handleSaveShop}
              onCancel={closeModal}
            />
        </Modal>
      </AnimatePresence>

      {/* SUCCESS NOTIFICATION */}
      <AnimatePresence>
        {showSuccess && <SuccessNotification />}
      </AnimatePresence>

    </div>
  );
}