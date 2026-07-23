import { useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PrintBill() {
  const { state } = useLocation();
  const { bill, user } = state || {};

  if (!bill || !user) return <p>No bill to display.</p>;

  const handlePrint = () => window.print();

  // Helper function for formatting currency
  const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

  return (
    <>
      {/* Print-specific styles: hide everything except #print-area when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          /* Ensure print area spans full width for a professional look */
          #print-area { position: absolute; left: 0; top: 0; width: 100%; max-width: none; margin: 0; padding: 0; box-shadow: none;} 
          #print-area .inner-border { border: none !important; } /* Remove border for cleaner printout */
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
        }
        /* Improve table look for screen as well with subtle separation */
        #print-area .bill-table th, #print-area .bill-table td {
          padding: 12px 10px;
          text-align: left;
          border: none;
        }
        #print-area .bill-table th {
          background-color: #f3f4f6; /* Light gray background for headers */
          font-weight: 600;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
        }
        #print-area .bill-table tbody tr:nth-child(even) {
          background-color: #f9fafb; /* Zeebra striping for readability */
        }
      `}</style>

      <div id="print-area" className="p-8 max-w-4xl mx-auto bg-white shadow-xl min-h-[800px]">
        <div className="inner-border border border-gray-300 p-8">
          
          {/* Header and Invoice Title */}
          <header className="flex items-end justify-between border-b border-gray-300 pb-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-green-700 tracking-wider">ONIONGUARD</h1>
                <p className="text-sm text-gray-500 mt-1">Reliable storage monitoring & inventory tracking</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-5xl font-extrabold text-gray-800 uppercase">INVOICE</h2>
              <div className="text-base text-gray-600 font-medium">#INV-{bill.boxNumber}</div>
            </div>
          </header>

          {/* Date and Bill/Customer Info Block */}
          <div className="flex justify-between mb-10 text-sm">
            
            {/* From (Seller) Block */}
            <div className="w-1/3 pr-4">
              <div className="uppercase text-xs font-semibold text-gray-500 mb-1 border-b pb-1">Billed From (Seller)</div>
              <div className="font-bold text-gray-800">{user.name}</div>
              <div className="text-gray-600">{user.address}</div>
            </div>

            {/* To (Buyer) Block */}
            <div className="w-1/3 px-4">
              <div className="uppercase text-xs font-semibold text-gray-500 mb-1 border-b pb-1">Billed To (Buyer)</div>
              <div className="font-bold text-gray-800">{bill.shopName}</div>
              <div className="text-gray-600">{bill.shopAddress}</div>
              <div className="text-gray-700 mt-2"><strong>FSSAI:</strong> {bill.fssaiNumber}</div>
            </div>

            {/* Invoice Details Block */}
            <div className="w-1/3 pl-4 text-right">
              <div className="uppercase text-xs font-semibold text-gray-500 mb-1 border-b pb-1">Invoice Details</div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-700">Invoice Date:</span>
                <span className="text-gray-800 font-semibold">{new Date(bill.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-gray-700">Time:</span>
                <span className="text-gray-800">{new Date(bill.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse mb-8 bill-table shadow-sm">
            <thead>
              <tr>
                <th className="rounded-tl-lg">Box Number</th>
                <th>Type</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Selling Price (per unit)</th>
                <th className="text-right rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">{bill.boxNumber}</td>
                <td>{bill.type}</td>
                <td className="text-right">{bill.quantity}</td>
                <td className="text-right">{formatCurrency(bill.sellingPrice)}</td>
                <td className="text-right font-bold text-lg text-green-700">{formatCurrency(bill.total)}</td>
              </tr>
              {/* You'd typically map over an array of items here. Keeping it to one row for structure consistency with original code. */}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end mb-10">
            <div className="w-1/2">
                <div className="border-t border-b border-gray-300 py-3 mb-2 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
                    <span className="text-lg font-semibold text-gray-800">{formatCurrency(bill.total)}</span>
                </div>
                {/* Add any tax/discount lines here if applicable */}
                <div className="flex justify-end">
                  <div className="bg-white border border-green-200 p-4 rounded-lg shadow-sm mr-4 flex items-center">
                    <span className="text-sm text-gray-600 mr-3">Amount Due</span>
                    <span className="text-2xl font-extrabold text-green-700">{formatCurrency(bill.total)}</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Footer Notes and Print Button */}
          <div className="text-sm text-gray-600 border-t border-gray-300 pt-6">
            <p className="font-semibold mb-2">Storage Advisory:</p>
            <p className="text-xs">Onions are stored in ventilated, graded bamboo crates with active environmental monitoring (temperature & humidity) to minimize spoilage. Please inspect and handle per local food-safety guidelines.</p>
            <p className="mt-4 italic">This bill is computer generated and does not require a physical signature.</p>

            <div className="flex justify-between items-center mt-8">
                <div className="text-xs text-gray-400">Powered by OnionGuard &copy; {new Date().getFullYear()}</div>
                <div className="text-sm font-medium text-green-700">Thank you for your business!</div>
            </div>
          </div>


          {/* Print Button - Hidden when printing */}
          <div className="mt-8 no-print">
            <button
              onClick={handlePrint}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-lg transition duration-200 shadow-md"
            >
              🖨️ Print Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}