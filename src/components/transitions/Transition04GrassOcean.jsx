/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Ripple = ({ x, y, onComplete }) => (
  <motion.div
    className="absolute rounded-full border border-blue-300/40 pointer-events-none"
    initial={{ width: 0, height: 0, x: x, y: y, opacity: 0.6 }}
    animate={{ width: 80, height: 80, x: x - 40, y: y - 40, opacity: 0 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    onAnimationComplete={onComplete}
  />
);

const Transition04GrassOcean = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    if (Math.random() > 0.85) {
      const rect = e.currentTarget.getBoundingClientRect();
      setRipples(prev => [...prev, { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    }
  };

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#0b1e33] to-[#0b1e33] ${!inView ? 'pause-animations' : ''}`}
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => {
        if (Math.random() >
 0.85) {
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          setRipples(prev => [...prev, { id: Date.now() + Math.random(), x: touch.clientX - rect.left, y: touch.clientY - rect.top }]);
        }
      }}
    >
      {/* Wave SVGs with increasing amplitude towards the right */}
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path fill="none" stroke="#7dd3fc" strokeWidth="0.5">
          <animate 
            attributeName="d" 
            values="M0,50 Q 12.5,45 25,50 Q 37.5,55 50,50 Q 62.5,35 75,50 Q 87.5,65 100,50; M0,50 Q 12.5,55 25,50 Q 37.5,45 50,50 Q 62.5,65 75,50 Q 87.5,35 100,50; M0,50 Q 12.5,45 25,50 Q 37.5,55 50,50 Q 62.5,35 75,50 Q 87.5,65 100,50"
            dur="4s" repeatCount="indefinite" 
          />
        </path>
        <path fill="none" stroke="#bae6fd" strokeWidth="0.3" opacity="0.6">
          <animate 
            attributeName="d" 
            values="M0,60 Q 12.5,65 25,60 Q 37.5,55 50,60 Q 62.5,75 75,60 Q 87.5,45 100,60; M0,60 Q 12.5,55 25,60 Q 37.5,65 50,60 Q 62.5,45 75,60 Q 87.5,75 100,60; M0,60 Q 12.5,65 25,60 Q 37.5,55 50,60 Q 62.5,75 75,60 Q 87.5,45 100,60"
            dur="6s" repeatCount="indefinite" 
          />
        </path>
      </svg>

      {/* Rising bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[-10px] rounded-full border border-blue-200/40 bg-blue-100/10"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            left: `${15 + i * 15}vw`
          }}
          animate={{
            y: '-25vh',
            x: ['0px', '20px', '-10px', '0px'],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            y: { duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "linear" },
            x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }
          }}
        />
      ))}

      <AnimatePresence>
        {ripples.map(ripple => (
          <Ripple key={ripple.id} x={ripple.x} y={ripple.y} onComplete={() => setRipples(prev => prev.filter(r => r.id !== ripple.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Transition04GrassOcean;
