import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Thermometer,
  CloudRain,
  Feather,
  CheckCircle,
  BarChart2,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  Layers,
  Cpu,
  Monitor,
} from "lucide-react";

// --- Custom Blue Palette (derived from the provided image) ---
// Approximate shades for the new blue:
const NEW_BLUE_50 = "#e0f2fe"; // Lightest for backgrounds like indigo-50
const NEW_BLUE_100 = "#bfdbfe"; // Lighter for hovers
const NEW_BLUE_200 = "#93c5fd";
const NEW_BLUE_300 = "#60a5fa";
const NEW_BLUE_400 = "#3b82f6";
const NEW_BLUE_500 = "#2563eb"; // Main button/link blue (as in the ThingsDock buttons)
const NEW_BLUE_600 = "#1d4ed8"; // Darker for hover states, active nav links
const NEW_BLUE_700 = "#1e40af"; // Darkest for text/logo, hero background
const NEW_BLUE_800 = "#1e3a8a";
const NEW_BLUE_900 = "#1e3a8a"; // Very dark blue

// Custom Accent Color (now standardized to Dark Blue)
const ACCENT_COLOR_BASE = NEW_BLUE_600; 
const ACCENT_COLOR_HOVER = NEW_BLUE_700;
const ACCENT_TEXT_COLOR = "white"; 

// 🚀 NEW COLOR: Amber/Yellow for the prominent CTA button
const CTA_AMBER_BASE = "#fbbf24"; // Tailwind amber-400
const CTA_AMBER_HOVER = "#f59e0b"; // Tailwind amber-500

// Hero background (Baby Blue)
const HERO_BABY_BLUE = "#e0f7fa"; 

// --- Image Slider Component ---
const DispImages = () => {
  const images = [
    "/images/5.jpg",
    "/images/dis.jpeg",
    "/images/dis.jpg",
    "/images/darkroom.jpg",
    "/images/bamboo box.jpeg",
    "/images/noti.jpg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Updated transition for a more refined 3D flip effect
  const flipVariants = {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 },
  };

  return (
    <motion.div
      // CHANGED: Increased height from h-[400px] to h-[500px]
      className="relative w-full max-w-[600px] h-[500px] flex items-center justify-center bg-white rounded-3xl shadow-2xl overflow-hidden ring-4 transition-all duration-700"
      style={{ borderColor: NEW_BLUE_500 }} // Apply new blue to ring
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={`OnionGuard Image ${currentImageIndex + 1}`}
          variants={flipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-3xl"></div>
    </motion.div>
  );
};

// --- Design Gallery Data ---
const galleryItems = [
  {
    id: 1,
    title: "3D Bamboo Box Model",
    description:
      "The proprietary storage crate design focusing on optimal airflow, and stable stacking for extended onion shelf life.",
    imagePath: "/images/bamboo box.jpeg", // PLACEHOLDER
    icon: Layers,
    color: "text-green-600", // Keep green for this item
  },
  {
    id: 2,
    title: "IoT Hardware Setup",
    description:
      "The sensor and connectivity unit, constantly monitoring environmentals like Temperature, Humidity, and Light (LDR).",
    imagePath: "/images/storage.png", // PLACEHOLDER
    icon: Cpu,
    color: NEW_BLUE_600, 
  },
  {
    id: 3,
    title: "UI Dashboard Prototype",
    description:
      "The digital interface for real-time data visualization, inventory management, automated alerts, and detailed historical reporting.",
    imagePath: "/images/uiproto.png", // PLACEHOLDER
    icon: Monitor,
    color: ACCENT_COLOR_BASE, 
  },
];

// --- Modal Component (Design Gallery) ---
const DesignGalleryModal = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = galleryItems[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + galleryItems.length) % galleryItems.length
    );
  };

  if (!isOpen) return null;

  // Animation variants for the image transition (simple fade/scale)
  const imageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    // Backdrop
    <motion.div
      className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Modal Content */}
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative flex flex-col"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors duration-200 z-10 p-2 rounded-full bg-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6 border-b pb-4">
          {/* Apply custom color to icon if applicable */}
          <currentItem.icon className={`w-8 h-8 mx-auto mb-2`} style={{ color: currentItem.color }} />
          <h2 className="text-3xl font-extrabold text-gray-900">
            {currentItem.title}
          </h2>
          <p className="text-gray-600 text-lg mt-1">
            {currentItem.description}
          </p>
          <p className="text-sm mt-2" style={{ color: NEW_BLUE_500 }}>
            Viewing {currentIndex + 1} of {galleryItems.length}
          </p>
        </div>

        {/* Image Display Area with Controls */}
        <div className="relative flex items-center justify-center min-h-[400px]">
          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-0 z-20 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg ml-2 transition-transform duration-300 hover:scale-110 text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Image (with transition) */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentItem.id}
              src={currentItem.imagePath}
              alt={currentItem.title}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-h-[500px] object-contain rounded-lg shadow-xl border border-gray-200"
            />
          </AnimatePresence>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-0 z-20 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg mr-2 transition-transform duration-300 hover:scale-110 text-gray-700"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Contact modal removed per request (Contact form and trigger handled externally or removed)


