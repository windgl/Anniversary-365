/* eslint-disable react-hooks/purity */
import { useMemo } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMouseTracker } from '../../contexts/MouseTrackerContext';

const Spark = ({ delay, startX, speed }) => {
  const mousePosRef = useMouseTracker();
  
  // Memoize random base wind so it doesn't change on every frame
  const baseWind = useMemo(() => Math.random() * 20 - 10, []);
  
  const xVal = useMotionValue(baseWind);

  useAnimationFrame(() => {
    const mouseX = mousePosRef.current.x;
    const screenW = window.innerWidth || 1000;
    const startXPx = (parseFloat(startX) / 100) * screenW;
    
    let target = baseWind;
    if (mouseX !== -1000 && Math.abs(mouseX - startXPx) < 200) {
      target = mouseX < startXPx ? 50 : -50;
    }
    
    xVal.set(xVal.get() + (target - xVal.get()) * 0.05);
  });

  return (
    <motion.div
      style={{ left: startX, x: xVal }}
      className="absolute bottom-0 w-1.5 h-1.5 rounded-full pointer-events-none mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]"
      initial={{ y: '5vh', opacity: 0, backgroundColor: '#93c5fd', boxShadow: '0 0 5px #93c5fd' }}
      animate={{
        y: '-25vh',
        opacity: [0, 1, 0],
        backgroundColor: ['#93c5fd', '#fef08a', '#f97316'],
        boxShadow: ['0 0 5px #93c5fd', '0 0 8px #fef08a', '0 0 10px #f97316'],
      }}
      transition={{
        y: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        opacity: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        backgroundColor: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        boxShadow: { duration: speed, repeat: Infinity, delay, ease: "linear" }
      }}
    />

  );
};

const Transition11MirrorSparkler = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#0b1e33] via-[#081222] to-[#050208] ${!inView ? 'pause-animations' : ''}`}
    >
      <div className="absolute top-0 w-full h-1/2 pointer-events-none">
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
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 z-20">
        <motion.p
          className="font-cormorant italic text-sm md:text-base text-white/60 text-center max-w-md drop-shadow-md"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          "There is no remedy for love but to love more." <br />
          <span className="text-[10px] font-montserrat uppercase tracking-[0.1em] opacity-80 mt-3 inline-block">— Henry David Thoreau</span>
        </motion.p>
      </div>

      {/* Water reflection band */}
      <div className="absolute bottom-0 w-full h-4 bg-blue-400/10 blur-sm pointer-events-none" />

      {[...Array(12)].map((_, i) => (
        <Spark 
          key={i} 
          delay={Math.random() * 3} 
          startX={`${10 + Math.random() * 80}vw`} 
          speed={3 + Math.random() * 2} 
        />
      ))}
    </div>
  );
};

export default Transition11MirrorSparkler;
