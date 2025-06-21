import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop"
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div  id="hero"  className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 bg-cover bg-center bg-no-repeat ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden={index !== currentImageIndex}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-agri-900/90 to-agri-700/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="mb-6 bg-agri-500/90 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm animate-fade-in">
          Smart Agriculture Platform
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in text-shadow leading-tight">
          Farming <span className="text-agri-300">Smarter</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-10 animate-fade-in delay-100 text-shadow">
          Transform traditional farming with AI-powered precision agriculture
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
          <Button asChild size="lg" className="bg-agri-500 hover:bg-agri-600 text-white group text-lg py-6 px-8">
            <Link to="/signup" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg py-6 px-8">
            <Link to="/features">Explore Features</Link>
          </Button>
        </div>
        
        {/* Stats Bar */}
        <div className="mt-16 flex justify-center gap-12 md:gap-24 p-4 bg-black/30 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <p className="text-3xl font-bold text-agri-300">10,000+</p>
            <p className="text-white text-sm">Farmers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-agri-300">28%</p>
            <p className="text-white text-sm">Yield Increase</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-agri-300">35+</p>
            <p className="text-white text-sm">Countries</p>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator - Placed at bottom of screen with more space */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-20">
        <a 
          href="#features" 
          className="flex flex-col items-center text-white/80 hover:text-white bg-black/20 rounded-full p-2 backdrop-blur-sm"
          aria-label="Scroll to features section"
        >
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </div>
  );
}
