import { useState, useEffect } from "react";

/**
 * Form component for adding or editing a Box.
 * @param {object} props
 * @param {object | null} props.initialData - The box object to edit, or null for a new box.
 * @param {function} props.onSave - Function to call on successful submission.
 * @param {function} props.onCancel - Function to call when the user cancels.
 */
export default function BoxForm({ initialData, onSave, onCancel }) {
  const [boxNumber, setBoxNumber] = useState(initialData?.boxNumber || "");
  const [type, setType] = useState(initialData?.type || "");
  const [quantity, setQuantity] = useState(initialData?.quantity || "");
  const [pricePerKg, setPricePerKg] = useState(initialData?.pricePerKg || "");

  // Update local state when initialData changes (for modal reuse)
  useEffect(() => {
    setBoxNumber(initialData?.boxNumber || "");
    setType(initialData?.type || "");
    setQuantity(initialData?.quantity || "");
    setPricePerKg(initialData?.pricePerKg || "");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boxNumber || !type || !quantity || !pricePerKg) {
      alert("Fill all fields");
      return;
    }

    onSave({
      boxNumber,
      type,
      quantity: Number(quantity),
      pricePerKg: Number(pricePerKg),
    });
  };

  const isEditing = !!initialData;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4" // Main form spacing remains
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Box Number:</label>
        <input
          type="text"
          value={boxNumber}
          onChange={(e) => setBoxNumber(e.target.value)}
          // Stabilized height/padding: h-12 ensures consistent height
          className="h-12 px-3 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          disabled={isEditing} // Prevent editing box number for clarity
        />
        {isEditing && <p className="text-xs text-gray-500 mt-1">Box Number cannot be changed during edit.</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Onion Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          // Stabilized height/padding: h-12 ensures consistent height
          className="h-12 px-3 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
        >
          <option value="">-- Select Onion Type --</option>
          <option value="Bulb Onion">Bulb Onion</option>
          <option value="Shallot Onion">Shallot Onion</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg):</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          // Stabilized height/padding: h-12 ensures consistent height
          className="h-12 px-3 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          min="1"
        />
        <div className="h-4"></div> {/* Add a small, fixed height div for consistent vertical spacing */}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Kg (₹):</label>
        <input
          type="number"
          value={pricePerKg}
          onChange={(e) => setPricePerKg(e.target.value)}
          // Stabilized height/padding: h-12 ensures consistent height
          className="h-12 px-3 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          min="0"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
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
          {isEditing ? 'Save Changes' : 'Add Box'}
        </button>
      </div>
    </form>
  );
}