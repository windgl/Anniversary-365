 
// src/features/snoopy/SnoopyScene2Garden.jsx
import { memo, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SNOOPY_SCENE_2, resolveSnoopyAsset } from './snoopyConstants';
import SnoopyFloatingImage from './SnoopyFloatingImage';
import StoryNote from '../../components/StoryNote';

const sceneTheme = {
  gradientClass: 'from-pink-200 via-rose-100 to-white',
  glowColor: 'rgba(249,168,212,0.5)',
};

// Hàm giả ngẫu nhiên
const prand = (seed) => {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// 2 cây hoa đào (được trang trí bằng các cánh hoa rũ xuống)
const CherryTrees = memo(() => {
  const branches = useMemo(() => [
    { id: 1, top: '-5%', left: '-10%', width: '40%', height: '30%', rotate: -10, color: '#fbcfe8' },
    { id: 2, top: '-10%', right: '-5%', width: '50%', height: '35%', rotate: 15, color: '#f9a8d4' },
    { id: 3, top: '5%', left: '15%', width: '30%', height: '25%', rotate: -5, color: '#f472b6' },
  ], []);

  const blossoms = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${prand(i) * 30}%`,
      left: `${prand(i + 100) * 100}%`,
      size: prand(i + 200) * 15 + 10,
      rotate: prand(i + 300) * 360,
      opacity: prand(i + 400) * 0.5 + 0.5,
      color: ['#fbcfe8', '#f9a8d4', '#f472b6', '#ffffff'][Math.floor(prand(i + 500) * 4)],
      delay: prand(i + 600) * 2
    }));
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-[40vh] pointer-events-none z-10 overflow-hidden">
      {/* Cành cây (SVG Shapes) */}
      {branches.map(branch => (
        <div key={branch.id} className="absolute" style={{ 
          top: branch.top, 
          ...(branch.left ? { left: branch.left } : { right: branch.right }),
          width: branch.width, 
          height: branch.height, 
          transform: `rotate(${branch.rotate}deg)`,
          opacity: 0.8
        }}>
          <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
             <path d="M0,0 Q100,50 200,20 Q150,60 0,20 Z" fill={branch.color} opacity="0.6" />
          </svg>
        </div>
      ))}

      {/* Hoa anh đào tĩnh ở phần trên */}
      {blossoms.map(b => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            rotate: b.rotate
          }}
          animate={{ scale: [1, 1.1, 1], rotate: [b.rotate, b.rotate + 10, b.rotate] }}
          transition={{ duration: 4, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            <path d="M50,10 C60,30 90,40 70,60 C90,80 60,90 50,70 C40,90 10,80 30,60 C10,40 40,30 50,10 Z" fill={b.color} />
            <circle cx="50" cy="50" r="8" fill="#fdf2f8" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
});

// Cánh hoa rơi liên tục
const FallingPetals = memo(() => {
  const petals = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 15 : 25;
    return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${prand(i) * 100}%`,
    animationDuration: `${prand(i + 1) * 6 + 10}s`,
    animationDelay: `-${prand(i + 2) * 10}s`,
    swayDuration: `${prand(i + 3) * 2 + 3}s`,
    swayDelay: `-${prand(i + 4) * 2}s`,
    size: prand(i + 5) * 6 + 8,
    color: ['#f9a8d4', '#fbcfe8', '#f472b6'][Math.floor(prand(i + 6) * 3)]
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes snoopyPetalFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(170vh) rotate(360deg); opacity: 0; }
        }
        @keyframes snoopyPetalSway {
          0%, 100% { margin-left: -30px; }
          50% { margin-left: 30px; }
        }
      `}</style>
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left,
            animation: `snoopyPetalFall ${p.animationDuration} linear infinite ${p.animationDelay}, snoopyPetalSway ${p.swayDuration} ease-in-out infinite alternate ${p.swayDelay}`
          }}
        >
          <div 
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: '50% 0 50% 50%',
              transform: 'rotate(45deg)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          />
        </div>
      ))}
    </div>
  );
});

// Nền bãi cỏ hồng (chuyển thành núi watercolor)
const PinkHills = memo(() => {
  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-[60vh] pointer-events-none z-0"
      style={{
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="none" className="absolute bottom-0">
        {/* Layer 1 - Lightest, furthest back */}
        <path fill="#fce7f3" fillOpacity="0.8" d="M0,200 L0,600 L1440,600 L1440,250 C1200,100 1000,350 720,200 C450,50 250,300 0,200 Z"></path>
        {/* Layer 2 */}
        <path fill="#fbcfe8" fillOpacity="0.8" d="M0,350 L0,600 L1440,600 L1440,300 C1100,450 900,200 600,350 C350,480 150,250 0,350 Z"></path>
        {/* Layer 3 */}
        <path fill="#f9a8d4" fillOpacity="0.85" d="M0,450 L0,600 L1440,600 L1440,400 C1250,300 1050,500 750,400 C400,250 200,550 0,450 Z"></path>
        {/* Layer 4 - Darkest, front */}
        <path fill="#f472b6" fillOpacity="0.9" d="M0,550 L0,600 L1440,600 L1440,500 C1150,600 950,450 650,550 C350,650 150,480 0,550 Z"></path>
      </svg>
    </div>
  );
});

// Lớp Hero phân tách Sân khấu chiều sâu
const HeroImage = ({ scrollYProgress }) => {
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 380]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[50%] -translate-y-1/2 w-[clamp(260px,44vw,580px)] aspect-square pointer-events-none z-10 flex items-center justify-center">
       {/* Lớp nền xa */}
       <div 
         style={{ 
           y: yBg, 
           transform: 'translate(calc(var(--mouse-x-pct, 0) * 12px), calc(var(--mouse-y-pct, 0) * 12px))' 
         }}
         className="absolute w-[130%] h-[130%] flex justify-between items-center opacity-45 blur-[22px]"
       >
         <div className="w-[45%] h-[45%] bg-[#f472b6] rounded-full mix-blend-screen -ml-10" />
         <div className="w-[35%] h-[35%] bg-[#fbcfe8] rounded-full mix-blend-screen -mr-10 mt-16" />
       </div>
       
       {/* Lớp Hero chính */}
       <motion.div 
         style={{ y: yHero }}
         
         transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
         className="relative w-full h-full pointer-events-auto"
       >
         <img 
           src={resolveSnoopyAsset(SNOOPY_SCENE_2.hero)} 
           alt="Snoopy trong vườn anh đào"
           className="w-full h-full object-contain"
           style={{ filter: "drop-shadow(0 25px 35px rgba(107,20,65,0.4))" }}
         />
       </motion.div>
       
       {/* Lớp tiền cảnh gần */}
       <div 
         style={{ 
           y: yFront, 
           transform: 'translate(calc(var(--mouse-x-pct, 0) * 28px), calc(var(--mouse-y-pct, 0) * 28px))' 
         }}
         className="absolute bottom-[-5%] left-[-10%] w-[120%] h-24 flex justify-around items-center"
       >
          <div className="w-5 h-5 bg-pink-300 rotate-45 rounded-[50%_0_50%_50%] shadow-[0_5px_15px_rgba(244,114,182,0.4)]" />
          <div className="w-8 h-8 bg-pink-200 rotate-[15deg] rounded-[50%_0_50%_50%] shadow-[0_5px_20px_rgba(251,207,232,0.5)] mb-10" />
          <div className="w-6 h-6 bg-pink-400 -rotate-12 rounded-[50%_0_50%_50%] shadow-[0_5px_15px_rgba(244,114,182,0.4)]" />
       </div>
    </div>
  );
};

// Snoopy ôm Woodstock
const HuggSnoopy = () => {
  const [bursts, setBursts] = useState([]);

  const handleClick = useCallback(() => {
    const newBursts = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      angle: (i / 10) * Math.PI * 2,
      distance: 80 + Math.random() * 70,
      size: 10 + Math.random() * 8,
      rotate: 180 + Math.random() * 180
    }));
    setBursts(prev => [...prev, ...newBursts]);
  }, []);

  const handleAnimationComplete = (id) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="absolute z-20" style={{ top: "20%", left: "12%", width: 190, height: 190 }}>
      <AnimatePresence>
        {bursts.map(burst => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5, rotate: 0 }}
            animate={{ 
              opacity: 0, 
              x: Math.cos(burst.angle) * burst.distance, 
              y: Math.sin(burst.angle) * burst.distance + 20,
              scale: 1.5,
              rotate: burst.rotate
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => handleAnimationComplete(burst.id)}
            className="absolute top-1/2 left-1/2 bg-[#f472b6] pointer-events-none"
            style={{ 
              width: burst.size, 
              height: burst.size, 
              marginLeft: -burst.size/2, 
              marginTop: -burst.size/2, 
              borderRadius: '50% 0 50% 50%' 
            }}
          />
        ))}
      </AnimatePresence>
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_2.items[0])}
        alt="Snoopy ôm Woodstock"
        size={190}
        top="0" left="0"
        burstColor="#f472b6"
        burstShape="petal"
        onClickExtra={handleClick}
      />
    </div>
  );
};

// Snoopy ngắm nhìn
const SeeSnoopy = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="absolute z-20" style={{ top: "68%", right: "14%", width: 150, height: 150 }}>
      <AnimatePresence>
        {clickCount > 0 && (
          <motion.div
            key={clickCount}
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 w-[150px] h-[150px] -ml-[75px] -mt-[75px] rounded-full border-[3px] border-[#fff59d] pointer-events-none"
          />
        )}
      </AnimatePresence>
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_2.items[1])}
        alt="Snoopy ngắm nhìn"
        size={150}
        top="0" left="0"
        burstColor="#fff59d"
        onClickExtra={() => setClickCount(c => c + 1)}
      />
    </div>
  );
};

// Snoopy ăn mừng
const YaySnoopy = () => {
  return (
    <div 
      className="absolute z-20" 
      style={{ top: "45%", left: "5%", width: 175, height: 175 }}
    >
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_2.items[2])}
        alt="Snoopy ăn mừng"
        size={175}
        top="0" left="0"
        burstColor="#fbbf24"
        burstShape="star"
      />
    </div>
  );
};

// KHUNG CẢNH 2: VƯỜN ANH ĐÀO
const SnoopyScene2Garden = () => {
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
      className={`relative w-full h-[200vh] overflow-hidden ${!inView ? 'pause-animations' : ''}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
      }}
    >
      <CherryTrees />
      <FallingPetals />
      <PinkHills />
      
      <HeroImage scrollYProgress={scrollYProgress} />
      <HuggSnoopy />
      <SeeSnoopy />
      <YaySnoopy />

      <StoryNote
        type="spoken"
        lines={["đáng iêu nhất thế gian chỉ có Bíp Bíp thôi đấy"]}
        position={{ top: 'calc(3% + 20rem)' }}
        theme={sceneTheme}
        variant="petal-drift"
        maxWidth="max-w-lg"
        zIndex={22}
      />
      <StoryNote
        type="song"
        lines={["Will you be forever with me?"]}
        songTitle="blue"
        songArtist="yung kai"
        position={{ top: 'calc(50% - clamp(130px, 22vw, 290px) - 120px + 20rem)' }}
        theme={sceneTheme}
        variant="petal-drift"
        maxWidth="max-w-sm"
        zIndex={22}
      />
    </div>
  );
};

export default SnoopyScene2Garden;
