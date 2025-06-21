
import { useState } from "react";
import { motion } from "framer-motion";

// Map of India with states
const states = [
  { id: "AP", name: "Andhra Pradesh", active: true, position: { x: 55, y: 65 } },
  { id: "AR", name: "Arunachal Pradesh", active: false, position: { x: 88, y: 25 } },
  { id: "AS", name: "Assam", active: true, position: { x: 85, y: 32 } },
  { id: "BR", name: "Bihar", active: true, position: { x: 68, y: 42 } },
  { id: "CG", name: "Chhattisgarh", active: true, position: { x: 58, y: 55 } },
  { id: "GA", name: "Goa", active: false, position: { x: 35, y: 68 } },
  { id: "GJ", name: "Gujarat", active: true, position: { x: 32, y: 48 } },
  { id: "HR", name: "Haryana", active: true, position: { x: 45, y: 32 } },
  { id: "HP", name: "Himachal Pradesh", active: false, position: { x: 48, y: 25 } },
  { id: "JH", name: "Jharkhand", active: true, position: { x: 68, y: 48 } },
  { id: "KA", name: "Karnataka", active: true, position: { x: 42, y: 72 } },
  { id: "KL", name: "Kerala", active: true, position: { x: 42, y: 85 } },
  { id: "MP", name: "Madhya Pradesh", active: true, position: { x: 50, y: 50 } },
  { id: "MH", name: "Maharashtra", active: true, position: { x: 42, y: 60 } },
  { id: "MN", name: "Manipur", active: false, position: { x: 88, y: 42 } },
  { id: "ML", name: "Meghalaya", active: false, position: { x: 82, y: 38 } },
  { id: "MZ", name: "Mizoram", active: false, position: { x: 90, y: 45 } },
  { id: "NL", name: "Nagaland", active: false, position: { x: 92, y: 38 } },
  { id: "OD", name: "Odisha", active: true, position: { x: 65, y: 58 } },
  { id: "PB", name: "Punjab", active: true, position: { x: 42, y: 28 } },
  { id: "RJ", name: "Rajasthan", active: true, position: { x: 38, y: 38 } },
  { id: "SK", name: "Sikkim", active: false, position: { x: 78, y: 32 } },
  { id: "TN", name: "Tamil Nadu", active: true, position: { x: 48, y: 80 } },
  { id: "TG", name: "Telangana", active: true, position: { x: 52, y: 62 } },
  { id: "TR", name: "Tripura", active: false, position: { x: 85, y: 45 } },
  { id: "UK", name: "Uttarakhand", active: false, position: { x: 52, y: 28 } },
  { id: "UP", name: "Uttar Pradesh", active: true, position: { x: 58, y: 38 } },
  { id: "WB", name: "West Bengal", active: true, position: { x: 75, y: 48 } }
];

