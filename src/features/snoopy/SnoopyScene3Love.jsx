 
// src/features/snoopy/SnoopyScene3Love.jsx
import { memo, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useAnimationFrame } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SNOOPY_SCENE_3, resolveSnoopyAsset } from './snoopyConstants';
import SnoopyFloatingImage from './SnoopyFloatingImage';
import { useMouseTracker } from '../../contexts/MouseTrackerContext';
import StoryNote from '../../components/StoryNote';

const sceneTheme = {
  gradientClass: 'from-rose-900 via-pink-900 to-red-950',
  glowColor: 'rgba(255,255,255,0.6)',
};


// Hàm giả ngẫu nhiên
const prand = (seed) => {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// SVG Path cho Trái Tim
const HeartIcon = ({ className, color }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

// Trái tim bay lơ lửng
const FloatingHearts = memo(() => {
  const hearts = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 12 : 20;
    return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${prand(i) * 100}%`,
    size: prand(i + 1) * 12 + 10,
    delay: `-${prand(i + 2) * 20}s`,
    duration: `${prand(i + 3) * 15 + 15}s`,
    swayDuration: `${prand(i + 4) * 4 + 4}s`,
    color: ['#f8bbd0', '#f48fb1', '#ffffff'][Math.floor(prand(i + 5) * 3)]
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes loveFloatUp {
          0% { transform: translateY(110vh) rotate(-15deg); opacity: 0; }
          10% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-10vh) rotate(15deg); opacity: 0; }
        }
        @keyframes loveSway {
          0%, 100% { margin-left: -20px; }
          50% { margin-left: 20px; }
        }
      `}</style>
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute bottom-0"
          style={{
            left: h.left,
            animation: `loveFloatUp ${h.duration} linear infinite ${h.delay}, loveSway ${h.swayDuration} ease-in-out infinite alternate ${h.delay}`
          }}
        >
          <HeartIcon 
            className="drop-shadow-sm opacity-80" 
            style={{ width: h.size, height: h.size }} 
            color={h.color} 
          />
        </div>
      ))}
    </div>
  );
});

