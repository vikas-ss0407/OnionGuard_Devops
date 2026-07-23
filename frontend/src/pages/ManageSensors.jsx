import { useState } from "react";
import { fetchAndSaveLatest, getSensorData } from "../api/thingspeak";

export default function ManageSensors() {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const LDR_THRESHOLD = 2000;

  const handleSensorClick = async () => {
    const sensorId = "sensor1";
    setSelectedSensor(sensorId);
    setIsLoading(true);

    try {
      // 🚀 OPTIMIZATION: Use Promise.all to fetch and save data concurrently.
      const [_, historyData] = await Promise.all([
        fetchAndSaveLatest(sensorId),
        getSensorData(sensorId),
      ]);

      // 2. Data transformation: Convert string fields to numbers
      const formattedData = historyData.map(item => ({
        ...item,
        temperature: Number(item.temperature), 
        humidity: Number(item.humidity),       
        ldrValue: Number(item.ldrValue),         
      })).reverse(); // Reverse to show latest readings at the top

      setSensorData(formattedData);

    } catch (err) {
      console.error("Error fetching sensor data:", err);
      // Set error message for display
      setSensorData([{ error: "Failed to load data. Check console for details." }]); 
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Utility component to display a styled badge for Light/Dark status
  const LightStatusBadge = ({ ldrValue }) => {
    if (typeof ldrValue !== 'number' || isNaN(ldrValue)) return <span className="text-gray-500">---</span>;

    const isLight = ldrValue < LDR_THRESHOLD;
    const text = isLight ? "LIGHT" : "DARK";
    // DARK color uses a darker background (bg-gray-700) and white text (text-white)
    const color = isLight ? "bg-yellow-100 text-yellow-700" : "bg-gray-700 text-white";

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color} whitespace-nowrap`}>
        {text}
      </span>
    );
  };

  // Determine content for the table body based on state
  const tableBodyContent = () => {
    if (isLoading) {
      return (
        <tr className="bg-gray-50">
          <td colSpan={5} className="text-center py-4 text-indigo-600">
            <div className="flex justify-center items-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-indigo-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching data from database...
            </div>
          </td>
        </tr>
      );
    }

    if (sensorData.length > 0 && sensorData[0].error) {
      return (
        <tr className="bg-red-50">
          <td colSpan={5} className="text-center py-4 text-red-700 font-medium">
            Error: {sensorData[0].error}
          </td>
        </tr>
      );
    }
    
    if (sensorData.length === 0 && selectedSensor) {
      return (
        <tr className="bg-gray-50">
          <td colSpan={5} className="text-center py-4 text-gray-500">
            No readings found for {selectedSensor}.
          </td>
        </tr>
      );
    }
    
    // Actual data rows
    return sensorData.map((item, index) => (
      <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-indigo-50" : "bg-gray-50 hover:bg-indigo-50"}>
        {/* Timestamp: text-gray-900, font-medium */}
        <td className="border-r border-gray-200 px-4 py-2 text-sm text-gray-900 font-medium">
          {new Date(item.createdAt).toLocaleString()}
        </td>
        <td className="border-r border-gray-200 px-4 py-2 text-center font-medium text-gray-800">
          {/* Safety check for rendering */}
          {typeof item.temperature === 'number' && !isNaN(item.temperature) ? item.temperature.toFixed(1) : '---'}
        </td>
        <td className="border-r border-gray-200 px-4 py-2 text-center font-medium text-gray-800">
          {/* Safety check for rendering */}
          {typeof item.humidity === 'number' && !isNaN(item.humidity) ? item.humidity.toFixed(0) : '---'}
        </td>
        {/* FIX: LDR Value is now text-gray-900 AND font-medium */}
        <td className="border-r border-gray-200 px-4 py-2 text-center text-sm text-gray-900 font-medium">
          {item.ldrValue}
        </td>
        <td className="px-4 py-2 text-center">
          <LightStatusBadge ldrValue={item.ldrValue} />
        </td>
      </tr>
    ));
  };


  return (
    // Main container now uses indigo background and vertical padding only (pt-10 pb-10)
    <div className="min-h-screen bg-indigo-50 pt-10 pb-10">
      
      {/* Content wrapper: Adds back necessary padding to the text/button content. */}
      <div className="px-6 md:px-10">
      
        {/* MAIN TITLE - Simplified and centered */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Sensor Management Console</h1>
          <p className="text-lg text-gray-500 mt-2">View real-time and historical data for connected sensors.</p>
        </div>

        {/* SENSOR BUTTONS - Only one left, now the main call to action */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleSensorClick}
            className={`
              px-10 py-4 rounded-xl text-xl font-bold shadow-xl transition duration-300 transform 
              ${selectedSensor === 'sensor1' 
                ? 'bg-indigo-600 text-white shadow-indigo-400/70 scale-105 ring-4 ring-indigo-300'
                : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md hover:scale-105'
              }
            `}
            disabled={isLoading}
          >
            {isLoading && selectedSensor === 'sensor1' ? (
                <span className="flex items-center">
                    <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Data...
                </span>
            ) : (
                selectedSensor === 'sensor1' ? 'Sensor 1 Data Loaded' : 'Load Sensor 1 Data'
            )}
          </button>
        </div>
      
      </div> {/* End of content wrapper with padding */}


      {/* SENSOR DATA TABLE - Show only if selectedSensor is set */}
      {selectedSensor && (
        // Table container is full-width (max-w-full) for a seamless look.
        <div className="max-w-full mx-auto bg-white p-6 shadow-2xl border-y border-gray-100">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
            Historical Readings for {selectedSensor}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-50 text-indigo-800 uppercase text-sm leading-normal shadow-sm">
                  <th className="px-4 py-3 text-left font-bold border-r border-indigo-200">Timestamp</th>
                  <th className="px-4 py-3 text-center font-bold border-r border-indigo-200">Temp. (°C)</th>
                  <th className="px-4 py-3 text-center font-bold border-r border-indigo-200">Humidity (%)</th>
                  <th className="px-4 py-3 text-center font-bold border-r border-indigo-200">LDR Value (Raw)</th>
                  <th className="px-4 py-3 text-center font-bold">Light Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {tableBodyContent()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}