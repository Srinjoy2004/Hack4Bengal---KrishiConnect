import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "mr", name: "मराठी (Marathi)" },
];

// List of navigation items with their corresponding section IDs
const navItems = [
  { name: "Home", path: "/hero", sectionId: "hero" },
  { name: "Features", path: "/features", sectionId: "features" },
  { name: "About", path: "/about", sectionId: "about" },
  { name: "Programs", path: "/programs", sectionId: "programs" },
  { name: "Contact", path: "/contact", sectionId: "contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [activeSection, setActiveSection] = useState("home");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Close mobile menu if open
      setIsMenuOpen(false);
      
      // Smooth scroll to the section
      section.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Function to handle navigation link clicks
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      // Find the current section in view
      for (const item of navItems) {
        const section = document.getElementById(item.sectionId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(item.sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
  <a 
    href="#home" 
    className="flex items-center gap-2"
    onClick={(e) => handleNavClick(e, "home")}
  >
    {/* Logo Image */}
    <img 
      src="src\Images\KrishiConnect Logo.png" 
      alt="KrishiConnect Logo" 
      className="w-10 h-10 object-contain"
    />
    
    {/* App Name */}
    <span className="text-2xl font-bold gradient-text">KrishiConnect</span>
  </a>
</div>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <a
                key={item.sectionId}
                href={`#${item.sectionId}`}
                onClick={(e) => handleNavClick(e, item.sectionId)}
                className={`text-gray-700 hover:text-agri-600 transition-colors px-3 py-2 text-sm font-medium ${
                  activeSection === item.sectionId ? "text-agri-600 border-b-2 border-agri-500" : ""
                }`}
              >
                {item.name}
              </a>
            ))}
            
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-agri-600 transition-colors px-3 py-2 text-sm font-medium">
                <Globe className="h-4 w-4" />
                <span>{currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang)}
                    className="cursor-pointer hover:bg-agri-50"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" size="sm" className="border-agri-500 text-agri-700 hover:bg-agri-50">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-agri-500 hover:bg-agri-600 text-white">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switcher (Mobile) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2">
                <Globe className="h-5 w-5 text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang)}
                    className="cursor-pointer hover:bg-agri-50"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Auth Button (Mobile) */}
            <Button asChild size="icon" variant="ghost">
              <Link to="/login">
                <User className="h-5 w-5 text-gray-700" />
              </Link>
            </Button>
            
            {/* Menu Toggle */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-agri-600 hover:bg-agri-50 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-in-bottom">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.sectionId}
                href={`#${item.sectionId}`}
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-agri-600 hover:bg-agri-50 ${
                  activeSection === item.sectionId ? "bg-agri-50 text-agri-600" : ""
                }`}
                onClick={(e) => handleNavClick(e, item.sectionId)}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 px-4">
              <Button asChild variant="outline" className="w-full border-agri-500 text-agri-700 hover:bg-agri-50">
                <Link to="/login" onClick={toggleMenu}>Login</Link>
              </Button>
              <Button asChild className="w-full bg-agri-500 hover:bg-agri-600 text-white">
                <Link to="/signup" onClick={toggleMenu}>Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
