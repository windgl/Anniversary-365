/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Transition07RoseRedThread = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const [isPlucked, setIsPlucked] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#090a0f] to-[#1a0f2e] ${!inView ? 'pause-animations' : ''}`}
    >

      {/* Star dust */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Quote */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 z-10">
        <motion.p
          className="font-cormorant italic text-sm md:text-base text-white/60 text-center max-w-md drop-shadow-md"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          "If I know what love is, it is because of you." <br />
          <span className="text-[10px] font-montserrat uppercase tracking-[0.1em] opacity-80 mt-3 inline-block">— Hermann Hesse</span>
        </motion.p>
      </div>

      {/* Thread */}
      <div 
        className="absolute inset-0 flex justify-center cursor-pointer z-20"
        onMouseEnter={() => setIsPlucked(true)}
        onMouseLeave={() => setIsPlucked(false)}
        onTouchStart={() => setIsPlucked(true)}
        onTouchEnd={() => setIsPlucked(false)}
      >
        <svg width="100" height="100%" viewBox="0 0 100 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="transThreadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <motion.path
            d="M50 0 C60 50, 40 150, 50 200"
            fill="none"
            stroke="url(#transThreadGrad)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              d: isPlucked 
                ? "M50 0 C70 50, 30 150, 50 200" 
                : "M50 0 C60 50, 40 150, 50 200"
            }}
            transition={{ 
              pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
              d: { type: "spring", stiffness: 300, damping: 10 }
            }}
            style={{ filter: "drop-shadow(0 0 4px rgba(244,63,94,0.5))" }}
          />
        </svg>
      </div>
    </div>
  );
};

export default Transition07RoseRedThread;
