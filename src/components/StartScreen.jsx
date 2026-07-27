import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const StartScreen = ({ onStart }) => {
  const hoverAudioRef = useRef(null);

  useEffect(() => {
    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio('./audio/sfx/word-chime.mp3');
      hoverAudioRef.current.volume = 0.6;
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-[#050505] overflow-hidden z-[10000] flex items-center justify-center cursor-auto" 
      style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        onClick={onStart}
        onMouseEnter={() => {
          if (hoverAudioRef.current) {
            hoverAudioRef.current.currentTime = 0;
            hoverAudioRef.current.play().catch(e => console.log(e));
          }
        }}
        className="text-[#fdfbf7] text-2xl font-bold tracking-widest hover:text-pink-300 hover:scale-105 transition-all duration-500"
      >
        Bắt đầu
      </motion.button>
    </div>
  );
};

export default StartScreen;
