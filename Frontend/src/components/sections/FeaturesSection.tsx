
import { motion } from "framer-motion";
import { Leaf, CloudSun, MessageSquare, Timer, BarChart2, Users } from "lucide-react";

const features = [
  {
    icon: <Leaf className="h-10 w-10 text-agri-500" />,
    title: "Soil Analysis & Crop Recommendations",
    description:
      "Analyze NPK levels from soil samples to receive tailored recommendations for crops and fertilizers to optimize your yield.",
    link: "/features/soil-analysis"
  },
  {
    icon: <CloudSun className="h-10 w-10 text-agri-500" />,
    title: "Weather Forecasting & Predictions",
    description:
      "Get accurate weather forecasts and real-time soil condition data to make informed decisions for your farming activities.",
    link: "/features/weather"
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-agri-500" />,
    title: "AI-Powered Agricultural Assistant",
    description:
      "Access our intelligent chatbot for instant guidance on farming techniques, crop diseases, and best practices.",
    link: "/features/chatbot"
  },
  {
    icon: <Timer className="h-10 w-10 text-agri-500" />,
    title: "Growth & Income Calculation",
    description:
      "Time series models analyze your soil, weather, and crop data to calculate expected growth and yearly income predictions.",
    link: "/features/growth-calculator"
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-agri-500" />,
    title: "Disease Prediction & Prevention",
    description:
      "Our GenAI technology identifies potential crop diseases before they appear and suggests prevention strategies.",
    link: "/features/disease-prediction"
  },
  {
    icon: <Users className="h-10 w-10 text-agri-500" />,
    title: "Farmer Community",
    description:
      "Connect with other farmers to share knowledge, experiences, and insights for better agricultural practices.",
    link: "/features/community"
  }
];

export default function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-agri-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Our Smart Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            KrishiConnect uses cutting-edge technology to revolutionize farming practices,
            making agriculture more sustainable, profitable, and efficient.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-agri-100 to-agri-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="mb-4 p-3 bg-agri-100 inline-block rounded-lg group-hover:bg-white/80 transition-colors duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-agri-800 transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 group-hover:text-agri-800 transition-colors duration-500">
                  {feature.description}
                </p>
                <a
                  href={feature.link}
                  className="inline-flex items-center text-agri-600 group-hover:text-agri-800 font-medium transition-colors duration-500"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}