// Bụi lấp lánh
const SparkleDust = memo(() => {
  const sparkles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 18 : 30;
    return Array.from({ length: count }).map((_, i) => ({
    id: i,
    top: `${prand(i) * 100}%`,
    left: `${prand(i + 100) * 100}%`,
    size: prand(i + 200) * 3 + 2,
    delay: `${prand(i + 300) * 4}s`,
    duration: `${prand(i + 400) * 2 + 2}s`
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <style>{`
        @keyframes loveSparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `loveSparkle ${s.duration} ease-in-out infinite ${s.delay}`
          }}
        />
      ))}
    </div>
  );
});

// Nền Khăn Picnic caro (Gingham) và Hoa Tulip
const PicnicBlanket = memo(() => {
  const tulips = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${(i / 60) * 100 + prand(i) * 5}%`,
      height: 120 + prand(i + 100) * 80,
      scale: 0.6 + prand(i + 200) * 0.4,
      sway: prand(i + 300) * 4 + 2,
      delay: prand(i + 400) * 2
    }));
  }, []);

  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-[67.5vh] z-0 flex justify-center pointer-events-none overflow-hidden"
      style={{
      }}
    >
      {/* Khăn Picnic (Gingham) */}
      <div 
        className="w-[120%] h-full rounded-t-[50%] md:rounded-t-[150px] shadow-[0_-10px_30px_rgba(244,143,177,0.2)] absolute bottom-0"
        style={{
          backgroundColor: '#fce4ec',
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(244,143,177,0.3) 12px, rgba(244,143,177,0.3) 24px),
            repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(244,143,177,0.3) 12px, rgba(244,143,177,0.3) 24px)
          `
        }}
      />
      
      {/* Hand-drawn Tulips */}
      {tulips.map(t => (
        <motion.div
          key={t.id}
          className="absolute"
          style={{ 
            left: t.left,
            bottom: 'calc(-10% + 2rem)',
            transformOrigin: 'bottom center',
            height: t.height,
            width: 80 * t.scale,
            zIndex: 10
          }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: t.sway, repeat: Infinity, ease: "easeInOut", delay: t.delay }}
        >
          <svg viewBox="0 0 100 200" width="100%" height="100%" preserveAspectRatio="none" className="drop-shadow-md">
            {/* Stem */}
            <path d="M50,100 Q45,150 50,200" fill="none" stroke="#7cb342" strokeWidth="8" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M50,150 Q20,120 30,80 Q60,110 50,150" fill="#aed581" opacity="0.8"/>
            <path d="M50,170 Q80,140 70,100 Q40,130 50,170" fill="#8bc34a" opacity="0.8"/>
            {/* Flower - Hand drawn watercolor style */}
            <path d="M25,80 Q25,30 50,40 Q75,30 75,80 Q75,110 50,110 Q25,110 25,80" fill="#f48fb1" opacity="0.9"/>
            <path d="M40,75 Q40,40 50,40 Q60,40 60,75 Q60,100 50,100 Q40,100 40,75" fill="#f06292" opacity="0.8"/>
            {/* Outline strokes for hand-drawn feel */}
            <path d="M23,80 Q25,28 50,38" fill="none" stroke="#e91e63" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            <path d="M77,80 Q75,28 50,38" fill="none" stroke="#e91e63" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            <path d="M25,100 Q50,115 75,100" fill="none" stroke="#e91e63" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
});

// Dải ruy băng trang trí
const Ribbons = memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <svg className="absolute top-[-5%] left-[-5%] w-[40vw] max-w-[300px] opacity-60" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="ribbonGradL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f48fb1" />
          </linearGradient>
        </defs>
        <path d="M0,50 Q50,80 80,30 T180,60 T220,-20" fill="none" stroke="url(#ribbonGradL)" strokeWidth="15" strokeLinecap="round" opacity="0.7"/>
        <path d="M20,70 Q70,100 90,50 T170,90 T200,10" fill="none" stroke="url(#ribbonGradL)" strokeWidth="8" strokeLinecap="round" opacity="0.4"/>
      </svg>
      <svg className="absolute top-[-2%] right-[-5%] w-[35vw] max-w-[250px] opacity-60 transform scale-x-[-1]" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="ribbonGradR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f48fb1" />
          </linearGradient>
        </defs>
        <path d="M0,40 Q60,90 90,40 T190,70 T240,-10" fill="none" stroke="url(#ribbonGradR)" strokeWidth="12" strokeLinecap="round" opacity="0.7"/>
      </svg>
    </div>
  );
});

// Lớp Hero phân tách Sân khấu chiều sâu
const HeroImage = ({ scrollYProgress }) => {
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 350]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(50%+15rem)] -translate-y-1/2 w-[clamp(260px,44vw,580px)] aspect-square pointer-events-none z-10 flex items-center justify-center">
       {/* Lớp nền xa (Bokeh) */}
       <div 
         style={{ 
           y: yBg, 
           transform: 'translate(calc(var(--mouse-x-pct, 0) * 15px), calc(var(--mouse-y-pct, 0) * 15px))' 
         }}
         className="absolute w-[120%] h-[120%] flex justify-around items-center opacity-60 blur-[25px]"
       >
         <div className="w-[40%] h-[40%] bg-[#fbcfe8] rounded-full mix-blend-screen -ml-10" />
         <div className="w-[50%] h-[50%] bg-[#fce4ec] rounded-full mix-blend-screen mt-20" />
         <div className="w-[30%] h-[30%] bg-[#f48fb1] rounded-full mix-blend-screen -mr-10 -mt-10" />
       </div>
       
       {/* Lớp Hero chính */}
       <motion.div 
         style={{ y: yHero }}
         
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
         className="relative w-full h-full pointer-events-auto"
       >
         <img 
           src={resolveSnoopyAsset(SNOOPY_SCENE_3.hero)} 
           alt="Snoopy tặng hoa"
           className="w-full h-full object-contain"
           style={{ filter: "drop-shadow(0 30px 40px rgba(244,63,94,0.3))" }}
         />
       </motion.div>
       
       {/* Lớp tiền cảnh gần */}
       <div 
         style={{ 
           y: yFront, 
           transform: 'translate(calc(var(--mouse-x-pct, 0) * 35px), calc(var(--mouse-y-pct, 0) * 35px))' 
         }}
         className="absolute bottom-[5%] left-0 w-full h-24 flex justify-around items-center"
       >
          <HeartIcon className="w-8 h-8 -rotate-12 drop-shadow-[0_5px_15px_rgba(244,143,177,0.6)]" color="#f472b6" />
          <HeartIcon className="w-12 h-12 rotate-12 drop-shadow-[0_5px_20px_rgba(252,228,236,0.8)] mt-10" color="#ffffff" />
          <HeartIcon className="w-10 h-10 -rotate-6 drop-shadow-[0_5px_15px_rgba(244,63,94,0.4)]" color="#f43f5e" />
       </div>
    </div>
  );
};

// Snoopy Hộp Quà rung lên
const GiftSnoopy = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="absolute z-20" style={{ top: "15%", right: "10%", width: 165, height: 165 }}>
      <motion.div
        key={clickCount}
        animate={clickCount > 0 ? { rotate: [0, -4, 4, -4, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <SnoopyFloatingImage
          src={resolveSnoopyAsset(SNOOPY_SCENE_3.items[0])}
          alt="Snoopy tặng quà"
          size={165}
          top="0" left="0"
          burstColor="#f43f5e"
          burstShape="heart"
          onClickExtra={() => setClickCount(c => c + 1)}
        />
      </motion.div>
    </div>
  );
};

// Snoopy Ôm Trái Tim - nhịp đập
const HuggingHeartSnoopy = () => {
  return (
    <div 
      className="absolute z-20" 
      style={{ 
        bottom: "calc(-10% + 6.2rem)", 
        left: "12%", 
        width: 180, 
        height: 180,
      }}
    >
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_3.items[1])}
        alt="Snoopy ôm trái tim"
        size={180}
        top="0" left="0"
        burstColor="#ef4444"
        burstShape="heart"
      />
    </div>
  );
};

// Snoopy Trái Tim hướng chuột
const BeatingHeartSnoopy = ({ inView }) => {
  const mousePosRef = useMouseTracker();
  const containerRef = useRef(null);
  const [flyingHearts, setFlyingHearts] = useState([]);
  const lastSpawnTime = useRef(0);

  useAnimationFrame((time) => {
    if (!inView || !containerRef.current) return;
    
    // Giới hạn spawn rate mỗi 600ms
    if (time - lastSpawnTime.current < 600) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = mousePosRef.current.x;
    const mouseY = mousePosRef.current.y;

    if (mouseX < 0 || mouseY < 0) return; // Chưa có data chuột

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 220) {
      lastSpawnTime.current = time;
      
      const newHeart = {
        id: Date.now() + Math.random(),
        startX: rect.width / 2, // Tương đối so với container
        startY: rect.height / 2,
        targetX: (mouseX - rect.left), // Tương đối so với container
        targetY: (mouseY - rect.top)
      };

      setFlyingHearts(prev => [...prev, newHeart]);
    }
  });

  const handleAnimationComplete = (id) => {
    setFlyingHearts(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div 
      ref={containerRef}
      className="absolute z-20" 
      style={{ 
        bottom: "calc(-2% - 0.3rem)", 
        right: "20%", 
        width: 155, 
        height: 155,
      }}
    >
      <AnimatePresence>
        {flyingHearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, x: heart.startX, y: heart.startY, scale: 0 }}
            animate={{ 
              opacity: 0, 
              x: heart.targetX, 
              y: heart.targetY,
              scale: 1.5,
              rotate: (heart.targetX - heart.startX) > 0 ? 15 : -15
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={() => handleAnimationComplete(heart.id)}
            className="absolute pointer-events-none -ml-3 -mt-3"
          >
            <HeartIcon className="w-6 h-6 drop-shadow-sm" color="#fb7185" />
          </motion.div>
        ))}
      </AnimatePresence>
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_3.items[2])}
        alt="Snoopy nhịp tim"
        size={155}
        top="0" left="0"
        burstColor="#fb7185"
      />
    </div>
  );
};

// KHUNG CẢNH 3: KHU VƯỜN YÊU THƯƠNG
const SnoopyScene3Love = () => {
  const containerRef = useRef(null);
  
  // Tối ưu hiệu năng
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  
  // Đoạn cuộn nội bộ
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
      className={`relative w-full h-[160vh] overflow-hidden ${!inView ? 'pause-animations' : ''}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
      }}
    >
      <FloatingHearts />
      <SparkleDust />
      <PicnicBlanket />
      <Ribbons />
      
      <HeroImage scrollYProgress={scrollYProgress} />
      
      <GiftSnoopy />
      <HuggingHeartSnoopy />
      <BeatingHeartSnoopy inView={inView} />

      <StoryNote
        type="spoken"
        lines={[
          "anh hy vọng là trong tương lai anh và em sẽ có thật nhìu thật nhìu",
          "kỉ niệm đẹp và bên nhau thật thật lâu",
        ]}
        position={{ bottom: 'calc(16% + 35rem)', right: '5%' }}
        theme={sceneTheme}
        variant="none"
        maxWidth="max-w-md"
        zIndex={22}
        textClassName="!text-[16px] sm:!text-[20px] md:!text-[24px]"
      />
      <StoryNote
        type="song"
        lines={[
          "Cause all I need",
          "Is a beauty and a beat",
          "Who can make my life complete.",
        ]}
        songTitle="Beauty and a Beat"
        songArtist="Justin Bieber"
        position={{ bottom: '20%', left: '5%' }}
        theme={sceneTheme}
        variant="heartbeat-glow"
        maxWidth="max-w-sm"
        zIndex={22}
        titleClassName="text-rose-900/60 font-semibold"
      />
    </div>
  );
};

export default SnoopyScene3Love;
