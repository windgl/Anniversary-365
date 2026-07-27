/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Transition13BucketListLantern = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const [sparks, setSparks] = useState([]);

  const handleLightClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setSparks(prev => [...prev, { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#8c6b5d] via-[#433036] to-[#020208] ${!inView ? 'pause-animations' : ''}`}
    >

      {/* Starry night revealed behind doors */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/80"
            style={{
              width: Math.random() * 2,
              height: Math.random() * 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Ambient drifting fireflies/lanterns */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="absolute rounded-full bg-[#fb923c] shadow-[0_0_10px_#fb923c] pointer-events-none mix-blend-screen"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${50 + Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Shoji doors opening */}
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-full bg-[#3d2a23] border-r border-[#5c4033] z-10"
        initial={{ x: 0 }}
        whileInView={{ x: '-100%' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-0 right-0 w-1/2 h-full bg-[#3d2a23] border-l border-[#5c4033] z-10"
        initial={{ x: 0 }}
        whileInView={{ x: '100%' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Small light spot (lantern) */}
      <motion.div
        className="absolute bottom-4 right-8 w-6 h-8 bg-orange-400/80 rounded-sm cursor-pointer z-20 shadow-[0_0_15px_#f97316]"
        initial={{ scale: 1, opacity: 1 }}
        whileInView={{ scale: 0, opacity: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeIn" }}
        onClick={handleLightClick}
      />

      {/* Sparks flying up on click */}
      <AnimatePresence>
        {sparks.map(spark => (
          <motion.div
            key={spark.id}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#fef08a] shadow-[0_0_8px_#fef08a] pointer-events-none z-30"
            style={{ left: spark.x, top: spark.y }}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -200, opacity: 0, scale: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => setSparks(prev => prev.filter(s => s.id !== spark.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Transition13BucketListLantern;