// --- Home Component ---
export default function Home() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavSolid, setIsNavSolid] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Contact modal removed — no handlers needed

  const sectionIds = [
    "home","bamboobox","advantage","features","workflow","contact",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sectionIds]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsNavSolid(true);
      } else {
        setIsNavSolid(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const getNavClass = (id) =>
    `relative transition-colors duration-300 font-semibold text-lg py-2.5 px-3 rounded-full ${
      activeSection === id
        ? `font-extrabold text-[${NEW_BLUE_700}]` 
        : isNavSolid
        ? `text-gray-700 hover:text-gray-900` // Solid state colors
        : `text-[${NEW_BLUE_700}] hover:text-[${NEW_BLUE_500}]` // Transparent state colors
    }`;

  // Core Features (unchanged, but now with dark blue background on hover)
  const coreFeatures = [
    {
      title: "IoT Climate Automation",
      description:
        "Sensors constantly monitor temperature and humidity. Automatic exhaust fans engage to maintain optimal conditions, preventing sprouting and black mold.",
      icon: <Thermometer className={`w-8 h-8`} style={{ color: NEW_BLUE_600 }} />, // New blue
      color: `border-[${NEW_BLUE_500}]`, // New blue
    },
    {
      title: "LDR Light Defense System",
      description:
        "The LDR sensor tracks cumulative light exposure. If the set threshold is exceeded, an immediate email alert is triggered to protect against damage.",
      icon: <Zap className="w-8 h-8" style={{ color: ACCENT_COLOR_BASE }} />, // Dark Blue
      color: `border-[${ACCENT_COLOR_BASE}]`, // Dark Blue
    },
    {
      title: "Optimized Bamboo Crates",
      description:
        "Our custom-designed ventilated crates, inspired by ICAR research, ensure superior air circulation, which is critical for extending onion shelf life.",
      icon: <Feather className="w-8 h-8 text-green-600" />,
      color: "border-green-500",
    },
  ];

  // Workflow steps (unchanged)
  const workflowSteps = [
    {
      step: 1,
      title: "Secure Login & Inventory Entry",
      description:
        "Securely access the platform and record key data like onion batch source and 'Box Added Date'.",
    },
    {
      step: 2,
      title: "Real-Time Environment Monitoring",
      description:
        "IoT sensors stream live data (Temp, Humidity, Light) to the cloud and automatically manage the warehouse environment.",
    },
    {
      step: 3,
      title: "Proactive Spoilage Alerts",
      description:
        "Automated email alerts are sent on the 15th, 30th, and 60th day post-storage to ensure timely review and removal of damaged onions.",
    },
    {
      step: 4,
      title: "Detailed Reporting & Billing",
      description:
        "Access comprehensive historical data, inventory summaries, and generate bills for efficient business operations.",
    },
  ];

  // Animation Variants (unchanged)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const textVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } },
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1 },
  };

  return (
    <div className="font-sans relative overflow-x-hidden bg-white text-gray-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isNavSolid
            ? "bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-full mx-auto px-6 lg:px-10 py-6 flex justify-between items-center">
          <div
            className={`text-3xl lg:text-4xl font-black cursor-pointer tracking-wide flex items-center transition-colors duration-300 ${
              isNavSolid
                ? `text-[${NEW_BLUE_700}] hover:text-[${NEW_BLUE_900}]` // Solid state logo color
                : `text-[${NEW_BLUE_700}] hover:text-[${NEW_BLUE_500}]` // Transparent state logo color
            }`}
            onClick={() => scrollToSection("home")}
          >
            <CheckCircle
              className={`w-6 h-6 mr-2 lg:w-8 lg:h-8`}
              style={{ color: NEW_BLUE_700 }}
            />
            OnionGuard
          </div>
          <div className="space-x-1 text-lg font-medium hidden md:flex items-center">
            {sectionIds.map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={getNavClass(id)}
              >
                {/* Ensure correct text */}
                {id === "advantage"
                  ? "Advantage"
                  : id === "bamboobox"
                  ? "Design"
                  : id.charAt(0).toUpperCase() + id.slice(1)}

                {/* 🚀 Sliding Underline (Framer Motion) */}
                {activeSection === id && (
                  <motion.div
                    // Use inline style for dark blue underline
                    className={`absolute bottom-[-0.1px] left-0 right-0 h-0.5 rounded-full`}
                    style={{ backgroundColor: NEW_BLUE_600 }} 
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
            {/* 🎯 FIX: Login Button - Using inline style for solid dark blue */}
            <button
              onClick={() => navigate("/login")}
              className={`px-6 py-2 rounded-full text-lg font-bold shadow-md transition-all duration-300 transform hover:scale-105 ml-4 text-white`}
              style={{ 
                  backgroundColor: NEW_BLUE_500, 
                  '--tw-bg-opacity': isNavSolid ? '1' : '1', // Ensure solid on nav scroll
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NEW_BLUE_600}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = NEW_BLUE_500}
            >
              Login
            </button>
            {/* 🎯 FIX: Sign Up Button - Using inline style for solid dark blue */}
            <button
              onClick={() => navigate("/signup")}
              className={`px-6 py-2 rounded-full text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 text-white`}
              style={{ 
                  backgroundColor: NEW_BLUE_500, 
                  '--tw-bg-opacity': isNavSolid ? '1' : '1',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NEW_BLUE_600}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = NEW_BLUE_500}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

{/* Hero Section */}
      <section
        id="home"
        // Using a balanced vertical space: pt-40 to clear the fixed nav, and min-h-[85vh] for a shorter section
        className="relative pt-40 pb-16 min-h-[85vh] flex items-center overflow-hidden" 
        style={{
          // Solid Baby Blue for the hero section background
          backgroundColor: HERO_BABY_BLUE,
        }}
      >
        <motion.div
          // 🎯 FIX APPLIED HERE: Using a custom very wide max-width (e.g., max-w-[90rem] which is 1440px) 
          // and increased padding (px-8/lg:px-12) to reduce excessive empty space and center the wider content.
          className="max-w-[90rem] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="z-10 text-center md:text-left md:w-1/2 mb-12 md:mb-0 md:pr-10">
            <motion.h1
              // Text color for hero heading is dark blue
              className={`text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight`}
              style={{ color: NEW_BLUE_900 }}
              variants={textVariants}
            >
              Extend Onion{" "}
              <span style={{ color: ACCENT_COLOR_BASE }}>Shelf Life</span>. Maximize
              Profit.
            </motion.h1>
            <motion.p
              className="text-xl mb-10 font-semibold max-w-xl text-gray-600 tracking-tight"
              style={{ fontFamily: 'Inter, Arial, sans-serif' }}
              variants={textVariants}
              transition={{ delay: 0.2 }}
            >
              OnionGuard is your IoT-powered solution for warehouse storage,
              eliminating spoilage risks like black mold, rooting, and sprouting
              through intelligent environmental control.
            </motion.p>
            <motion.div
              className="flex justify-center md:justify-start gap-5 flex-wrap"
              variants={containerVariants}
            >
              <motion.button
                onClick={() => navigate("/signup")}
                // 🎯 FIX: Solid Dark Blue for "Start Free Trial" using inline style
                className={`text-white px-8 py-3 lg:px-10 lg:py-4 rounded-full text-lg font-bold shadow-2xl transition-all duration-300 transform hover:scale-105`}
                style={{ backgroundColor: ACCENT_COLOR_BASE }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = ACCENT_COLOR_HOVER}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ACCENT_COLOR_BASE}
                variants={itemVariants}
              >
                Step Into Smart Storage 🚀
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("workflow")}
                // Secondary button remains transparent with blue border
                className={`bg-transparent hover:bg-[${NEW_BLUE_100}] border-2 px-8 py-3 lg:px-10 lg:py-4 rounded-full text-lg font-bold shadow-2xl transition-all duration-300 transform hover:scale-105`}
                style={{ 
                    borderColor: NEW_BLUE_500,
                    color: NEW_BLUE_600
                }}
                variants={itemVariants}
              >
                How It Works
              </motion.button>
            </motion.div>
          </div>
          <div className="md:w-1/2 flex justify-center z-20 relative p-4">
            <DispImages />
          </div>
        </motion.div>
      </section>

      {/* Design and Engineering Modal Launcher */}
      <section id="bamboobox" className="py-20 bg-gray-100 px-4 lg:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h2
            variants={textVariants}
            className="text-4xl font-extrabold text-gray-900 mb-4"
          >
            Design and Engineering
          </motion.h2>
          <motion.p
            variants={textVariants}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-xl leading-relaxed mb-12 max-w-4xl mx-auto"
          >
            Experience the seamless integration of hardware and software that makes OnionGuard unique. From live demo units to an intuitive UI dashboard, every component is engineered for optimal onion preservation.
          </motion.p>

          <motion.div
            variants={containerVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-4xl mx-auto"
          >
            <motion.button
              onClick={openModal}
              // 🎯 FIX: Solid Dark Blue for "View Design & Prototypes Gallery" using inline style
              className={`text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl transition-all duration-300 transform hover:scale-[1.05] flex items-center justify-center w-full sm:w-auto`}
              style={{ backgroundColor: NEW_BLUE_600 }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = NEW_BLUE_700}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = NEW_BLUE_600}
              variants={itemVariants}
            >
              <Layers className="w-5 h-5 mr-2" />
              View Design & Prototypes Gallery
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Separator */}
      {/* 🚀 CHANGED: border-gray-100 is replaced with a custom blue shade border */}
      <div className={`max-w-7xl mx-auto border-t`} style={{ borderColor: NEW_BLUE_100 }}></div>

      {/* Value Proposition / Advantage Section (unchanged) */}
      <section id="advantage" className="py-24 bg-white px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h2
            variants={textVariants}
            className="text-4xl font-extrabold text-gray-900 mb-4"
          >
            The OnionGuard Advantage: Beyond Cold Storage
          </motion.h2>
          <motion.p
            variants={textVariants}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-xl leading-relaxed mb-16 max-w-4xl mx-auto"
          >
            Traditional storage methods, including patrai or detached leaves,
            lead to high losses. While cold storage reduces loss, its high cost
            and short post-removal shelf-life make it impractical. OnionGuard
            provides an affordable, effective alternative.
          </motion.p>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 text-left"
          >
            <motion.div
              variants={itemVariants}
              className="p-8 bg-red-50 rounded-2xl border-l-4 border-red-500 shadow-lg"
            >
              <h4 className="text-2xl font-bold mb-3 flex items-center text-red-700">
                <CloudRain className="w-6 h-6 mr-2" />
                The Risk: Spoilage
              </h4>
              <p className="text-gray-700">
                High Temperature and Humidity are the primary causes of
                sprouting, rooting, and devastating Black Mold disease, leading
                to major losses for merchants and farmers.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.2 }}
              className="p-8 bg-yellow-50 rounded-2xl border-l-4 border-yellow-500 shadow-lg"
            >
              <h4 className="text-2xl font-bold mb-3 flex items-center text-yellow-700">
                <BarChart2 className="w-6 h-6 mr-2" />
                The Goal: Extended Shelf Life
              </h4>
              <p className="text-gray-700">
                Our system focuses on increasing the storage period and
                drastically reducing the loss percentage, ensuring greater
                profitability and supply stability.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.3 }}
              className={`p-8 bg-[${NEW_BLUE_50}] rounded-2xl border-l-4 shadow-lg`} // New blue for background and border
              style={{ borderColor: NEW_BLUE_500 }}
            >
              <h4
                className={`text-2xl font-bold mb-3 flex items-center`}
                style={{ color: NEW_BLUE_700 }}
              >
                <Lock className="w-6 h-6 mr-2" />
                The Advantage: Cost-Effectiveness
              </h4>
              <p className="text-gray-700">
                Unlike expensive cold storage, OnionGuard offers a low-cost,
                high-impact solution that maintains quality without the
                post-cold-storage damage risk.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Features / Technology Section */}
      <section id="features" className="py-24 px-6"
        // CHANGED: Background to match the light blue theme
        style={{ backgroundColor: NEW_BLUE_50 }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={textVariants}
            className="text-4xl font-extrabold text-gray-900 text-center mb-6"
          >
            Intelligent Storage Technology
          </motion.h2>
          <motion.p
            variants={textVariants}
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-xl leading-relaxed text-center mb-16 max-w-4xl mx-auto"
          >
            Our technology combines robust IoT hardware with a smart monitoring
            platform to create the ideal, controlled environment for onion
            storage.
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="grid gap-12 md:grid-cols-1 lg:grid-cols-3"
          >
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}

                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 15px 30px rgba(0,0,0,0.1)", // Consistent shadow on lift
                  backgroundColor: NEW_BLUE_50, 
                }}
                // 🚀 CHANGED: Removed ring classes, adjusted initial shadow, set explicit border-color
                className={`flex flex-col text-left p-8 bg-white rounded-2xl border-b-4 transition-all duration-300 group`}
                style={{ borderColor: NEW_BLUE_500 }} // Apply the specific NEW_BLUE_500 to the bottom border
              >
                {/* Icon is kept separate from the content container to avoid the number effect */}
                <div className="text-5xl mb-4 p-4 bg-gray-100 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Workflow Section (unchanged) */}
      <section
        id="workflow"
        className="py-24 bg-white px-6 border-t border-gray-100"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={textVariants}
            className="text-4xl font-extrabold text-gray-900 text-center mb-6"
          >
            The OnionGuard Workflow
          </motion.h2>
          <motion.p
            variants={textVariants}
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-xl leading-relaxed text-center mb-16 max-w-4xl mx-auto"
          >
            Follow our four simple steps to minimize spoilage and maximize your
            inventory returns.
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-4 gap-8 text-left"
          >
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 15px 30px rgba(0,0,0,0.1)",
                  backgroundColor: NEW_BLUE_50, // Use the variable directly
                }}
                className={`relative bg-white p-6 rounded-2xl shadow-xl border-t-4 transition-transform duration-300 group`}
                style={{ borderColor: NEW_BLUE_500 }} // Apply new blue to border
              >
                {/* The unique numbered circle for the Workflow section */}
                <div
                  className={`absolute top-0 right-0 -m-3 w-10 h-10 flex items-center justify-center rounded-full text-white font-black text-xl shadow-lg`}
                  style={{ backgroundColor: NEW_BLUE_600 }} // New blue for background
                >
                  {step.step}
                </div>
                <h4
                  className={`text-xl font-bold mb-2 text-gray-900 group-hover:text-transition-colors`}
                  style={{ color: NEW_BLUE_700 }}
                >
                  {step.title}
                </h4>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="mt-16 text-center" variants={textVariants}>
            <motion.button
              onClick={() => navigate("/login")}
              // 🎯 FIX: Solid Dark Blue for "Access Dashboard" using inline style
              className={`text-white px-10 py-4 rounded-full text-lg font-bold shadow-2xl transition-all duration-300 transform hover:scale-105`}
              style={{ backgroundColor: ACCENT_COLOR_BASE }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = ACCENT_COLOR_HOVER}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ACCENT_COLOR_BASE}
            >
              Access Dashboard ➡️
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section (restored without Request button) */}
      <section
        id="contact"
        className={`py-16 text-white text-center px-6`} 
        style={{ backgroundColor: NEW_BLUE_700 }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-3xl mx-auto"
        >
          <motion.h2
            variants={textVariants}
            className="text-4xl font-extrabold mb-4"
          >
            Ready to Reduce Your Loss?
          </motion.h2>
          <motion.p
            variants={textVariants}
            transition={{ delay: 0.1 }}
            className={`text-xl leading-relaxed mb-6`}
            style={{ color: NEW_BLUE_200 }}
          >
            Contact us today to integrate OnionGuard's smart monitoring into your
            warehouse operations.
          </motion.p>

          <motion.div className="mt-8 text-lg space-y-1">
            <motion.p variants={textVariants} style={{ color: NEW_BLUE_300 }}>
              <span className="font-bold">📧</span> support@onionguard.com
            </motion.p>
            <motion.p variants={textVariants} style={{ color: NEW_BLUE_300 }}>
              <span className="font-bold">📞</span> +91 98765 43210
            </motion.p>
            <motion.p
              variants={textVariants}
              className={`mt-4 text-sm`}
              style={{ color: NEW_BLUE_400 }}
            >
              © 2025 OnionGuard | Developed by Vikas S S
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Modals are rendered outside the main flow */}
      <AnimatePresence>
        {isModalOpen && (
          <DesignGalleryModal isOpen={isModalOpen} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
}