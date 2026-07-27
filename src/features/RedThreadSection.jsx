import { useRef, useState, useMemo } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useAudioSync from '../hooks/useAudioSync';

const Explosion = ({ x, y, onComplete }) => {
  const particles = useMemo(() => Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    // Use pseudo-random based on index to satisfy linter
    const pseudoRandom1 = (Math.sin(i * 123) * 10000) - Math.floor(Math.sin(i * 123) * 10000);
    const pseudoRandom2 = (Math.sin(i * 321) * 10000) - Math.floor(Math.sin(i * 321) * 10000);
    const pseudoRandom3 = (Math.sin(i * 555) * 10000) - Math.floor(Math.sin(i * 555) * 10000);
    const dist = 40 + pseudoRandom1 * 40;
    
    return {
      id: i,
      ex: x + Math.cos(angle) * dist,
      ey: y + Math.sin(angle) * dist,
      r: 2 + pseudoRandom2 * 2,
      duration: 0.8 + pseudoRandom3 * 0.4
    };
  }), [x, y]);

  return (
    <g>
      {particles.map(p => (
        <motion.circle
          key={p.id}
          cx={x}
          cy={y}
          r={p.r}
          fill="#fbcfe8"
          initial={{ cx: x, cy: y, opacity: 1 }}
          animate={{ cx: p.ex, cy: p.ey, opacity: 0 }}
          transition={{ duration: p.duration, ease: "easeOut" }}
          onAnimationComplete={p.id === 0 ? onComplete : undefined}
        />
      ))}
    </g>
  );
};

