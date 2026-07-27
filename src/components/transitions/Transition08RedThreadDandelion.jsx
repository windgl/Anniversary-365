/* eslint-disable react-hooks/purity */
import { useMemo } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMouseTracker } from '../../contexts/MouseTrackerContext';

const Mote = ({ delay, startX, speed }) => {
  const mousePosRef = useMouseTracker();
  
  // Memoize random base wind so it doesn't change on every frame
  const baseWind = useMemo(() => Math.random() * 40 - 20, []);
  
  const xVal = useMotionValue(baseWind);

  useAnimationFrame(() => {
    const mouseX = mousePosRef.current.x;
    const screenW = window.innerWidth || 1000;
    const startXPx = (parseFloat(startX) / 100) * screenW;
    
    let target = baseWind;
    if (mouseX !== -1000 && Math.abs(mouseX - startXPx) < 200) {
      target = mouseX < startXPx ? 100 : -100;
    }
    
    xVal.set(xVal.get() + (target - xVal.get()) * 0.05);
  });

  return (
    <motion.div
      className="absolute top-0 w-1.5 h-1.5 rounded-full bg-red-400/80 pointer-events-none mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]"
      style={{
        boxShadow: "0 0 6px rgba(248, 113, 113, 0.8)",
        left: startX,
        x: xVal
      }}
      initial={{ y: '0vh', opacity: 0 }}
      animate={{
        y: '25vh',
        opacity: [0, 1, 0],
      }}
      transition={{
        y: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        opacity: { duration: speed, repeat: Infinity, delay, ease: "linear" },
      }}
    />

  );
};

const Transition08RedThreadDandelion = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#0f0a1f] via-[#4c1d95] to-[#c4b5fd] ${!inView ? 'pause-animations' : ''}`}
    >
      {/* Frayed thread coming from top center */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-20" viewBox="0 0 40 80">
        <path d="M20 0 C22 20, 18 40, 20 60" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="opacity-60" />
        <path d="M20 40 Q25 60 28 80" fill="none" stroke="#f43f5e" strokeWidth="1" className="opacity-40" />
        <path d="M20 50 Q15 65 12 80" fill="none" stroke="#f43f5e" strokeWidth="1" className="opacity-40" />
        <path d="M20 45 Q20 60 22 80" fill="none" stroke="#f43f5e" strokeWidth="1" className="opacity-50" />
      </svg>

      {/* Floating light motes scattered from center */}
      {[...Array(15)].map((_, i) => (
        <Mote 
          key={i} 
          delay={Math.random() * 3} 
          startX={`${45 + Math.random() * 10}vw`} 
          speed={3 + Math.random() * 2} 
        />
      ))}
    </div>
  );
};

export default Transition08RedThreadDandelion;
