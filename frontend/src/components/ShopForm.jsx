import { useState, useEffect } from "react";

/**
 * Form component for adding or editing a shop.
 * * @param {object} props
 * @param {object | null} props.initialData - The shop object to edit, or null for a new shop.
 * @param {function} props.onSave - Function to call on successful submission (passed new/updated shop data).
 * @param {function} props.onCancel - Function to call when the user cancels.
 */
export default function ShopForm({ initialData, onSave, onCancel }) {
  // Initialize state from initialData (for editing) or empty strings (for adding)
  const [name, setName] = useState(initialData?.name || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [fssai, setFssai] = useState(initialData?.fssai || "");
  const [phone, setPhone] = useState(initialData?.phone || "");

  // Optional: Update local state if initialData changes (e.g., when switching between edit modes)
  useEffect(() => {
    setName(initialData?.name || "");
    setAddress(initialData?.address || "");
    setFssai(initialData?.fssai || "");
    setPhone(initialData?.phone || "");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !fssai || !phone) {
      alert("Please fill all shop details.");
      return;
    }
    
    // Call the parent handler with the form data
    onSave({ name, address, fssai, phone });

    // Note: Clearing state here is optional, as the parent component typically closes the modal,
    // which unmounts this component, resetting the state.
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" 
        placeholder="Shop Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" 
        required 
      />

      <input 
        type="text" 
        placeholder="Address" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)}
        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" 
        required 
      />

      <input 
        type="text" 
        placeholder="FSSAI License Number" 
        value={fssai} 
        onChange={(e) => setFssai(e.target.value)}
        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" 
        required 
      />

      <input 
        type="tel" 
        placeholder="Phone Number" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}
        className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" 
        required 
      />

      <div className="flex justify-end gap-3 mt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          {isEditing ? 'Save Changes' : 'Add Shop'}
        </button>
      </div>
    </form>
  );
}