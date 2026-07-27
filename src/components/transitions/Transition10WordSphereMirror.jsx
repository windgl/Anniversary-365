 
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FallingWord = ({ word, startX, speed, delay }) => {
  return (
    <>
      <motion.div
        className="absolute text-white/80 font-cormorant text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]"
        initial={{ y: '-10vh', opacity: 0 }}
        animate={{ y: '25vh', opacity: [0, 1, 1, 0] }}
        transition={{
          y: { duration: speed, repeat: Infinity, delay, ease: "linear" },
          opacity: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        }}
        style={{ left: startX }}
      >

        {word}
      </motion.div>
      {/* Sync ripple with bottom hit */}
      <motion.div
        className="absolute rounded-full border border-blue-300/40 pointer-events-none"
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ 
          width: [0, 60], 
          height: [0, 20], 
          opacity: [0, 0.8, 0] 
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: delay + speed * 0.8, // approximate bottom hit time
          ease: "easeOut",
          repeatDelay: speed - 1
        }}
        style={{ left: `calc(${startX} - 30px)`, bottom: '-10px' }}
      />
    </>
  );
}

const Ripple = ({ x, y, onComplete }) => (
  <motion.div
    className="absolute rounded-full border border-blue-300/40 pointer-events-none -translate-x-1/2 -translate-y-1/2"
    initial={{ width: 0, height: 0, opacity: 0.8 }}
    animate={{ width: 100, height: 40, opacity: 0 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    onAnimationComplete={onComplete}
    style={{ left: x, top: y }}
  />
);

const Transition10WordSphereMirror = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipples(prev => [...prev, { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden cursor-pointer bg-gradient-to-b from-[#020617] via-[#081222] to-[#0b1e33] ${!inView ? 'pause-animations' : ''}`}
      onClick={handleClick}
    >
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0b1e33] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-blue-900/20 blur-md pointer-events-none" />

      <FallingWord word="love" startX="30vw" speed={4} delay={0.5} />
      <FallingWord word="you" startX="50vw" speed={3.5} delay={2.5} />
      <FallingWord word="always" startX="70vw" speed={4.5} delay={1.5} />

      <AnimatePresence>
        {ripples.map(r => (
          <Ripple key={r.id} x={r.x} y={r.y} onComplete={() => setRipples(prev => prev.filter(ripple => ripple.id !== r.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Transition10WordSphereMirror;