export default function MapSection() {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [stateCounts] = useState({
    farmers: {
      "Andhra Pradesh": 5420,
      "Assam": 3218,
      "Bihar": 4876,
      "Chhattisgarh": 3654,
      "Gujarat": 5982,
      "Haryana": 4321,
      "Jharkhand": 2765,
      "Karnataka": 6124,
      "Kerala": 3421,
      "Madhya Pradesh": 5678,
      "Maharashtra": 7421,
      "Odisha": 4321,
      "Punjab": 6543,
      "Rajasthan": 5432,
      "Tamil Nadu": 5876,
      "Telangana": 4567,
      "Uttar Pradesh": 8765,
      "West Bengal": 5432
    },
    hectares: {
      "Andhra Pradesh": 12450,
      "Assam": 8750,
      "Bihar": 11350,
      "Chhattisgarh": 9870,
      "Gujarat": 14650,
      "Haryana": 12540,
      "Jharkhand": 7650,
      "Karnataka": 15432,
      "Kerala": 8970,
      "Madhya Pradesh": 16540,
      "Maharashtra": 18750,
      "Odisha": 10650,
      "Punjab": 14320,
      "Rajasthan": 15670,
      "Tamil Nadu": 13450,
      "Telangana": 11760,
      "Uttar Pradesh": 21540,
      "West Bengal": 13650
    }
  });

  return (
    <section className="py-16 bg-agri-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            KrishiConnect Across India
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform is active across multiple states in India, helping thousands of farmers improve their agricultural practices.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Map visualization */}
          <div className="w-full lg:w-1/2 relative bg-white rounded-xl shadow-lg p-6">
            <div className="relative w-full aspect-[4/5] border-2 border-agri-100 rounded-lg overflow-hidden bg-agri-50">
              {/* India outline - simplified representation */}
              <div className="absolute inset-0 p-4">
                {/* Map points for each state */}
                {states.map((state) => (
                  <motion.div
                    key={state.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                    style={{ left: `${state.position.x}%`, top: `${state.position.y}%` }}
                    whileHover={{ scale: 1.2 }}
                    onMouseEnter={() => state.active && setActiveState(state.name)}
                    onMouseLeave={() => setActiveState(null)}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        state.active
                          ? "bg-agri-500 shadow-lg shadow-agri-400/30"
                          : "bg-gray-300"
                      }`}
                    />
                    {state.active && (
                      <motion.div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-1.5 h-10 origin-top"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3, delay: Math.random() * 0.5 }}
                      >
                        <div className="w-full h-full bg-agri-500/50" />
                      </motion.div>
                    )}
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
                      {state.id}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-agri-500 mr-2"></div>
                  <span>Active States</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* State information */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h3 className="text-2xl font-bold mb-6 text-agri-800">
                {activeState ? activeState : "Our Impact Across States"}
              </h3>

              {activeState && stateCounts.farmers[activeState as keyof typeof stateCounts.farmers] ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-agri-50 p-4 rounded-lg">
                      <h4 className="text-lg text-agri-700 font-semibold">Farmers Connected</h4>
                      <p className="text-3xl font-bold text-agri-600">
                        {stateCounts.farmers[activeState as keyof typeof stateCounts.farmers].toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-agri-50 p-4 rounded-lg">
                      <h4 className="text-lg text-agri-700 font-semibold">Hectares Analyzed</h4>
                      <p className="text-3xl font-bold text-agri-600">
                        {stateCounts.hectares[activeState as keyof typeof stateCounts.hectares].toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    In {activeState}, we're helping farmers optimize their agricultural practices 
                    through soil analysis, weather forecasting, and AI-powered tools tailored to 
                    the specific conditions and crops of the region.
                  </p>
                  <div className="bg-agri-50 p-4 rounded-lg">
                    <h4 className="text-lg text-agri-700 font-semibold mb-2">Primary Crops</h4>
                    <div className="flex flex-wrap gap-2">
                      {generateRandomCrops(activeState).map((crop, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white rounded-full text-agri-700 text-sm border border-agri-200"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">
                    Hover over an active state on the map to see detailed information about our operations and impact in that region.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-agri-50 p-4 rounded-lg">
                      <h4 className="text-lg text-agri-700 font-semibold">Total States Active</h4>
                      <p className="text-3xl font-bold text-agri-600">18</p>
                    </div>
                    <div className="bg-agri-50 p-4 rounded-lg">
                      <h4 className="text-lg text-agri-700 font-semibold">Total Farmers</h4>
                      <p className="text-3xl font-bold text-agri-600">84,765</p>
                    </div>
                    <div className="bg-agri-50 p-4 rounded-lg">
                      <h4 className="text-lg text-agri-700 font-semibold">Hectares Analyzed</h4>
                      <p className="text-3xl font-bold text-agri-600">228,450</p>
                    </div>
                    <div className="bg-agri-50 p-4 rounded-lg">
                      <h4 className="text-lg text-agri-700 font-semibold">Success Rate</h4>
                      <p className="text-3xl font-bold text-agri-600">94%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper function to generate random crops based on state
function generateRandomCrops(state: string) {
  const allCrops = [
    "Rice", "Wheat", "Maize", "Barley", "Jowar", "Bajra", "Ragi", 
    "Cotton", "Jute", "Sugarcane", "Tea", "Coffee", "Rubber",
    "Coconut", "Cashew", "Mango", "Banana", "Orange", "Pineapple",
    "Potato", "Tomato", "Onion", "Cauliflower", "Cabbage", "Brinjal",
    "Chilli", "Turmeric", "Ginger", "Cardamom", "Black Pepper"
  ];
  
  // Instead of fully random, have some state-specific crops
  const stateSpecificCrops: Record<string, string[]> = {
    "Punjab": ["Wheat", "Rice", "Barley", "Sugarcane", "Cotton"],
    "Kerala": ["Coconut", "Rubber", "Tea", "Coffee", "Black Pepper"],
    "Tamil Nadu": ["Rice", "Sugarcane", "Banana", "Coconut", "Tea"],
    "Maharashtra": ["Cotton", "Sugarcane", "Onion", "Jowar", "Soybean"],
    "Gujarat": ["Cotton", "Groundnut", "Dates", "Sugarcane", "Bajra"],
    "Uttar Pradesh": ["Wheat", "Rice", "Sugarcane", "Potato", "Mustard"],
    "West Bengal": ["Rice", "Jute", "Tea", "Potato", "Wheat"],
    "Andhra Pradesh": ["Rice", "Chilli", "Cotton", "Sugarcane", "Tobacco"]
  };
  
  // Return specific crops if available, otherwise random selection
  if (state in stateSpecificCrops) {
    return stateSpecificCrops[state];
  } else {
    // Randomly select 4-5 crops
    const numCrops = 4 + Math.floor(Math.random() * 2);
    const shuffled = [...allCrops].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numCrops);
  }
}
