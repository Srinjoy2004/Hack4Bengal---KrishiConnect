
import { motion } from "framer-motion";

export default function AboutSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-agri-500/20 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-agri-500/20 rounded-full z-0"></div>
              <img 
                src="src\Images\istockphoto-1316735334-612x612.jpg"
                alt="Farmers using KrishiConnect technology"
                className="rounded-lg shadow-2xl w-full h-auto relative z-10"
              />
              <div className="absolute top-1/4 right-0 transform translate-x-1/4 bg-white p-4 rounded-lg shadow-xl text-agri-800 font-bold z-20">
                <span className="text-3xl">5000+</span>
                <span className="block text-sm">Farmers Empowered</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="w-full md:w-1/2"
          >
            <motion.span
              variants={fadeInUp}
              className="text-agri-600 font-semibold text-sm uppercase tracking-wider"
            >
              About KrishiConnect
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mt-2 mb-6 gradient-text"
            >
              Transforming Agriculture Through Technology
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 mb-6"
            >
              KrishiConnect was founded in 2020 with a vision to revolutionize farming in India by bringing together technology, data science, and agricultural expertise. We believe that every farmer deserves access to cutting-edge tools that can increase productivity and sustainability.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 mb-6"
            >
              Our team consists of agricultural scientists, AI experts, and rural development specialists committed to developing solutions that address the real challenges faced by farmers across India.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-agri-50 p-4 rounded-lg">
                <h3 className="font-bold text-agri-800 text-lg">Our Mission</h3>
                <p className="text-gray-600 mt-2">
                  Empowering farmers with accessible technology for sustainable and profitable agriculture.
                </p>
              </div>
              <div className="bg-agri-50 p-4 rounded-lg">
                <h3 className="font-bold text-agri-800 text-lg">Our Vision</h3>
                <p className="text-gray-600 mt-2">
                  A future where every Indian farmer leverages technology for optimal agricultural outcomes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
