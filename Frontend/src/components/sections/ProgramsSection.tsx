
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const programs = [
  {
    id: 1,
    title: "Soil Health Camps",
    description: "Free soil testing and analysis sessions conducted across rural communities to help farmers understand their soil composition and get personalized recommendations.",
    date: "Monthly",
    location: "Multiple Locations",
    participants: "500+ per month",
    imageUrl: "src/Images/istockphoto-1360520451-612x612.jpg"
  },
  {
    id: 2,
    title: "Tech-Enabled Farming Workshops",
    description: "Hands-on training sessions on using technology for farming operations, from basic smartphone usage to advanced sensor systems and data interpretation.",
    date: "Bi-weekly",
    location: "Regional Centers",
    participants: "300+ per session",
    imageUrl: "src/Images/istockphoto-1386152719-612x612.jpg"
  },
  {
    id: 3,
    title: "Crop Diversification Programs",
    description: "Educational programs to help farmers diversify their crops for better economic stability and soil health, featuring experts in different crop varieties.",
    date: "Seasonal",
    location: "Agricultural Universities",
    participants: "1000+ per season",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Youth in Agriculture Initiative",
    description: "Programs specifically designed to encourage and equip the next generation of farmers with modern agricultural techniques and business management skills.",
    date: "Quarterly",
    location: "Schools & Colleges",
    participants: "750+ per quarter",
    imageUrl: "src/Images/image_750x500_657ad9e35f2bc.jpg"
  }
];

export default function ProgramsSection() {
  const [activeProgram, setActiveProgram] = useState(programs[0]);

  return (
    <section  id="programs"   className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Agricultural Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We conduct various programs to educate and support farmers across India, helping them adopt modern techniques and sustainable practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Program List */}
          <div className="lg:col-span-1 space-y-4">
            {programs.map((program) => (
              <motion.div
                key={program.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  activeProgram.id === program.id
                    ? "bg-agri-50 border-l-4 border-agri-500 shadow-md"
                    : "bg-white border border-gray-100 hover:bg-gray-50"
                }`}
                onClick={() => setActiveProgram(program)}
                whileHover={{ x: activeProgram.id === program.id ? 0 : 5 }}
              >
                <h3 className={`font-semibold text-lg ${
                  activeProgram.id === program.id ? "text-agri-700" : "text-gray-800"
                }`}>
                  {program.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Program Details */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden"
            key={activeProgram.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-64 w-full">
              <img 
                src={activeProgram.imageUrl} 
                alt={activeProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">{activeProgram.title}</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">{activeProgram.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="text-agri-500 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Frequency</p>
                    <p className="text-sm text-gray-600">{activeProgram.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-agri-500 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{activeProgram.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-agri-500 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Participants</p>
                    <p className="text-sm text-gray-600">{activeProgram.participants}</p>
                  </div>
                </div>
              </div>

              <div className="bg-agri-50 p-4 rounded-lg flex items-start gap-3 mb-6">
                <Award className="text-agri-500 h-5 w-5 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-agri-800">Program Achievements</p>
                  <p className="text-sm text-gray-700 mt-1">
                    This program has successfully helped over 10,000 farmers improve their agricultural practices, resulting in an average 30% increase in crop yield and 25% reduction in resource waste.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" className="border-agri-500 text-agri-700 hover:bg-agri-50">
                  View Schedule
                </Button>
                <Button className="bg-agri-500 hover:bg-agri-600 text-white">
                  Register Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
