/* eslint-disable react-hooks/purity */
import { useMemo, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMouseTracker } from '../../contexts/MouseTrackerContext';

const Transition01HeroSpace = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const mousePosRef = useMouseTracker();
  const containerRef = useRef(null);

  useAnimationFrame(() => {
    if (!inView || !containerRef.current) return;
    const clientX = mousePosRef.current.x;
    if (clientX === -1000) return;
    const mouseX = clientX / window.innerWidth;
    const parallaxX = (mouseX - 0.5) * 30;
    containerRef.current.style.transform = `translate(-50%, -50%) rotate(${parallaxX}deg)`;
  });

  // Generate some lines
  const lines = useMemo(() => Array.from({ length: 50 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const length = 20 + Math.random() * 80;
    const thickness = 0.5 + Math.random() * 1.5;
    const duration = 0.8 + Math.random() * 2;
    const delay = Math.random() * 2;
    return { id: i, angle, length, thickness, duration, delay };
  }), []);

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#090a0f] ${!inView ? 'pause-animations' : ''}`}
    >

      <div 
        ref={containerRef}
        className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none origin-center"
        style={{
          transform: `translate(-50%, -50%) rotate(0deg)`,
          transition: 'transform 0.1s linear'
        }}
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{ transform: `rotate(${line.angle}rad)` }}
          >
            <motion.div
              className="absolute top-0 left-0 bg-white/80 rounded-full"
              style={{ height: line.thickness }}
              initial={{ x: 10, width: 0, opacity: 0 }}
              animate={{
                x: 200 + Math.random() * 300,
                width: line.length,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                delay: line.delay,
                ease: "easeIn",
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Portal glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full bg-fuchsia-500/10 blur-2xl mix-blend-screen pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Transition01HeroSpace;
