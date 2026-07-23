import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAndSaveLatest, getSensorData } from "../api/thingspeak";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Brush,
    ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// --- Utility Components (StatCard - Adjusted for BIG Color Change) ---
const StatCard = ({ title, value, unit, status = null, statusColorClass = null, bgColorClass = null, rawValue = null, icon }) => (
    <motion.div
        // 💡 MAJOR CHANGE: Replaced fixed 'bg-white' and 'border-t-4' with dynamic bgColorClass.
        // Also added dynamic text color via bgColorClass for better contrast.
        className={`${bgColorClass || 'bg-white border-t-4 border-indigo-500'} p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center justify-between mb-2">
            {/* 💡 CHANGE: Use white text for status card titles, except for yellow background */}
            <p className={`text-sm font-medium uppercase ${bgColorClass && bgColorClass !== 'bg-yellow-500' ? 'text-indigo-100' : 'text-gray-500'}`}>{title}</p>
            {/* 💡 CHANGE: Use white/dark color for icon */}
            <div className={`text-2xl ${bgColorClass && bgColorClass !== 'bg-yellow-500' ? 'text-white' : 'text-indigo-600'}`}>{icon}</div>
        </div>

        <div className="flex items-baseline justify-between mt-3">
            {/* Fallback to '---' if value is null */}
            {/* 💡 CHANGE: Use white/dark color for large value */}
            <p className={`text-4xl font-extrabold leading-none ${bgColorClass && bgColorClass !== 'bg-yellow-500' ? 'text-white' : 'text-gray-900'}`}>
                {value === null ? '---' : value}
                <span className={`text-xl font-medium ml-1 ${bgColorClass && bgColorClass !== 'bg-yellow-500' ? 'text-indigo-200' : 'text-gray-600'}`}>{unit}</span>
            </p>

            {status && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColorClass} whitespace-nowrap`}>
                    {status}
                </span>
            )}
        </div>
        {/* 💡 CHANGE: Use white/dark color for raw value */}
        {rawValue && <p className={`mt-2 text-xs ${bgColorClass && bgColorClass !== 'bg-yellow-500' ? 'text-indigo-200' : 'text-gray-400'}`}>Raw: {rawValue}</p>}
    </motion.div>
);

