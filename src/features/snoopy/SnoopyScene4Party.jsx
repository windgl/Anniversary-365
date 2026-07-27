 
// src/features/snoopy/SnoopyScene4Party.jsx
import { memo, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SNOOPY_SCENE_4, resolveSnoopyAsset } from './snoopyConstants';
import SnoopyFloatingImage from './SnoopyFloatingImage';
import StoryNote from '../../components/StoryNote';

const sceneTheme = {
  gradientClass: 'from-amber-100 via-pink-200 to-fuchsia-200',
  glowColor: 'rgba(251,207,232,0.5)',
};

// Hàm giả ngẫu nhiên
const prand = (seed) => {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// Cơn mưa Confetti
const ConfettiRain = memo(() => {
  const pieces = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 20 : 35;
    return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${prand(i) * 100}%`,
    duration: `${prand(i + 1) * 6 + 6}s`,
    delay: `-${prand(i + 2) * 10}s`,
    color: ['#f472b6', '#ffffff', '#fef08a', '#db2777'][Math.floor(prand(i + 3) * 4)],
    isTriangle: prand(i + 4) > 0.5,
    size: prand(i + 5) * 5 + 6,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes partyConfettiFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(160vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left,
            animation: `partyConfettiFall ${p.duration} linear infinite ${p.delay}`
          }}
        >
          {p.isTriangle ? (
            <div 
              style={{
                width: 0, height: 0,
                borderLeft: `${p.size/2}px solid transparent`,
                borderRight: `${p.size/2}px solid transparent`,
                borderBottom: `${p.size}px solid ${p.color}`
              }}
            />
          ) : (
            <div 
              style={{
                width: p.size * 0.8,
                height: p.size * 1.5,
                backgroundColor: p.color
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
});

// Dây đèn tiệc (Fairy lights)
const FairyLights = memo(() => {
  const lights = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    cx: 5 + i * 8, // ~0 to 100
    cy: 20 + Math.sin(i * 0.8) * 10,
    delay: `${prand(i) * 2}s`
  })), []);

  return (
    <div className="absolute top-[20%] left-0 w-full h-[30vh] pointer-events-none z-0">
       <style>{`
        @keyframes fairyTwinkle {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 2px rgba(253, 224, 71, 0.5)); transform: scale(0.8); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(253, 224, 71, 1)); transform: scale(1.2); }
        }
      `}</style>
      <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
        {/* Dây treo */}
        <path d="M-5,25 Q20,40 45,20 T105,25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" />
        
        {/* Bóng đèn */}
        {lights.map(l => (
          <g key={l.id} transform={`translate(${l.cx}, ${l.cy})`}>
            <line x1="0" y1="-2" x2="0" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
            <circle 
              cx="0" cy="0" r="0.8" 
              fill="#fef08a"
              style={{
                animation: `fairyTwinkle 1.5s infinite ${l.delay}`
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
});

// Đàn Bướm Sáng Phát Quang
const GlowingButterflies = memo(() => {
  const butterflies = useMemo(() => [
    { id: 1, top: '30%', left: '20%', scale: 1.2, duration: 4, delay: 0 },
    { id: 2, top: '60%', left: '70%', scale: 1.5, duration: 5, delay: 1 },
    { id: 3, top: '20%', left: '80%', scale: 0.9, duration: 3.5, delay: 2 },
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {butterflies.map(b => (
        <motion.div
          key={b.id}
          className="absolute drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
          style={{ top: b.top, left: b.left, transform: `scale(${b.scale})` }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        >
          <motion.svg width="30" height="30" viewBox="0 0 100 100" className="fill-white opacity-90">
            {/* Cánh trái */}
            <motion.path 
              d="M50,50 Q10,10 20,40 Q10,70 50,50 Z" 
              animate={{ scaleX: [1, 0.3, 1] }} 
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }} 
              style={{ originX: "50px", originY: "50px" }}
            />
            {/* Cánh phải */}
            <motion.path 
              d="M50,50 Q90,10 80,40 Q90,70 50,50 Z" 
              animate={{ scaleX: [1, 0.3, 1] }} 
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: "50px", originY: "50px" }}
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
});

// Sàn tiệc với kim tuyến rơi vãi
const PartyFloor = memo(() => {
  const litters = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 24 : 40;
    return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: prand(i) * 100,
    y: prand(i + 100) * 100,
    rotate: prand(i + 200) * 360,
    color: ['#fef08a', '#fbcfe8', '#ffffff'][Math.floor(prand(i + 300) * 3)]
    }));
  }, []);

  return (
    <div 
      className="absolute bottom-0 left-0 w-full h-[25vh] pointer-events-none z-0 overflow-hidden"
      style={{
      }}
    >
      <div className="absolute inset-0 bg-[#3b0a2a]/40" style={{ borderTopLeftRadius: '50% 10%', borderTopRightRadius: '50% 10%' }} />
      {litters.map(l => (
        <div 
          key={l.id}
          className="absolute rounded-full"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            width: 8 + prand(l.id)*6,
            height: 2,
            backgroundColor: l.color,
            transform: `rotate(${l.rotate}deg)`,
            opacity: 0.6 + prand(l.id+1)*0.4
          }}
        />
      ))}
    </div>
  );
});

// Snoopy Hò Reo (Điểm nhấn pháo giấy)
const CheerSnoopy = () => {
  const [bursts, setBursts] = useState([]);

  const handleClick = useCallback(() => {
    // Pháo giấy lớn toả ra 4 phía
    const newBursts = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      angle: prand(i) * Math.PI * 2,
      distance: 100 + prand(i+1) * 150,
      size: 8 + prand(i+2) * 8,
      type: ['star', 'circle', 'heart'][Math.floor(prand(i+3) * 3)],
      color: ['#f472b6', '#ffffff', '#fef08a', '#fb7185'][Math.floor(prand(i+4) * 4)],
      rotate: 180 + Math.random() * 180
    }));

    setBursts(prev => [...prev, ...newBursts]);
  }, []);

  const handleAnimationComplete = (id) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  const renderShape = (type, color, size) => {
    if (type === 'heart') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      );
    }
    if (type === 'star') {
      return (
        <div style={{ width: size, height: size, backgroundColor: color, clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
      );
    }
    return <div style={{ width: size, height: size, backgroundColor: color, borderRadius: '50%' }} />;
  };

  return (
    <div className="absolute z-20 left-1/2 -translate-x-1/2" style={{ top: "40%", width: 185, height: 185 }}>
      <AnimatePresence>
        {bursts.map(burst => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5, rotate: 0 }}
            animate={{ 
              opacity: 0, 
              x: Math.cos(burst.angle) * burst.distance, 
              y: Math.sin(burst.angle) * burst.distance + 80, // Rơi xuống nhẹ theo trọng lực
              scale: 1,
              rotate: burst.rotate
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => handleAnimationComplete(burst.id)}
            className="absolute top-1/2 left-1/2 pointer-events-none -mt-4 -ml-4"
          >
            {renderShape(burst.type, burst.color, burst.size)}
          </motion.div>
        ))}
      </AnimatePresence>
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_4.items[0])}
        alt="Snoopy ăn mừng bữa tiệc"
        size={185}
        top="0" left="0"
        burstColor="#f472b6"
        onClickExtra={handleClick}
      />
    </div>
  );
};

// Snoopy Đeo Nơ Đỏ
const BowTieSnoopy = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="absolute z-20" style={{ top: "68%", left: "15%", width: 150, height: 150 }}>
      <AnimatePresence>
        {clickCount > 0 && [0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.div
              key={`${clickCount}-${i}`}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.5, 1.2, 0], 
                x: Math.cos(rad) * 80, 
                y: Math.sin(rad) * 80,
                rotate: 360
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -ml-3 -mt-3 pointer-events-none"
            >
              <div style={{ width: 24, height: 24, backgroundColor: '#fbbf24', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
            </motion.div>
          );
        })}
      </AnimatePresence>
      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_4.items[1])}
        alt="Snoopy đeo nơ đỏ"
        size={150}
        top="0" left="0"
        burstColor="#fbbf24"
        burstShape="star"
        onClickExtra={() => setClickCount(c => c + 1)}
      />
    </div>
  );
};

// Snoopy Khóc Cảm Động
const CrySnoopy = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="absolute z-20" style={{ top: "60%", right: "18%", width: 145, height: 145 }}>
      {/* Giọt lệ hạnh phúc */}
      <AnimatePresence>
        {clickCount > 0 && (
          <motion.div
            key={`tear-${clickCount}`}
            initial={{ opacity: 0, y: -20, x: -10, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: 40, x: -10, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeIn" }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-30"
          >
            <div 
              style={{
                width: 12, height: 12,
                background: 'linear-gradient(135deg, #ffffff 0%, #bae6fd 100%)',
                borderRadius: '0 50% 50% 50%',
                transform: 'rotate(45deg)',
                boxShadow: '0 2px 4px rgba(186,230,253,0.5)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cái ôm vô hình bằng ánh sáng ấm */}
      <AnimatePresence>
        {clickCount > 0 && Array.from({ length: 6 }).map((_, i) => {
          // Xếp thành hình vòng cung phía trên ảnh
          const angle = Math.PI + (i / 5) * Math.PI; // PI to 2PI
          return (
            <motion.div
              key={`hug-${clickCount}-${i}`}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0], 
                x: Math.cos(angle) * 100, 
                y: Math.sin(angle) * 100 + 20, 
                scale: 1 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#fcd34d] pointer-events-none -ml-2 -mt-2"
              style={{ filter: 'blur(2px)', boxShadow: '0 0 10px #fcd34d' }}
            />
          );
        })}
      </AnimatePresence>

      <SnoopyFloatingImage
        src={resolveSnoopyAsset(SNOOPY_SCENE_4.items[2])}
        alt="Snoopy cảm động hạnh phúc"
        size={145}
        top="0" left="0"
        burstColor="#bae6fd"
        onClickExtra={() => setClickCount(c => c + 1)}
      />
    </div>
  );
};

// KHUNG CẢNH 4: BỮA TIỆC NHỎ
const SnoopyScene4Party = () => {
  const containerRef = useRef(null);
  
  // Tối ưu hiệu năng
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  return (
    <div 
      ref={(el) => {
        containerRef.current = el;
        inViewRef(el);
      }}
      className={`relative w-full h-[150vh] overflow-hidden ${!inView ? 'pause-animations' : ''}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
      }}
    >
      <PartyFloor />
      <FairyLights />
      <GlowingButterflies />
      <ConfettiRain />
      
      <CheerSnoopy />
      <BowTieSnoopy />
      <CrySnoopy />

      {/* LƯU Ý QUAN TRỌNG: CheerSnoopy đang căn giữa tuyệt đối ở top 40%. Không được đặt StoryNote ở khoảng top 35-50% căn giữa để tránh đè lên nút click bắn pháo giấy của Snoopy! */}
      <StoryNote
        type="spoken"
        lines={["cảm ơn em đã luôn quan tâm, lo lắng cho anh"]}
        position={{ top: 'calc(3% + 6rem)' }}
        theme={sceneTheme}
        variant="confetti-pop"
        maxWidth="max-w-lg"
        zIndex={22}
      />
      <StoryNote
        type="song"
        lines={["By your side, I'll be your seasons."]}
        songTitle="seasons"
        songArtist="Wave To Earth"
        position={{ top: 'calc(78% - 2rem)' }}
        theme={sceneTheme}
        variant="confetti-pop"
        maxWidth="max-w-sm"
        zIndex={22}
      />
    </div>
  );
};

export default SnoopyScene4Party;
