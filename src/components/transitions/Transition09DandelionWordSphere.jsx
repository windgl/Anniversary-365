/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LetterMote = ({ delay, startX, speed, char }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute bottom-0 text-white/70 font-cormorant cursor-pointer select-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]"
      initial={{ y: '25vh', opacity: 0, scale: 0.5, rotate: 0 }}
      animate={{
        y: '-5vh',
        x: (Math.random() - 0.5) * 100,
        opacity: [0, 0.8, 0],
        scale: isHovered ? 1.5 : [0.5, 1, 0.5],
        rotate: [0, 180],
        textShadow: isHovered ? "0 0 10px rgba(255,255,255,0.8)" : "0 0 4px rgba(255,255,255,0.3)"
      }}
      transition={{
        y: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        x: { duration: speed, repeat: Infinity, delay, ease: "easeInOut" },
        opacity: { duration: speed, repeat: Infinity, delay, ease: "linear" },
        scale: { duration: 0.3 },
        rotate: { duration: speed, repeat: Infinity, delay, ease: "linear" }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ left: startX, fontSize: '1rem' }}
    >

      {char}
    </motion.div>
  );
};

const Transition09DandelionWordSphere = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });
  const chars = ['Y', 'ê', 'u', 'T', 'h', 'ư', 'ơ', 'n', 'g', 'N', 'h', 'ớ', 'B', 'ì', 'n', 'h'];

  return (
    <div
      ref={ref}
      className={`relative w-full h-[24vh] md:h-[32vh] overflow-hidden bg-gradient-to-b from-[#fed7aa] via-[#831843] to-[#020617] ${!inView ? 'pause-animations' : ''}`}
    >
      {/* Quote */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 z-20">
        <motion.p
          className="font-cormorant italic text-sm md:text-base text-white/60 text-center max-w-md drop-shadow-md"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          "Love does not consist of gazing at each other, but in looking outward together in the same direction." <br />
          <span className="text-[10px] font-montserrat uppercase tracking-[0.1em] opacity-80 mt-3 inline-block">— Antoine de Saint-Exupéry</span>
        </motion.p>
      </div>

      {/* Center glowing heart */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-300/40 pointer-events-none z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>

      {/* Flying letter motes */}
      {[...Array(20)].map((_, i) => (
        <LetterMote 
          key={i} 
          delay={Math.random() * 3} 
          startX={`${10 + Math.random() * 80}vw`} 
          speed={4 + Math.random() * 3} 
          char={chars[Math.floor(Math.random() * chars.length)]}
        />
      ))}
    </div>
  );
};

export default Transition09DandelionWordSphere;
