
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Punjab",
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop",
    rating: 5,
    text: "KrishiConnect's soil analysis and crop recommendations have transformed my farming practices. I've seen a 40% increase in yield and significant cost savings on fertilizers by using just what my soil needs."
  },
  {
    id: 2,
    name: "Lakshmi Devi",
    location: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?q=80&w=1974&auto=format&fit=crop",
    rating: 5,
    text: "The weather forecasting feature has been a game-changer for me. I can now plan irrigation and harvesting with precision, saving water and protecting my crops from unexpected weather conditions."
  },
  {
    id: 3,
    name: "Amit Sharma",
    location: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop",
    rating: 4,
    text: "I was skeptical about technology in farming, but the KrishiConnect app is so user-friendly. The disease prediction feature helped me save my tomato crop from blight by identifying it early."
  },
  {
    id: 4,
    name: "Priya Patel",
    location: "Gujarat",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    rating: 5,
    text: "Being able to connect with other farmers through the community feature has been invaluable. I've learned new techniques and made friends who understand the challenges of farming."
  },
  {
    id: 5,
    name: "Mohammad Farooq",
    location: "Maharashtra",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    rating: 5,
    text: "The AI chatbot answers my questions at any time of day, which is perfect for busy farmers like me. It's like having an agriculture expert in my pocket 24/7."
  }
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      next();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, current]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-20 bg-agri-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            What Farmers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from farmers who have transformed their agricultural practices using KrishiConnect.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <div className="relative h-full overflow-hidden">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white rounded-xl shadow-lg p-6 md:p-8"
              >
                {/* Image Column */}
                <div className="md:col-span-2 flex flex-col items-center md:items-start">
                  <div className="rounded-full overflow-hidden w-24 h-24 md:w-32 md:h-32 mb-4">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-agri-800">{testimonials[current].name}</h3>
                  <p className="text-gray-600">{testimonials[current].location}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < testimonials[current].rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content Column */}
                <div className="md:col-span-3 flex flex-col justify-center">
                  <div className="text-agri-600 text-6xl font-serif mb-4">"</div>
                  <p className="text-lg text-gray-700 italic mb-4">
                    {testimonials[current].text}
                  </p>
                  <div className="text-agri-600 text-6xl font-serif self-end">"</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute z-10 w-full flex justify-between items-center top-1/2 -translate-y-1/2 px-4">
            <button
              onClick={prev}
              className="bg-white text-agri-600 rounded-full p-2 shadow-lg hover:bg-agri-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="bg-white text-agri-600 rounded-full p-2 shadow-lg hover:bg-agri-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === current ? "bg-agri-500" : "bg-gray-300 hover:bg-agri-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