// --- Mini-Graph Component (No Change) ---
const MiniGraphCard = ({ graph, history, onClick }) => {
    // Check if history has enough points to draw a line
    const hasHistory = history && history.length > 1;

    return (
        <motion.div
            className="p-4 rounded-xl shadow-md border border-gray-200 cursor-pointer transition-all duration-300 bg-white hover:border-indigo-500 hover:shadow-lg flex flex-col"
            whileHover={{ scale: 1.02 }}
            onClick={() => onClick(graph.key)}
        >
            <h3 className="text-lg font-bold mb-2 flex items-center text-gray-700">
                <span className="mr-2 text-xl">{graph.icon}</span> {graph.label.split('(')[0].trim()}
            </h3>

            <div className="flex-grow w-full h-[100px] mt-2">
                {hasHistory ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                            <XAxis dataKey="createdAt" hide />
                            <YAxis hide />
                            <Line
                                type="monotone"
                                dataKey={graph.key}
                                stroke={graph.color}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        <div className="animate-pulse">Fetching history...</div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};


// --- Detailed Graph Content Component (No Change) ---
const DetailedGraphContent = ({ graph, history }) => (
    <div className="w-full h-[400px]">
        <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <span className="text-3xl mr-2">{graph.icon}</span> Detailed History: {graph.label}
        </h3>
        <ResponsiveContainer width="100%" height="90%">
            <LineChart data={history} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                    dataKey="createdAt"
                    tickFormatter={(time) => new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    interval="preserveStartEnd"
                    minTickGap={20}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#6b7280' }}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#6b7280' }} />
                <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px' }}
                    labelFormatter={(time) => new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                    formatter={(value) => [`${value} ${graph.key === 'temperature' ? '°C' : (graph.key === 'humidity' ? '%' : '')}`, graph.label.split('(')[0].trim()]}
                />
                <Line
                    type="monotone"
                    dataKey={graph.key}
                    stroke={graph.color}
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                />
                <Brush
                    dataKey="createdAt"
                    height={30}
                    stroke={graph.color}
                    travellerWidth={10}
                    tickFormatter={(time) => new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    startIndex={Math.max(history.length - 5, 0)}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);


// --- Modal Component (No Change) ---
const Modal = ({ isOpen, onClose, children }) => {
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
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


// --- Main Dashboard Component ---

export default function Dashboard() {
    const navigate = useNavigate();
    // Initialize data and history to null/empty array to prevent rendering errors
    const [data, setData] = useState(null);
    const [history, setHistory] = useState([]);
    const [sensorOn, setSensorOn] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalGraphKey, setModalGraphKey] = useState(null);

    const LDR_THRESHOLD = 2000;
    const SENSOR_ID = "sensor1";
    const MAX_READINGS = 5;

    // --- Data Fetching Logic (Unchanged) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const latestData = await fetchAndSaveLatest(SENSOR_ID);
                setSensorOn(latestData?.isSensorOn ?? false);
                const sensorData = await getSensorData(SENSOR_ID);

                if (sensorData && sensorData.length > 0) {
                    const lastReadings = sensorData.slice(-MAX_READINGS);
                    const latest = lastReadings[lastReadings.length - 1];

                    const formatted = {
                        createdAt: new Date(latest.createdAt).getTime(),
                        temperature: Number(latest.temperature),
                        humidity: Number(latest.humidity),
                        ldrValue: Number(latest.ldrValue),
                    };
                    setData(formatted);

                    const historyData = lastReadings.map((item) => ({
                        createdAt: new Date(item.createdAt).getTime(),
                        temperature: Number(item.temperature),
                        humidity: Number(item.humidity),
                        ldrValue: Number(item.ldrValue),
                    }));
                    setHistory(historyData);
                }
            } catch (err) {
                console.error("Error fetching sensor data:", err);
                setSensorOn(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 20000);
        return () => clearInterval(interval);
    }, []);
    // --- END Data Fetching Logic ---

    // Graphs Configuration
    const graphs = [
        { key: "temperature", label: "Temperature (°C)", color: "#ef4444", icon: "🌡️" },
        { key: "humidity", label: "Humidity (%)", color: "#3b82f6", icon: "💧" },
        { key: "ldrValue", label: "Light Level (LDR)", color: "#f59e0b", icon: "💡" },
    ];

    const currentGraphDetail = graphs.find(g => g.key === modalGraphKey);

    // --- Modal Handlers (No Change) ---
    const openModal = (key) => {
        setModalGraphKey(key);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setModalGraphKey(null);
    };

    // Calculated Statuses for Stat Cards (No Change)
    const tempValue = data?.temperature;
    const tempStatus = tempValue > 30 ? "HOT" : (tempValue < 10 ? "COLD" : "NORMAL");
    const tempStatusColor = tempValue > 30 ? "bg-red-100 text-red-700" : (tempValue < 10 ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700");

    const humValue = data?.humidity;
    const humStatus = humValue > 80 ? "HIGH" : (humValue < 40 ? "LOW" : "OPTIMAL");
    const humStatusColor = humValue > 80 ? "bg-red-100 text-red-700" : (humValue < 40 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700");

    const lightStatus = data?.ldrValue !== null && data?.ldrValue !== undefined ? (data.ldrValue < LDR_THRESHOLD ? "LIGHT" : "DARK") : "---";
    const lightStatusColor = lightStatus === "LIGHT" ? "bg-yellow-100 text-yellow-700" : (lightStatus === "DARK" ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-400");

    const fanStatus = data?.temperature > 30 ? "ON" : "OFF";
    const fanStatusColor = fanStatus === "ON" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700";

    // 💡 NEW LOGIC: Dynamic background color for the System Status card
    const systemStatusBgColor = sensorOn
        ? (data ? "bg-green-600" : "bg-yellow-500") // Online: Green for data, Yellow for fetching
        : "bg-red-600"; // Offline: Red

    // The text color will be controlled inside StatCard based on this background

    return (
        <div className="min-h-screen bg-indigo-50 pb-10 px-4 md:px-10">

            {/* Navigation Buttons */}
            <motion.div
                className="flex flex-wrap justify-center gap-4 mt-8 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <button onClick={() => navigate("/manage-sensors")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition duration-300">⚙️ Manage Sensors</button>
                <button onClick={() => navigate("/manage-shops")} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition duration-300">🏪 Manage Shops</button>
                <button onClick={() => navigate("/manage-boxes")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition duration-300">📦 Manage Boxes</button>
                <button onClick={() => navigate("/billing")} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition duration-300">💵 Billing</button>
            </motion.div>

            <>
                {/* Live Readings - Stat Cards */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2">Live Readings & Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                        {/* 💡 SYSTEM STATUS CARD WITH BIG COLOR CHANGE */}
                        <StatCard
                            title="System Status"
                            value={sensorOn ? "ONLINE" : "OFFLINE"}
                            unit={null}
                            status={sensorOn ? (data ? "Data Received" : "Fetching Data") : "No Signal"}
                            // Status tag color remains light for visibility
                            statusColorClass={sensorOn ? (data ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700") : "bg-red-100 text-red-700"}
                            // 💡 PASSED DYNAMIC FULL BACKGROUND COLOR
                            bgColorClass={systemStatusBgColor}
                            icon="🟢"
                        />
                        <StatCard
                            title="Temperature"
                            value={data?.temperature !== null && data?.temperature !== undefined ? data.temperature.toFixed(1) : null}
                            unit="°C"
                            status={data ? tempStatus : "Loading..."}
                            statusColorClass={data ? tempStatusColor : "bg-gray-100 text-gray-400"}
                            icon="🌡️"
                        />
                        <StatCard
                            title="Humidity"
                            value={data?.humidity !== null && data?.humidity !== undefined ? data.humidity.toFixed(0) : null}
                            unit="%"
                            status={data ? humStatus : "Loading..."}
                            statusColorClass={data ? humStatusColor : "bg-gray-100 text-gray-400"}
                            icon="💧"
                        />
                        <StatCard
                            title="Light Level"
                            value={lightStatus}
                            unit={null}
                            status={lightStatus}
                            statusColorClass={lightStatusColor}
                            rawValue={data?.ldrValue}
                            icon="💡"
                        />
                        <StatCard
                            title="Cooling Fan"
                            value={data ? fanStatus : "---"}
                            unit={null}
                            status={data ? fanStatus : "Loading..."}
                            statusColorClass={data ? fanStatusColor : "bg-gray-100 text-gray-400"}
                            icon="🌀"
                        />
                    </div>
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Last updated: <strong className="font-semibold text-gray-700">
                            {data?.createdAt ? new Date(data.createdAt).toLocaleString() : 'Waiting for data...'}
                        </strong>
                    </p>
                </div>

                {/* Graphs Section: Overview */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2">Reading History Overview (Click for Detail)</h2>

                    {/* Mini-Graph Overview Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {graphs.map((graph) => (
                            <MiniGraphCard
                                key={graph.key}
                                graph={graph}
                                history={history}
                                onClick={openModal}
                            />
                        ))}
                    </div>
                </div>
            </>

            {/* MODAL COMPONENT */}
            <AnimatePresence>
                {isModalOpen && currentGraphDetail && (
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <DetailedGraphContent
                            graph={currentGraphDetail}
                            history={history}
                        />
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}