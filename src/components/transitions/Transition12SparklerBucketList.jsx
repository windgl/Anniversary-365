/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Transition12SparklerBucketList = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#0a0a1f] via-[#433036] to-[#8c6b5d] ${!inView ? 'pause-animations' : ''}`}
    >

      {/* Doorway glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] md:w-[40%] h-[150%] cursor-pointer pointer-events-auto flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="w-full h-full bg-[#fdfbf7]/10 blur-2xl transition-colors duration-500"
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
            scale: isHovered ? 1.05 : 1,
            backgroundColor: isHovered ? 'rgba(253, 251, 247, 0.15)' : 'rgba(253, 251, 247, 0.08)'
          }}
        />
        <motion.div
          className="absolute w-[80%] h-full bg-[#fdfbf7]/20 blur-3xl transition-opacity duration-500"
          animate={{
            opacity: isHovered ? 0.7 : 0.3
          }}
        />
      </div>

      {/* Ambient drifting fireflies */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#fef08a] shadow-[0_0_8px_#fef08a] pointer-events-none mix-blend-screen"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0, 0.8, 0],
            scale: [0, Math.random() + 0.5, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Sparks flying in */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute top-[-10px] w-1.5 h-1.5 rounded-full bg-[#fef08a] shadow-[0_0_8px_#fef08a] pointer-events-none"
          initial={{ y: 0, x: (i - 5) * 20, opacity: 0 }}
          animate={{
            y: ['0vh', '15vh'],
            x: [(i - 5) * 20, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 0]
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeIn"
          }}
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        />
      ))}
    </div>
  );
};

export default Transition12SparklerBucketList;
