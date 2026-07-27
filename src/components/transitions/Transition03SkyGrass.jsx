/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Bird = ({ delay, startX, startY, speed, scale }) => {
  const [isScattered, setIsScattered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsScattered(true);
  };

  return (
    <motion.div
      className="absolute cursor-pointer z-20"
      initial={{ x: startX, y: startY, opacity: 0 }}
      animate={{
        x: `calc(${startX} - 40vw)`,
        y: `calc(${startY} + 30vh)`,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: isScattered ? speed * 0.6 : speed,
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
      onClick={handleClick}
      onAnimationIteration={() => setIsScattered(false)}
      style={{ scale }}
    >

      <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor" className="text-slate-900/40 drop-shadow-sm">
        <path d="M 10 50 Q 30 15 50 50 Q 70 15 90 50 Q 70 55 50 50 Q 30 55 10 50 Z">
          <animate 
            attributeName="d" 
            values="M 10 50 Q 30 15 50 50 Q 70 15 90 50 Q 70 55 50 50 Q 30 55 10 50 Z; M 10 50 Q 30 85 50 50 Q 70 85 90 50 Q 70 55 50 50 Q 30 55 10 50 Z; M 10 50 Q 30 15 50 50 Q 70 15 90 50 Q 70 55 50 50 Q 30 55 10 50 Z" 
            dur={isScattered ? "0.15s" : "0.5s"} 
            repeatCount="indefinite" 
          />
        </path>
      </svg>

      <AnimatePresence>
        {isScattered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-slate-900/30 rounded-full"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 60,
                  y: Math.random() * 60 + 20,
                  opacity: 0,
                  scale: 0.5,
                  rotate: Math.random() * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Transition03SkyGrass = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#064e3b] to-[#064e3b] ${!inView ? 'pause-animations' : ''}`}
    >
      <Bird delay={0} startX="80vw" startY="-5vh" speed={8} scale={0.8} />
      <Bird delay={2} startX="95vw" startY="-2vh" speed={10} scale={0.5} />
      <Bird delay={4.5} startX="70vw" startY="-10vh" speed={7} scale={1} />

      {/* Mist layer */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent blur-md pointer-events-none z-10" />
    </div>
  );
};

export default Transition03SkyGrass;
