// src/features/snoopy/SnoopyScene1Dreamy.jsx
import { memo, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SNOOPY_SCENE_1, resolveSnoopyAsset } from './snoopyConstants';
import SnoopyFloatingImage from './SnoopyFloatingImage';
import StoryNote from '../../components/StoryNote';

// Hàm giả ngẫu nhiên có seed để tránh hình ảnh nhảy lộn xộn giữa các lần render
const prand = (seed) => {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};


const CSSStar = ({ top, left, size, delay, duration }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <motion.div
      className="absolute flex items-center justify-center cursor-pointer pointer-events-auto"
      style={{ top, left, width: size * 2, height: size * 2 }}
      onClick={() => {
        if (clicked) return;
        setClicked(true);
        setTimeout(() => setClicked(false), 1000);
      }}
      animate={clicked ? { rotate: 360, scale: 1.5, opacity: 1 } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white"
        style={{
          width: size, height: size,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          boxShadow: clicked ? '0 0 15px #fff' : 'none'
        }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

// Component bầu trời sao lấp lánh
const Starfield = memo(({ scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const stars = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 15 : 25;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${prand(i) * 100}%`,
      left: `${prand(i + 100) * 100}%`,
      size: prand(i + 200) * 8 + 6,
      delay: prand(i + 300) * 3,
      duration: prand(i + 400) * 2 + 1.5
    }));
  }, []);
  return (
    <motion.div style={{ opacity }} className="absolute inset-0 z-0">
      {stars.map(star => (
        <CSSStar key={star.id} {...star} />
      ))}
    </motion.div>
  );
});

const CSSCloud = ({ top, left, right, scale, duration, color, opacity }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <motion.div
      className="absolute cursor-pointer pointer-events-auto"
      style={{ 
        top, 
        ...(left ? { left } : { right }),
        transform: `scale(${scale})`,
        opacity,
        filter: 'blur(2px)'
      }}
      animate={{ 
        x: [-10, 10, -10], 
        y: clicked ? [-20, -20] : [-5, 5, -5],
        scale: clicked ? scale * 1.1 : scale
      }}
      transition={{ 
        duration: clicked ? 0.5 : duration, 
        repeat: clicked ? 0 : Infinity, 
        ease: clicked ? "easeOut" : "easeInOut" 
      }}
      onClick={() => {
        if (clicked) return;
        setClicked(true);
        setTimeout(() => setClicked(false), 1000);
      }}
    >
      {/* Cấu trúc đám mây bằng các khối bo tròn */}
      <div className="relative w-[160px] h-[60px]">
        <div className="absolute bottom-0 w-[120px] h-[40px] rounded-full" style={{ backgroundColor: color }} />
        <div className="absolute bottom-[20px] left-[15px] w-[50px] h-[50px] rounded-full" style={{ backgroundColor: color }} />
        <div className="absolute bottom-[10px] left-[45px] w-[60px] h-[60px] rounded-full" style={{ backgroundColor: color }} />
        <div className="absolute bottom-[5px] left-[90px] w-[45px] h-[45px] rounded-full" style={{ backgroundColor: color }} />
      </div>
    </motion.div>
  );
};

// Component mây gối bồng bềnh pastel
const Clouds = memo(() => {
  const cloudData = useMemo(() => [
    { id: 1, top: '5%', left: '-5%', scale: 1.5, duration: 25, color: '#fbcfe8', opacity: 0.8 },
    { id: 2, top: '15%', right: '5%', scale: 1.2, duration: 28, color: '#f9a8d4', opacity: 0.6 },
    { id: 3, top: '65%', left: '-5%', scale: 1.8, duration: 22, color: '#fbcfe8', opacity: 0.7 },
    { id: 4, top: '80%', right: '0%', scale: 1.4, duration: 26, color: '#f9a8d4', opacity: 0.8 },
    { id: 5, top: '40%', left: '40%', scale: 1, duration: 30, color: '#fed7aa', opacity: 0.5 },
    { id: 6, top: '75%', left: '30%', scale: 1.3, duration: 24, color: '#e9d5ff', opacity: 0.6 },
  ], []);
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Nền hoàng hôn mơ màng */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fdf4ff]/20 via-[#fae8ff]/40 to-transparent" />
      
      {cloudData.map(cloud => (
        <CSSCloud key={cloud.id} {...cloud} />
      ))}
    </div>
  );
});

// Vầng trăng toả sáng
const Moon = ({ scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const [clicked, setClicked] = useState(false);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute top-[8%] right-[12%] pointer-events-auto cursor-pointer z-10"
      onClick={() => {
        if (clicked) return;
        setClicked(true);
        setTimeout(() => setClicked(false), 2000);
      }}
    >
      <motion.div
        className="w-[90px] h-[90px] rounded-full"
        style={{
          boxShadow: 'inset -15px -15px 0 0 #fbcfe8',
          backgroundColor: 'transparent'
        }}
        animate={clicked ? { 
          boxShadow: 'inset -15px -15px 0 0 #fdf6e3, 0 0 40px 20px rgba(253, 246, 227, 0.8)' 
        } : { 
          boxShadow: 'inset -15px -15px 0 0 #fbcfe8, 0 0 0px 0px rgba(251, 207, 232, 0)'
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};
// Lớp chăn đệm ở đáy cảnh
const BlanketBase = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-[25vh] opacity-35 pointer-events-none z-0"
      style={{
        backgroundColor: '#7a1d4f',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1.5px)',
        backgroundSize: '18px 18px',
        borderTopLeftRadius: '50% 20%',
        borderTopRightRadius: '50% 30%',
      }}
    />
  );
};

// Lớp Hero phân tách Sân khấu chiều sâu
const HeroImage = ({ scrollYProgress }) => {
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 350]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[45%] -translate-y-1/2 w-[clamp(260px,42vw,560px)] aspect-square pointer-events-none z-10 flex items-center justify-center">
       {/* Lớp nền xa */}
       <div 
         style={{ 
           y: yBg, 
           transform: 'translate(calc(var(--mouse-x-pct, 0) * 10px), calc(var(--mouse-y-pct, 0) * 10px))' 
         }}
         className="absolute w-[140%] h-[140%] bg-pink-400/30 blur-[20px] rounded-full mix-blend-screen"
       />
       
       {/* Lớp Hero chính */}
       <motion.div 
         style={{ y: yHero }}
         
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
         className="relative w-full h-full pointer-events-auto"
       >
         <img 
           src={resolveSnoopyAsset(SNOOPY_SCENE_1.hero)} 
           alt="Snoopy thư giãn"
           className="w-full h-full object-contain"
           style={{ filter: "drop-shadow(0 25px 35px rgba(59,10,42,0.5))" }}
         />
       </motion.div>
       
       {/* Lớp tiền cảnh gần */}
       <div 
         style={{ 
           y: yFront, 
           transform: 'translate(calc(var(--mouse-x-pct, 0) * 25px), calc(var(--mouse-y-pct, 0) * 25px))' 
         }}
         className="absolute bottom-[-10%] left-[-10%] w-[120%] h-20 flex justify-around items-center"
       >
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />
          <div className="w-4 h-4 bg-pink-200 rounded-full shadow-[0_0_15px_#fbcfe8] mb-8" />
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
       </div>
    </div>
  );
};

// Snoopy ngủ gật
const SleepSnoopy = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="absolute z-20" style={{ top: "18%", left: "8%", width: 170, height: 170 }}>
      {/* Vòng tròn mộng mơ */}
      <AnimatePresence>
        {clickCount > 0 && [1, 2, 3].map(i => (
          <motion.div
            key={`${clickCount}-${i}`}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], y: -50 - (i * 30), scale: 1 + (i * 0.2) }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.3, ease: "easeOut" }}
            className="absolute rounded-full border-2 border-pink-200 bg-white/20 pointer-events-none"
            style={{
              width: 15 + i * 5,
              height: 15 + i * 5,
              top: '20%',
              right: '20%'
            }}
          />
        ))}
      </AnimatePresence>
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_1.items[0])}
        alt="Snoopy ngủ"
        size={170}
        top="0" left="0"
        burstColor="#f9c9d9"
        onClickExtra={() => setClickCount(c => c + 1)}
      />
    </div>
  );
};

// Snoopy hớt hải chạy vội
const RushSnoopy = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="absolute z-20" style={{ top: "calc(60% + 2rem)", right: "10%", width: 140, height: 140 }}>
      {/* Vệt tốc độ chạy */}
      <AnimatePresence>
        {clickCount > 0 && [1, 2, 3, 4].map(i => (
          <motion.div
            key={`${clickCount}-${i}`}
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: [0, 1, 0], x: 40, width: 30 + i * 10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bg-white/60 h-0.5 pointer-events-none"
            style={{
              top: `${20 + i * 15}%`,
              right: '80%',
              transform: 'rotate(-5deg)'
            }}
          />
        ))}
      </AnimatePresence>
      {/* Giật mình chạy vụt qua */}
      <motion.div
        animate={clickCount > 0 ? { x: [0, -40, 0] } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <SnoopyFloatingImage
          src={resolveSnoopyAsset(SNOOPY_SCENE_1.items[1])}
          alt="Snoopy trễ giờ"
          size={140}
          top="0" left="0"
          burstColor="#ffffff"
          onClickExtra={() => setClickCount(c => c + 1)}
        />
      </motion.div>
    </div>
  );
};

// Snoopy toát mồ hôi
const HotSnoopy = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div 
      className="absolute z-20" 
      style={{ bottom: "calc(-4% + 7rem)", left: "calc(55% - 57rem)", width: 150, height: 150 }}
    >
      {/* Giọt mồ hôi rớt xuống */}
      <AnimatePresence>
        {clickCount > 0 && [1, 2, 3].map(i => (
          <motion.div
            key={`${clickCount}-${i}`}
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: 30, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeIn" }}
            className="absolute bg-blue-100/80 z-30 pointer-events-none"
            style={{
              width: 6,
              height: 10,
              top: '10%',
              left: `${30 + i * 15}%`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            }}
          />
        ))}
      </AnimatePresence>

      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_1.items[2])}
        alt="Snoopy toát mồ hôi"
        size={150}
        top="0" left="0"
        burstColor="#fde68a"
        onClickExtra={() => setClickCount(c => c + 1)}
      />
    </div>
  );
};


const DreamBubble = ({ left, top, size, delay, duration }) => {
  const [popped, setPopped] = useState(false);

  return (
    <AnimatePresence>
      {!popped && (
        <motion.div
          className="absolute rounded-full border border-white/40 bg-white/10 backdrop-blur-sm cursor-pointer pointer-events-auto shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]"
          style={{ left, top, width: size, height: size }}
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
          onClick={() => setPopped(true)}
          exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.2 } }}
        >
           <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DreamBubbles = memo(() => {
  const bubbles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      top: `${20 + prand(i) * 60}%`,
      left: `${10 + prand(i + 10) * 80}%`,
      size: prand(i + 20) * 40 + 30,
      delay: prand(i + 30) * 2,
      duration: prand(i + 40) * 4 + 4
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {bubbles.map(b => <DreamBubble key={b.id} {...b} />)}
    </div>
  );
});

const sceneTheme = {
  gradientClass: 'from-pink-100 via-white to-violet-100',
  glowColor: 'rgba(251,207,232,0.5)',
};

// KHUNG CẢNH 1: GÓC MỘNG MƠ
const SnoopyScene1Dreamy = () => {
  const containerRef = useRef(null);
  
  // Tối ưu hiệu năng: Dừng hoạt ảnh nếu scene không nằm trong viewport
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  
  // Đoạn cuộn nội bộ của scene này
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div 
      ref={(el) => {
        containerRef.current = el;
        inViewRef(el);
      }}
      className={`relative w-full h-[130vh] overflow-hidden ${!inView ? 'pause-animations' : ''}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
      }}
    >
      <Moon scrollYProgress={scrollYProgress} />
      <Starfield scrollYProgress={scrollYProgress} />
      <Clouds />
      <DreamBubbles />
      <BlanketBase />
      
      <HeroImage scrollYProgress={scrollYProgress} />
      <SleepSnoopy />
      <RushSnoopy />
      <HotSnoopy />

      <StoryNote
        type="spoken"
        lines={[
          "em có hay đọc lại mấy bức thư anh gửi cho em hông?",
          "anh thì có, lâu lâu cứ lấy mấy bức thư em gửi ra đọc",
        ]}
        position={{ top: 'calc(4% + 10rem)' }}
        theme={sceneTheme}
        variant="starlight-twinkle"
        maxWidth="max-w-md"
        zIndex={22}
      />
      <StoryNote
        type="song"
        lines={["What we have is timeless", "My love is endless."]}
        songTitle="Beautiful In White"
        songArtist="Westlife"
        position={{ top: 'calc(80% + 3rem)' }}
        theme={sceneTheme}
        variant="starlight-twinkle"
        maxWidth="max-w-sm"
        zIndex={22}
      />
    </div>
  );
};

export default SnoopyScene1Dreamy;
