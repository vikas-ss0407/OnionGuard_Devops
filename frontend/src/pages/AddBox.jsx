import BoxForm from "../components/BoxForm";
import { createBox } from "../api/boxes";

export default function AddBox() {
  const handleAddBox = async (box) => {
    try {
      const savedBox = await createBox(box);
      if (savedBox && !savedBox.message) {
        // ✅ Success
        window.alert("Box added successfully!");
      } else {
        // ❌ Show actual reason from backend
        window.alert(savedBox.message || "Failed to add box.");
      }
    } catch (err) {
      console.error(err);
      // Show backend error message if available
      window.alert(err?.response?.data?.message || "Failed to add box.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Box</h2>
      <BoxForm onAdd={handleAddBox} showList={false} />
    </div>
  );
}
