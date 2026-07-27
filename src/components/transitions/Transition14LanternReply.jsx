/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const MorphingLantern = ({ delay, startX, speed }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute bottom-0 cursor-pointer z-20 flex items-center justify-center w-12 h-12 [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]"
      style={{ left: startX }}
      initial={{ y: '5vh', opacity: 0 }}
      animate={{
        y: '-25vh',
        opacity: [0, 1, 0],
      }}
      transition={{
        y: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        opacity: { duration: speed, repeat: Infinity, delay, ease: "linear" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
          rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
        }}
        transition={{
          rotate: { duration: 0.5, repeat: isHovered ? Infinity : 0 }
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Lantern Shape (fades out) */}
        <motion.svg 
          width="30" height="40" viewBox="0 0 30 40" 
          className="absolute drop-shadow-[0_0_10px_#f97316]"
          animate={{ opacity: [1, 0, 0] }}
          transition={{ duration: speed, repeat: Infinity, delay, ease: "linear" }}
        >
          <rect x="5" y="5" width="20" height="30" rx="4" fill="#fbd38d" />
          <path d="M10 5 L15 0 L20 5" fill="#f6ad55" />
          <path d="M10 35 L15 40 L20 35" fill="#f6ad55" />
        </motion.svg>
        
        {/* Envelope Shape (fades in) */}
        <motion.svg 
          width="40" height="30" viewBox="0 0 40 30" 
          className="absolute drop-shadow-[0_0_10px_#fdfbf7]"
          animate={{ 
            opacity: [0, 1, 1], 
            filter: isHovered ? "drop-shadow(0 0 15px #fdfbf7)" : "drop-shadow(0 0 5px #fdfbf7)" 
          }}
          transition={{ duration: speed, repeat: Infinity, delay, ease: "linear" }}
        >
          <rect x="0" y="0" width="40" height="30" rx="2" fill="none" stroke="#fdfbf7" strokeWidth="2" />
          <path d="M0 0 L20 15 L40 0" fill="none" stroke="#fdfbf7" strokeWidth="2" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

const Transition14LanternReply = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#0d1b2e] via-[#0b101c] to-[#090a0f] ${!inView ? 'pause-animations' : ''}`}
    >
      {/* Thinning out stars */}
      <div className="absolute top-0 w-full h-1/2 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: Math.random() * 1.5 + 0.5,
              height: Math.random() * 1.5 + 0.5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <MorphingLantern delay={0} startX="35vw" speed={5} />
      <MorphingLantern delay={1.5} startX="20vw" speed={7} />
      <MorphingLantern delay={2} startX="65vw" speed={6} />
      <MorphingLantern delay={3.5} startX="80vw" speed={8} />
      <MorphingLantern delay={0.8} startX="50vw" speed={5.5} />
    </div>
  );
};

export default Transition14LanternReply;
