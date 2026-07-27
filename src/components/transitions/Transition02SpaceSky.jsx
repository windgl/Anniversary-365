/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Transition02SpaceSky = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#1e3c72] to-[#1e3c72] ${!inView ? 'pause-animations' : ''}`}
    >

      {/* Curved glowing horizon line container */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] rounded-[100%] overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full border-t border-white/20"
          animate={{
            boxShadow: isHovered 
              ? "inset 0 20px 40px -10px rgba(255,255,255,0.4)" 
              : "inset 0 10px 20px -10px rgba(255,255,255,0.1)",
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Animated gradient across horizon */}
        <motion.div
          className="absolute top-[-1px] left-[-50%] h-[3px] w-[200%]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(253,251,247,0.9) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Light rays shining upwards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full flex justify-center gap-8 md:gap-24 pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-[1px] md:w-[2px] bg-gradient-to-t from-amber-100/60 to-transparent"
            style={{
              height: 80 + Math.random() * 80,
              transformOrigin: "bottom center",
              rotate: (i - 1.5) * 20 + "deg",
            }}
            animate={{
              height: isHovered ? 150 : (80 + Math.random() * 60),
              opacity: isHovered ? [0.8, 1, 0.8] : [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 text-center font-cormorant italic text-white/70 text-xl md:text-2xl drop-shadow-md max-w-2xl w-full px-4 cursor-default z-10 hover:text-white hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        "cảm ơn em vì đã hiện diện trong cuộc sống của anh"
      </motion.div>
    </div>
  );
};

export default Transition02SpaceSky;
