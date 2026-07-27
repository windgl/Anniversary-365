// src/components/transitions/TransitionSnoopyRose.jsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PawPrint = ({ x, y, rotation, opacity }) => (
  <div 
    className="absolute text-pink-300 pointer-events-none"
    style={{ left: x, top: y, transform: `rotate(${rotation}deg)`, opacity }}
  >
    <svg width="36" height="36" viewBox="0 0 50 50" fill="currentColor">
      <circle cx="14" cy="18" r="5.5" />
      <circle cx="25" cy="11" r="6" />
      <circle cx="36" cy="18" r="5.5" />
      <path d="M15 32 C15 22, 35 22, 35 32 C38 42, 28 45, 25 45 C22 45, 12 42, 15 32 Z" />
    </svg>
  </div>
);

const Sparkle = ({ left, duration, delay, size }) => (
  <motion.div
    className="absolute rounded-full shadow-[0_0_8px_rgba(252,165,165,0.8)]"
    style={{ 
      left, 
      width: size, 
      height: size, 
      backgroundColor: '#fecaca',
    }}
    animate={{ 
      top: ['0%', '100%'],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1.2, 0.5]
    }}
    transition={{
      duration, 
      repeat: Infinity, 
      ease: "easeInOut", 
      delay 
    }}
  />
);

const TransitionSnoopyRose = () => {
  const containerRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({ triggerOnce: false, threshold: 0 });

  // Cuộn cục bộ để giảm opacity tổng thể về cuối
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Khi cuộn xuống (progress tăng), opacity giảm dần mô phỏng tắt đèn
  const fadeOut = useTransform(scrollYProgress, [0.3, 0.8], [1, 0]);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        inViewRef(el);
      }}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#4a0e2e] via-[#24101f] to-[#020617] ${!inView ? 'pause-animations' : ''}`}
    >
      <motion.div style={{ opacity: fadeOut }} className="absolute inset-0 pointer-events-none">
        {/* Hạt lấp lánh hồng nhạt rải rác */}
        <Sparkle left="15%" duration={4.5} delay={0} size={4} />
        <Sparkle left="35%" duration={6} delay={1.5} size={3} />
        <Sparkle left="55%" duration={5} delay={0.5} size={5} />
        <Sparkle left="75%" duration={7} delay={2} size={4} />
        <Sparkle left="85%" duration={5.5} delay={1} size={3} />
        <Sparkle left="25%" duration={4} delay={2.5} size={5} />

        {/* Dấu chân cún đi khuất vào bóng tối */}
        <PawPrint x="25%" y="15%" rotation={-15} opacity={0.3} />
        <PawPrint x="45%" y="35%" rotation={10} opacity={0.25} />
        <PawPrint x="60%" y="60%" rotation={-5} opacity={0.2} />
        <PawPrint x="75%" y="80%" rotation={20} opacity={0.15} />

        {/* God ray xuyên từ trên xuống, màu hồng ấm */}
        <motion.div
          className="absolute -top-[50%] left-[10%] w-[150%] h-[200%] origin-top-left pointer-events-none"
          style={{
            background: 'linear-gradient(160deg, rgba(236, 64, 122, 0.06) 0%, rgba(236, 64, 122, 0) 40%)',
            transform: 'rotate(-25deg)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default TransitionSnoopyRose;
