
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 5000, label: "Farmers Connected", suffix: "+" },
  { value: 15000, label: "Hectares Analyzed", suffix: "+" },
  { value: 30, label: "Agricultural Programs", suffix: "" },
  { value: 18, label: "Indian States Covered", suffix: "" }
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-r from-agri-800 to-agri-900 text-white"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Our Impact in Numbers
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <CountUp
                start={0}
                end={stat.value}
                duration={2}
                isVisible={isVisible}
                suffix={stat.suffix}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-agri-300"
              />
              <p className="text-gray-300 mt-2 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CountUpProps {
  start: number;
  end: number;
  duration: number;
  isVisible: boolean;
  suffix: string;
  className?: string;
}

function CountUp({ start, end, duration, isVisible, suffix, className = "" }: CountUpProps) {
  const [count, setCount] = useState(start);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / (duration * 1000), 1);
      
      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progressPercent);
      
      const currentCount = Math.floor(start + easedProgress * (end - start));
      setCount(currentCount);
      
      if (progressPercent < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [start, end, duration, isVisible]);
  
  return <div className={className}>{count}{suffix}</div>;
}