const RedThreadSection = () => {
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3
  });
  
  const { playSound } = useAudioSync();
  const svgRef = useRef(null);
  
  const isDragging = useRef(false);
  const startClientY = useRef(0);
  const currentX = useRef(500);
  
  const dragYTarget = useMotionValue(0);
  const dragY = useSpring(dragYTarget, { stiffness: 350, damping: 10 });
  const [explosions, setExplosions] = useState([]);

  // Paths
  const pathD = useTransform(dragY, y => `M 150 200 Q 500 ${280 + y} 850 200`);
  const pathD2 = useTransform(dragY, y => `M 150 202 Q 500 ${284 + y} 850 202`);

  // Particles
  const pRef0 = useRef(null);
  const pRef1 = useRef(null);
  const pRef2 = useRef(null);
  const particleStates = useRef([
    { t: 0, speed: 0.0015 },
    { t: 0.33, speed: 0.0015 },
    { t: 0.66, speed: 0.0015 }
  ]);

  useAnimationFrame(() => {
    if (!inView) return;
    const cy = 280 + dragY.get();
    particleStates.current.forEach((p, i) => {
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      const t = p.t;
      const mt = 1 - t;
      const x = mt * mt * 150 + 2 * mt * t * 500 + t * t * 850;
      const y = mt * mt * 200 + 2 * mt * t * cy + t * t * 200;
      
      let targetRef = null;
      if (i === 0) targetRef = pRef0.current;
      else if (i === 1) targetRef = pRef1.current;
      else if (i === 2) targetRef = pRef2.current;
      
      if (targetRef) {
        targetRef.setAttribute('cx', x);
        targetRef.setAttribute('cy', y);
      }
    });
  });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    startClientY.current = e.clientY;
    const rect = svgRef.current.getBoundingClientRect();
    currentX.current = ((e.clientX - rect.left) / rect.width) * 1000;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dy = e.clientY - startClientY.current;
    const rect = svgRef.current.getBoundingClientRect();
    const svgDy = (dy / rect.height) * 400;
    dragYTarget.set(Math.max(-150, Math.min(150, svgDy)));
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const dist = Math.abs(dragYTarget.get());
    if (dist > 10) {
      playSound('./audio/sfx/string-pluck.mp3', Math.min(dist / 150, 1) * 0.4 + 0.1);
      
      const t = Math.max(0, Math.min(1, (currentX.current - 150) / 700));
      const mt = 1 - t;
      const cy = 280 + dragY.get();
      const y = mt * mt * 200 + 2 * mt * t * cy + t * t * 200;
      
      const pseudoId = Date.now() + (Math.sin(Date.now()) * 10000 - Math.floor(Math.sin(Date.now()) * 10000));
      setExplosions(prev => [...prev, { id: pseudoId, x: currentX.current, y }]);
    }
    dragYTarget.set(0);
  };

  const removeExplosion = (id) => {
    setExplosions(prev => prev.filter(ex => ex.id !== id));
  };

  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const pseudoRandom1 = (Math.sin(i * 12) * 10000) - Math.floor(Math.sin(i * 12) * 10000);
      const pseudoRandom2 = (Math.sin(i * 34) * 10000) - Math.floor(Math.sin(i * 34) * 10000);
      const pseudoRandom3 = (Math.sin(i * 56) * 10000) - Math.floor(Math.sin(i * 56) * 10000);
      const pseudoRandom4 = (Math.sin(i * 78) * 10000) - Math.floor(Math.sin(i * 78) * 10000);
      const pseudoRandom5 = (Math.sin(i * 90) * 10000) - Math.floor(Math.sin(i * 90) * 10000);

      return {
        id: i,
        top: `${pseudoRandom1 * 100}%`,
        left: `${pseudoRandom2 * 100}%`,
        size: pseudoRandom3 * 2 + 1,
        opacity: pseudoRandom4 * 0.5 + 0.3,
        animationDuration: `${2 + pseudoRandom5 * 3}s`
      };
    });
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#0f0a1f] min-h-[100vh] flex flex-col items-center justify-center"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(s => (
          <div 
            key={s.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: s.top, 
              left: s.left,
              width: s.size, 
              height: s.size,
              opacity: s.opacity,
              animationDuration: s.animationDuration
            }}
          />
        ))}
      </div>

      {/* Blurry Moon */}
      <div className="absolute top-10 right-10 md:top-20 md:right-32 w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#fbcfe8] opacity-20 blur-[40px] pointer-events-none"></div>
      <div className="absolute top-16 right-16 md:top-28 md:right-40 w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#fdfbf7] opacity-30 blur-2xl pointer-events-none"></div>

      {/* Content */}
      <div className="absolute top-32 flex flex-col items-center text-center px-4 z-10 pointer-events-none w-full">
        
      </div>

      {/* Interactive SVG */}
      <div 
        className="relative w-full max-w-5xl aspect-[2] md:aspect-[3] mt-24 cursor-grab active:cursor-grabbing touch-none select-none z-20"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg ref={svgRef} viewBox="0 0 1000 400" className="w-full h-full overflow-visible drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="glowBell" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowSmall" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Thread 1 (Main) */}
          <motion.path 
            d={pathD}
            fill="none"
            stroke="url(#threadGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glowSmall)"
          />
          
          {/* Thread 2 (Twist) */}
          <motion.path 
            d={pathD2}
            fill="none"
            stroke="url(#threadGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Running Particles */}
          <circle ref={pRef0} r="2.5" fill="#fbcfe8" filter="url(#glowSmall)" />
          <circle ref={pRef1} r="2.5" fill="#fdfbf7" filter="url(#glowSmall)" />
          <circle ref={pRef2} r="2.5" fill="#fbcfe8" filter="url(#glowSmall)" />

          {/* Explosions */}
          <AnimatePresence>
            {explosions.map(ex => (
              <Explosion key={ex.id} x={ex.x} y={ex.y} onComplete={() => removeExplosion(ex.id)} />
            ))}
          </AnimatePresence>

          {/* Left Bell (Anh) */}
          <g transform="translate(150, 200)" filter="url(#glowBell)">
            <circle cx="0" cy="0" r="16" fill="#1a0f2e" stroke="#dc2626" strokeWidth="2" />
            <path d="M -8 4 C -8 -4, 8 -4, 8 4 L 10 10 L -10 10 Z" fill="#fbbf24" />
            <circle cx="0" cy="12" r="3" fill="#fbbf24" />
            <path d="M -3 -8 C -3 -12, 3 -12, 3 -8" fill="none" stroke="#fbbf24" strokeWidth="2" />
          </g>

          {/* Right Flower (Em) */}
          <g transform="translate(850, 200)" filter="url(#glowBell)">
            <circle cx="0" cy="0" r="16" fill="#1a0f2e" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="-5" cy="-5" r="5" fill="#be123c" />
            <circle cx="5" cy="-5" r="5" fill="#be123c" />
            <circle cx="-5" cy="5" r="5" fill="#be123c" />
            <circle cx="5" cy="5" r="5" fill="#be123c" />
            <circle cx="0" cy="0" r="4" fill="#fbbf24" />
          </g>
        </svg>

        {/* Instruction */}
        <div className="absolute bottom-[2rem] md:bottom-[-1rem] left-0 w-full flex justify-center pointer-events-none">
          <span className="font-montserrat text-[10px] md:text-xs tracking-[0.2em] uppercase text-pink-soft opacity-60 animate-pulse">
            Kéo và thả để gảy sợi chỉ
          </span>
        </div>
      </div>
    </section>
  );
};

export default RedThreadSection;
