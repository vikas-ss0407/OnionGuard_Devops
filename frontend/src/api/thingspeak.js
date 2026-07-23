import API_BASE_URL from "./config";

// Fetch all sensor data from DB
export const getSensorData = async (sensorId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/thingspeak/sensor/${sensorId}`, {
      credentials: "include",
    });
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error("Failed to fetch sensor data:", err);
    return [];
  }
};

// Fetch latest from ThingSpeak and save to DB
export const fetchAndSaveLatest = async (sensorId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/thingspeak/fetch/${sensorId}`, {
      credentials: "include",
    });
    const data = await res.json();
    return data; // null if sensor is off
  } catch (err) {
    console.error("Failed to fetch latest ThingSpeak data:", err);
    return null;
  }
};
