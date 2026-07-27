/* eslint-disable react-hooks/purity */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


const HeartBubble = ({ delay, startX, speed, size }) => {
  const [popped, setPopped] = useState(false);

  const handlePop = (e) => {
    e.stopPropagation();
    if (!popped) {
      setPopped(true);
      setTimeout(() => setPopped(false), speed * 1000); // respawn after a while
    }
  };

  const particles = useMemo(() => {
    return [...Array(5)].map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popped]);

  return (
    <motion.div
      style={{ left: startX }}
      className="absolute bottom-[-20px] cursor-pointer z-20"
      initial={{ x: startX, y: '10vh', opacity: 0 }}
      animate={{
        x: [startX, `calc(${startX} - 15px)`, `calc(${startX} + 15px)`, startX],
        y: '-25vh',
        opacity: popped ? 0 : [0, 0.4, 0],
      }}
      transition={{
        y: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        x: { duration: speed * 0.6, repeat: Infinity, delay, ease: "easeInOut" },
        opacity: { duration: speed, repeat: Infinity, delay, ease: "linear" }
      }}
      onClick={handlePop}
      onMouseEnter={handlePop}
      onTouchStart={handlePop}
    >
      {!popped && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#fbcfe8"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm opacity-80"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
      
      <AnimatePresence>
        {popped && (
          <>
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-[#fbcfe8] rounded-full"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: 0,
                  scale: 0.5
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TransitionOceanSnoopy = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#22091a] to-[#3b0a2a] ${!inView ? 'pause-animations' : ''}`}
    >
      {/* Central Pulsating Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-fuchsia-500/10 blur-2xl rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      


      {/* Floating Hearts */}
      <HeartBubble delay={0} startX="15vw" speed={4.5} size={14} />
      <HeartBubble delay={1.2} startX="35vw" speed={5.5} size={18} />
      <HeartBubble delay={2.5} startX="55vw" speed={4.8} size={12} />
      <HeartBubble delay={0.8} startX="75vw" speed={6} size={16} />
      <HeartBubble delay={3.1} startX="85vw" speed={5.2} size={14} />
      <HeartBubble delay={1.8} startX="25vw" speed={6.5} size={20} />
      <HeartBubble delay={0.4} startX="65vw" speed={4.2} size={12} />
      <HeartBubble delay={2.1} startX="45vw" speed={5.8} size={16} />
      <HeartBubble delay={3.5} startX="10vw" speed={4.9} size={14} />
      <HeartBubble delay={1.5} startX="90vw" speed={5.1} size={18} />
    </div>
  );
};

export default TransitionOceanSnoopy;
