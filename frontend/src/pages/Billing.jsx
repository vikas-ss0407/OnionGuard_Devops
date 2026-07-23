import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBoxes } from "../api/boxes";
import { getShops } from "../api/shops";
import { createBill } from "../api/bills";
import BillingForm from "../components/BillingForm";

export default function Billing() {
  const [boxes, setBoxes] = useState([]);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoxes();
    fetchShops();
  }, []);

  const fetchBoxes = async () => {
    const data = await getBoxes();
    setBoxes(data);
  };

  const fetchShops = async () => {
    const data = await getShops();
    setShops(data);
  };

  const handleAddBill = async (billData) => {
    const response = await createBill(billData);
    if (response) {
      const { bill, user } = response;
      navigate("/print-bill", { state: { bill, user } });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-2">Generate Bill</h2>

      {/* Form Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Bill Details</h3>
        <BillingForm boxes={boxes} shops={shops} onAddBill={handleAddBill} />
      </div>

      {/* Preview is handled inside the BillingForm component to avoid duplication. */}
    </div>
  );
}
