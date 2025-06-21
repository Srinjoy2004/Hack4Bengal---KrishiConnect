
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-agri-900 text-white">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
  {/* Circular logo container with image inside */}
  <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
    <img
      src="src\Images\KrishiConnect Logo.png" 
      alt="KrishiConnect Logo"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Brand Name */}
  <span className="text-2xl font-bold text-white">KrishiConnect</span>
</Link>
            <p className="text-gray-300 mb-6">
              Empowering farmers with cutting-edge technology for sustainable and profitable agriculture.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transform hover:scale-110 transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transform hover:scale-110 transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transform hover:scale-110 transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transform hover:scale-110 transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features/soil-analysis" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Soil Analysis & Recommendations
                </Link>
              </li>
              <li>
                <Link to="/features/disease-prediction" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Disease Prediction & Prevention
                </Link>
              </li>
              <li>
                <Link to="/features/chatbot" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  AI Chatbot Assistant
                </Link>
              </li>
              <li>
                <Link to="/features/weather" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Weather Forecasting
                </Link>
              </li>
              <li>
                <Link to="/features/community" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Farmer Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-agri-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-300">
                  123 Agriculture Way, Farming District, New Delhi, 110001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-agri-400 flex-shrink-0" size={18} />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white">
                  +91 9876 543 210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-agri-400 flex-shrink-0" size={18} />
                <a href="mailto:info@KrishiConnect.com" className="text-gray-300 hover:text-white">
                  info@KrishiConnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} The Debuggers. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
