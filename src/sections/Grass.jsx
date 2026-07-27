 
import { useRef, useState, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sprout } from 'lucide-react';
import useAudioSync from '../hooks/useAudioSync';
import TiltCard from '../components/TiltCard';
import LazyVideo from '../components/LazyVideo';
import ChatBox from '../components/ChatBox';
import StoryNote from '../components/StoryNote';
import {
  GRASS_TIMELINE,
  GRASS_CHIIKAWA,
  SECTION_MEDIA,
  MESSAGES_CONFESSION_CHAT,
} from '../utils/constants';

const SWAYING_FLOWER_COLORS = ['#ec4899', '#3b82f6', '#eab308', '#a855f7', '#f43f5e', '#06b6d4', '#e11d48', '#00f5ff', '#00e5ff'];

// ---------- Lời nhắn riêng tư fade ----------
const SelfFadingNote = memo(() => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [30, 0, 0, -30]);

  return (
    <motion.div 
      ref={ref}
      className="absolute z-30 max-w-[200px] sm:max-w-[250px] text-right pointer-events-none"
      style={{ bottom: '25%', right: '4%', opacity, y }}
    >
      <p className="font-lora text-xs sm:text-sm text-emerald-100/60 leading-relaxed drop-shadow-sm">
        "Đôi lúc anh hơi ích kỷ một chút, chỉ muốn mình là người duy nhất nhận được những món quà, nét vẽ dễ thưn và sự đáng yêu của em thôi"
      </p>
    </motion.div>
  );
});

// ---------- Dấu chân phát sáng ----------
const Footprint = memo(({ x, y, rotate, appearStart, scrollYProgress }) => {
  const opacity = useTransform(
    scrollYProgress,
    [appearStart - 0.04, appearStart, appearStart + 0.12, appearStart + 0.2],
    [0, 0.8, 0.8, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [appearStart - 0.03, appearStart, appearStart + 0.08],
    [0.6, 1, 1]
  );

  return (
    <motion.div
      style={{
        left: `calc(50% + ${x})`,
        top: y,
        rotate: rotate,
        opacity,
        scale,
      }}
      className="absolute flex flex-col items-center gap-1 pointer-events-none z-10"
    >
      <div className="flex gap-1">
        <div className="w-1.5 h-2.5 bg-green-200/50 rounded-full" />
        <div className="w-2 h-3 bg-green-200/50 rounded-full -translate-y-1" />
        <div className="w-2 h-3 bg-green-200/50 rounded-full -translate-y-1" />
        <div className="w-1.5 h-2.5 bg-green-200/50 rounded-full" />
      </div>
      <div className="w-7 h-9 bg-green-200/50 rounded-[50%_50%_40%_40%] mt-0.5" />
    </motion.div>
  );
});

// ---------- Dấu chân cún phát sáng ----------
const DogPaw = memo(({ x, y, rotate, appearStart, scrollYProgress }) => {
  const opacity = useTransform(
    scrollYProgress,
    [appearStart - 0.04, appearStart, appearStart + 0.12, appearStart + 0.2],
    [0, 0.8, 0.8, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [appearStart - 0.03, appearStart, appearStart + 0.08],
    [0.6, 1, 1]
  );

  return (
    <motion.div
      style={{
        left: `calc(50% + ${x})`,
        top: y,
        rotate: rotate,
        opacity,
        scale,
      }}
      className="absolute flex flex-col items-center justify-center pointer-events-none z-10"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main pad (đệm thịt lớn: đáy bo tròn, đỉnh hơi lõm) */}
        <path
          d="M 50 42 
             C 32 42, 22 56, 26 73 
             C 30 86, 42 85, 50 79 
             C 58 85, 70 86, 74 73 
             C 78 56, 68 42, 50 42 Z"
          fill="rgba(187, 247, 208, 0.5)"
        />
        {/* 4 small toe pads (4 đệm ngón nhỏ phía trên) */}
        <ellipse cx="23" cy="27" rx="10" ry="14" transform="rotate(-30, 23, 27)" fill="rgba(187, 247, 208, 0.5)" />
        <ellipse cx="40" cy="17" rx="10" ry="14" transform="rotate(-10, 40, 17)" fill="rgba(187, 247, 208, 0.5)" />
        <ellipse cx="60" cy="17" rx="10" ry="14" transform="rotate(10, 60, 17)" fill="rgba(187, 247, 208, 0.5)" />
        <ellipse cx="77" cy="27" rx="10" ry="14" transform="rotate(30, 77, 27)" fill="rgba(187, 247, 208, 0.5)" />
      </svg>
    </motion.div>
  );
});

// ---------- Khóm cỏ đung đưa lớn có kèm hoa ----------
const GrassClump = memo(({ x, top, side = 'left', delay = 0, isSeaGrass = false }) => {
  const sideStyle = side === 'left' ? { left: x, top } : { right: x, top };
  const variant = isSeaGrass ? 'sea' : 'grass';

  const bladeColor1 = isSeaGrass ? '#0f4c75' : '#047857';

  return (
    <div
      style={{ ...sideStyle }}
      className="absolute pointer-events-none z-10 flex flex-col items-center heavy-render"
    >
      <svg
        width="180"
        height="120"
        viewBox="0 0 180 120"
        fill="none"
        className=""
      >
        {/* Lá cỏ 3D đung đưa - Tăng mật độ cỏ và độ sắc nét */}
        <g style={{ transformOrigin: '90px 110px', animation: `sway-clump 4s ${delay}s infinite ease-in-out` }}>
          <path d="M 50 110 Q 30 50 10 30 Q 35 60 55 110" fill={`url(#blade1-${variant})`} />
          <path d="M 70 110 Q 60 40 45 20 Q 65 50 75 110" fill={`url(#blade2-${variant})`} />
          <path d="M 90 110 Q 90 30 80 10 Q 95 40 95 110" fill={`url(#blade1-${variant})`} />
          <path d="M 110 110 Q 120 45 135 25 Q 115 55 105 110" fill={`url(#blade2-${variant})`} />
          <path d="M 130 110 Q 150 60 170 40 Q 145 70 125 110" fill={`url(#blade1-${variant})`} />
          
          {/* Lớp cỏ tơ mỏng mịn xen kẽ */}
          <path d="M 60 110 Q 45 65 30 45 Q 50 75 65 110" fill={`url(#blade2-${variant})`} opacity="0.85" />
          <path d="M 80 110 Q 80 50 70 30 Q 85 60 85 110" fill={`url(#blade1-${variant})`} opacity="0.95" />
          <path d="M 100 110 Q 110 50 120 35 Q 105 60 100 110" fill={`url(#blade2-${variant})`} opacity="0.95" />
          <path d="M 120 110 Q 135 70 150 50 Q 130 80 115 110" fill={`url(#blade1-${variant})`} opacity="0.85" />

          {/* Các lá cỏ nhỏ viền mép */}
          <path d="M 40 110 Q 25 80 20 60 Q 35 85 45 110" fill={`url(#blade2-${variant})`} opacity="0.65" />
          <path d="M 140 110 Q 155 85 160 65 Q 145 90 135 110" fill={`url(#blade1-${variant})`} opacity="0.65" />
        </g>

        {/* Hoa nở từ khóm cỏ - Nở rực rỡ và lộng lẫy hơn */}
        <g style={{ transform: 'translate(55px, 45px)', transformOrigin: '0px 40px', animation: `sway-clump 3.5s ${delay + 0.5}s infinite ease-in-out` }}>
          <path d="M 0 40 Q -10 20 -5 0" stroke={bladeColor1} strokeWidth="2.5" fill="none" />
          <circle cx="-5" cy="0" r="9" fill={`url(#flower1-${variant})`} />
          <circle cx="-12" cy="0" r="7" fill={`url(#flower1-${variant})`} />
          <circle cx="2" cy="0" r="7" fill={`url(#flower1-${variant})`} />
          <circle cx="-5" cy="-7" r="7" fill={`url(#flower1-${variant})`} />
          <circle cx="-5" cy="7" r="7" fill={`url(#flower1-${variant})`} />
          <circle cx="-5" cy="0" r="3.5" fill="#fef08a" />
          <circle cx="-5" cy="0" r="1.5" fill="#ca8a04" />
        </g>
        
        <g style={{ transform: 'translate(125px, 50px)', transformOrigin: '0px 40px', animation: `sway-clump 4.2s ${delay + 1}s infinite ease-in-out` }}>
          <path d="M 0 40 Q 10 20 5 0" stroke={bladeColor1} strokeWidth="2.5" fill="none" />
          <circle cx="5" cy="0" r="9" fill={`url(#flower2-${variant})`} />
          <circle cx="-2" cy="0" r="7" fill={`url(#flower2-${variant})`} />
          <circle cx="12" cy="0" r="7" fill={`url(#flower2-${variant})`} />
          <circle cx="5" cy="-7" r="7" fill={`url(#flower2-${variant})`} />
          <circle cx="5" cy="7" r="7" fill={`url(#flower2-${variant})`} />
          <circle cx="5" cy="0" r="3.5" fill="#ffffff" />
          <circle cx="5" cy="0" r="1.5" fill="#fbbf24" />
        </g>

        <g style={{ transform: 'translate(90px, 35px)', transformOrigin: '0px 50px', animation: `sway-clump 3.8s ${delay + 0.2}s infinite ease-in-out` }}>
          <path d="M 0 50 L 0 0" stroke={bladeColor1} strokeWidth="2.5" fill="none" />
          <circle cx="0" cy="0" r="8" fill={`url(#flower3-${variant})`} />
          <circle cx="-6" cy="0" r="6" fill={`url(#flower3-${variant})`} />
          <circle cx="6" cy="0" r="6" fill={`url(#flower3-${variant})`} />
          <circle cx="0" cy="-6" r="6" fill={`url(#flower3-${variant})`} />
          <circle cx="0" cy="6" r="6" fill={`url(#flower3-${variant})`} />
          <circle cx="0" cy="0" r="3" fill="#fef08a" />
          <circle cx="0" cy="0" r="1" fill="#ea580c" />
        </g>
      </svg>
    </div>
  );
});

// ---------- Hoa đung đưa phát sáng ----------
const SwayingFlower = memo(({ x, top, color = '#ec4899', scale = 1, delay = 0, duration = 4 }) => {
  const colorId = color.replace('#', '');
  
  return (
    <div
      style={{ left: x, top }}
      className="absolute pointer-events-none z-10 flex flex-col items-center"
    >
      <svg
        width={30 * scale}
        height={70 * scale}
        viewBox="0 0 30 70"
        fill="none"
        className=""
        style={{
          transformOrigin: '15px 70px',
          animation: `sway-flower ${duration}s ${delay}s infinite ease-in-out`,
        }}
      >
        <path d="M15 70 Q 10 40 15 15" stroke={`url(#stem-flower)`} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M13 45 Q 2 40 10 35 Q 12 42 13 45 Z" fill="#047857" />
        <path d="M17 52 Q 26 48 20 42 Q 18 48 17 52 Z" fill="#059669" />
        <g style={{ transform: 'translate(15px, 15px)' }}>
          <circle cx="0" cy="-6" r="6" fill={`url(#petal-${colorId})`} />
          <circle cx="-6" cy="0" r="6" fill={`url(#petal-${colorId})`} />
          <circle cx="6" cy="0" r="6" fill={`url(#petal-${colorId})`} />
          <circle cx="0" cy="6" r="6" fill={`url(#petal-${colorId})`} />
          <circle cx="-4" cy="-4" r="6" fill={`url(#petal-${colorId})`} opacity="0.9" />
          <circle cx="4" cy="-4" r="6" fill={`url(#petal-${colorId})`} opacity="0.9" />
          <circle cx="-4" cy="4" r="6" fill={`url(#petal-${colorId})`} opacity="0.9" />
          <circle cx="4" cy="4" r="6" fill={`url(#petal-${colorId})`} opacity="0.9" />
          <circle cx="0" cy="0" r="4.5" fill="#fef08a" />
          <circle cx="0" cy="0" r="10" fill={color} opacity="0.15" />
        </g>
      </svg>
    </div>
  );
});

// ---------- Lá rụng thơ mộng ----------
const FallingLeaves = memo(() => {
  const [leaves] = useState(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: 12 + Math.random() * 14,
      left: Math.random() * 95,
      startTop: Math.random() * 95, 
      delay: Math.random() * -12,
      duration: 7 + Math.random() * 7,
      color: i % 4 === 0 ? '#10b981' : (i % 4 === 1 ? '#047857' : (i % 4 === 2 ? '#34d399' : '#fbbf24')), 
      swayX: 25 + Math.random() * 35,
    }));
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      {leaves.map((l) => {
        const colorId = l.color.replace('#', '');
        return (
          <div
            key={l.id}
            className="absolute"
            style={{
              width: l.size,
              height: l.size,
              left: `${l.left}%`,
              top: `${l.startTop}%`,
              animation: `leaf-fall ${l.duration}s ${l.delay}s infinite linear`,
            }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              style={{
                width: '100%',
                height: '100%',
                animation: `leaf-sway ${l.duration / 2}s infinite ease-in-out`,
                '--sway-x': `${l.swayX}px`,
              }}
            >
              <path d="M10 2 C 5 7 5 13 10 18 C 15 13 15 7 10 2 Z" fill={`url(#leafGrad-${colorId})`} opacity="0.9" />
              <path d="M10 2 L10 18" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M10 6 Q 6 8 6 8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              <path d="M10 10 Q 14 12 14 12" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
              <path d="M10 14 Q 6 15 6 15" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            </svg>
          </div>
        );
      })}
    </div>
  );
});

// ---------- Một mốc timeline cho Grass ----------
const GrassTimelineItem = ({ milestone, index, playBubble, playTyping }) => {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: false });
  const isConfession = milestone.label === 'Em đồng ý làm bạn gái anh';
  const chatMessages = isConfession ? MESSAGES_CONFESSION_CHAT : [];

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-3xl mx-auto mb-28"
      initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="glass-card bg-green-950/40 backdrop-blur-md p-6 md:p-8 border border-green-400/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-white shadow-lg">
            <Sprout size={18} />
          </div>
          <div className="text-left">
            <p className="font-montserrat text-xs text-green-200 tracking-widest">{milestone.date}</p>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-cream">{milestone.label}</h3>
          </div>
        </div>
        {milestone.description && (
          <p className="text-sm text-green-100/80 mb-5 italic text-left">{milestone.description}</p>
        )}

        {chatMessages.length > 0 ? (
          <div className="mt-4">
            <ChatBox
              messages={chatMessages}
              playBubble={playBubble}
              playTyping={playTyping}
            />
          </div>
        ) : (
          milestone.images && milestone.images.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {milestone.images.map((media, idx) => (
                <TiltCard key={idx} className="p-1 w-full max-w-[220px] sm:max-w-[240px]">
                  {media.type === 'video' ? (
                    <LazyVideo src={media.src} className="w-full h-auto max-h-[250px] object-contain rounded-lg bg-black/10" />
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      className="w-full h-auto max-h-[250px] object-contain rounded-lg bg-black/10 cinematic"
                      loading="lazy"
                    />
                  )}
                  {media.alt && <p className="text-xs text-green-100/60 mt-2 text-center">{media.alt}</p>}
                </TiltCard>
              ))}
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};

// ---------- Chiikawa bay lơ lửng ----------
const FloatingChiikawa = ({ src, alt, className }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`absolute w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none ${className}`}
    animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const GrassLoveNote = () => {
  return (
    <div className="w-full flex justify-center mt-12 mb-8 z-20 relative -translate-y-[8vh]">
      <StoryNote
        type="spoken"
        lines={[
          "anh mong rằng những món quà anh tặng em có thể tiếp thêm động lực",
          "cho em vượt qua những áp lực trong cuộc sống và nở nụ cười thật tươi",
        ]}
        position={{ left: 'auto' }}
        theme={{
          gradientClass: 'from-emerald-100 via-green-50 to-amber-100',
          glowColor: 'transparent',
        }}
        variant="mist-reveal"
        maxWidth="max-w-lg"
        zIndex={15}
        className="!relative mx-auto"
        textClassName="!font-['Lora'] !text-sm sm:!text-base md:!text-xl"
      />
    </div>
  );
};

const ThousandYearsNote = ({ scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, [0.82, 0.85, 0.90, 0.93], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.82, 0.85], [24, 0]);

  return (
    <StoryNote
      type="song"
      lines={[
        "And all along I believed I would find you",
        "Time has brought your heart to me.",
      ]}
      songTitle="A Thousand Years"
      songArtist="Christina Perri"
      position={{ bottom: 'calc(5% + 25rem)' }}
      theme={{
        gradientClass: 'from-cyan-100 via-sky-100 to-blue-100',
        glowColor: 'rgba(186,230,253,0.5)',
      }}
      variant="ripple-rise"
      maxWidth="max-w-md"
      zIndex={30}
      externalMotionStyle={{ opacity, y }}
      textClassName="!font-['Lora'] italic !text-[21px] sm:!text-[24px] md:!text-[27px]"
    />
  );
};

// ---------- Section Chính ----------
const Grass = () => {
  const sectionRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.04 });
  const setRefs = (node) => {
    sectionRef.current = node;
    inViewRef(node);
  };

  // Âm thanh cỏ xào xạc
  const { playBubble, playTyping } = useAudioSync(inView ? 'grass' : '');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Tạo dồi dào khóm cỏ hoa nở rực rỡ dọc lối đi (Mật độ tăng cao vượt trội, trải đều)
  const [grassClumps] = useState(() => {
    const list = [];
    for (let i = 0; i < 220; i++) {
      const topPercent = 1 + (i / 220) * 97; // Trải dài từ 1% tới 98%
      const side = i % 2 === 0 ? 'left' : 'right';
      const delay = Math.random() * -5;
      
      // Khoảng cách ngang trải rộng từ lề vào để che phủ cực kỳ dày dồi dào
      const xOffset = 1 + Math.random() * 12; // 1vw tới 13vw

      // Phân đoạn biến đổi thành cỏ biển sâu ở sát đáy
      const isSeaGrass = topPercent > 82;

      list.push({
        id: `clump-${i}`,
        x: `${xOffset}vw`,
        top: `${topPercent}%`,
        side,
        delay,
        isSeaGrass,
      });
    }
    return list;
  });

  // Tạo hoa dại phát sáng đung đưa
  const [swayingFlowers] = useState(() => {
    const list = [];
    const colors = ['#ec4899', '#3b82f6', '#eab308', '#a855f7', '#f43f5e', '#06b6d4', '#e11d48'];
    for (let i = 0; i < 30; i++) {
      const topPercent = 3 + (i / 30) * 93;
      const side = i % 2 === 0 ? 'left' : 'right';
      
      // Lệch sâu vào phía trong lối đi hơn một chút
      const xOffset = 10 + Math.random() * 8; 
      const x = side === 'left' ? `${xOffset}vw` : `${100 - xOffset}vw`;

      let color = colors[i % colors.length];
      if (topPercent > 82) {
        color = i % 2 === 0 ? '#00f5ff' : '#00e5ff'; // Phát sáng neon ở sát đại dương
      }

      list.push({
        id: `flower-${i}`,
        x,
        top: `${topPercent}%`,
        color,
        scale: 0.9 + Math.random() * 0.35,
        delay: Math.random() * -4,
        duration: 3.5 + Math.random() * 2,
      });
    }
    return list;
  });

  // Đom đóm lập lòe trải đều 840vh
  const [fireflies] = useState(() => Array.from({ length: 65 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3.5 + 1.5,
    left: Math.random() * 100,
    startTop: Math.random() * 96 + 2, 
    delay: Math.random() * -15,
    duration: 8 + Math.random() * 10,
    drift: Math.random() * 40 - 20,
  })));

  // Dấu chân của đôi bạn trẻ uốn lượn lãng mạn
  const footprintsData = [
    { x: '-20vw', y: '5%', rotate: -15, start: 0.05 },
    { x: '18vw', y: '10%', rotate: 20, start: 0.1 },
    { x: '-15vw', y: '15%', rotate: -10, start: 0.15 },
    { x: '22vw', y: '20%', rotate: 25, start: 0.2 },
    { x: '-25vw', y: '25%', rotate: -20, start: 0.25 },
    { x: '15vw', y: '30%', rotate: 15, start: 0.3 },
    { x: '-18vw', y: '35%', rotate: -12, start: 0.35 },
    { x: '20vw', y: '40%', rotate: 18, start: 0.4 },
    { x: '-22vw', y: '45%', rotate: -8, start: 0.45 },
    { x: '26vw', y: '50%', rotate: 22, start: 0.5 },
    { x: '-30vw', y: '55%', rotate: -18, start: 0.55 },
    { x: '18vw', y: '60%', rotate: 12, start: 0.6 },
    { x: '-15vw', y: '65%', rotate: -10, start: 0.65 },
    { x: '22vw', y: '70%', rotate: 20, start: 0.7 },
    { x: '-20vw', y: '75%', rotate: -15, start: 0.75 },
    { x: '15vw', y: '80%', rotate: 15, start: 0.8 },
    { x: '-25vw', y: '85%', rotate: -20, start: 0.85 },
    { x: '20vw', y: '90%', rotate: 18, start: 0.9 },
  ];

  // Dấu chân cún chạy song song, lon ton bên cạnh dấu chân người
  const dogPawsData = footprintsData.map((fp, idx) => {
    const isEven = idx % 2 === 0;
    const zigZagX = isEven ? -1.5 : 1.5;
    const humanXVal = parseFloat(fp.x);
    // Cách khoảng X cố định khoảng 5.5vw và zíc zắc thêm 1.5vw
    const dogXVal = humanXVal + 5.5 + zigZagX;

    const humanYVal = parseFloat(fp.y);
    const dogYVal = `${humanYVal - 0.7}%`; // Đi lệch lên phía trước 1 chút siêu đáng yêu

    const dogRotate = fp.rotate + (isEven ? -15 : 15);
    // Nhận delay nhỏ hơn để hiển thị sau 1 chút giống như đi lăng xăng đuổi theo
    const dogStart = fp.start + 0.005;

    return {
      x: `${dogXVal}vw`,
      y: dogYVal,
      rotate: dogRotate,
      start: dogStart,
    };
  });

  return (
    <section
      ref={setRefs}
      id="grass"
      className="relative w-full min-h-[840vh] overflow-hidden flex flex-col items-center py-24"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, 
            #064e3b 0%, 
            #044233 10%,
            #023a2b 25%, 
            #022c22 40%, 
            #01251f 55%, 
            #023730 70%, 
            #02423e 82%, 
            #072435 90%, 
            #092131 95%, 
            #0b1e33 100%
          )
        `,
        backgroundSize: '28px 28px, 100% 100%',
      }}
    >
      {/* GLOBAL GRASS GRADIENTS */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {/* GRASS BLADES - GRASS */}
          <linearGradient id="blade1-grass" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#022c22" />
            <stop offset="55%" stopColor="#047857" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="blade2-grass" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#011c15" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          {/* GRASS BLADES - SEA */}
          <linearGradient id="blade1-sea" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#022c22" />
            <stop offset="55%" stopColor="#0f4c75" />
            <stop offset="100%" stopColor="#3282b8" />
          </linearGradient>
          <linearGradient id="blade2-sea" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#011c15" />
            <stop offset="60%" stopColor="#1f4068" />
            <stop offset="100%" stopColor="#00b7c2" />
          </linearGradient>

          {/* CLUMP FLOWERS - GRASS */}
          <radialGradient id="flower1-grass" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#ec4899" />
          </radialGradient>
          <radialGradient id="flower2-grass" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
          <radialGradient id="flower3-grass" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
          {/* CLUMP FLOWERS - SEA */}
          <radialGradient id="flower1-sea" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#00d2c4" />
            <stop offset="100%" stopColor="#00b7c2" />
          </radialGradient>
          <radialGradient id="flower2-sea" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#00b7c2" />
            <stop offset="100%" stopColor="#3282b8" />
          </radialGradient>
          <radialGradient id="flower3-sea" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#3282b8" />
            <stop offset="100%" stopColor="#0f4c75" />
          </radialGradient>

          {/* SWAYING FLOWER STEM */}
          <linearGradient id="stem-flower" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#013220" />
            <stop offset="60%" stopColor="#047857" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* SWAYING FLOWER PETALS */}
          {SWAYING_FLOWER_COLORS.map(color => (
            <radialGradient key={color} id={`petal-${color.replace('#', '')}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>
          ))}
          {/* LEAVES */}
          {['#10b981', '#047857', '#34d399', '#fbbf24'].map(color => (
            <linearGradient key={color} id={`leafGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="30%" stopColor={color} />
              <stop offset="100%" stopColor="#01241a" />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Consolidated High-Performance Animations & Keyframes */}
      <style>{`
        @keyframes sway-tree {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(4deg) skewX(1.5deg); }
        }
        @keyframes sway-clump {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(6deg) skewX(2deg); }
        }
        @keyframes sway-flower {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(14deg); }
        }
        @keyframes leaf-fall {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(400px) rotate(270deg); opacity: 0; }
        }
        @keyframes leaf-sway {
          0%, 100% { transform: translateX(0px) rotate(-15deg); }
          50% { transform: translateX(var(--sway-x, 30px)) rotate(15deg); }
        }
        @keyframes float-firefly {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translateY(-280px) translateX(var(--drift, 0px)); opacity: 0; }
        }
        @keyframes sway-grass-blade {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg) translateX(3px); }
        }
      `}</style>

      {/* Pattern nền di chuyển nhẹ theo chuột (Hardware Accelerated) */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none z-0"
        style={{
          transform: 'translateX(calc(var(--mouse-x-pct, 0) * 10px))',
          transition: 'transform 0.5s ease-out',
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(74,222,128,0.12) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none z-0"
        style={{
          transform: 'translateX(calc(var(--mouse-x-pct, 0) * 20px))',
          transition: 'transform 0.5s ease-out',
          backgroundImage: 'radial-gradient(circle at 70% 60%, rgba(134,239,172,0.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Cơn mưa lá rụng thơ mộng */}
      <FallingLeaves />

      {/* Khóm cỏ hoa dạt dào 2 bên lề */}
      {grassClumps.map((c) => (
        <GrassClump
          key={c.id}
          x={c.x}
          top={c.top}
          side={c.side}
          delay={c.delay}
          isSeaGrass={c.isSeaGrass}
        />
      ))}

      {/* Những đóa hoa đung đưa đầy màu sắc */}
      {swayingFlowers.map((f) => (
        <SwayingFlower
          key={f.id}
          x={f.x}
          top={f.top}
          color={f.color}
          scale={f.scale}
          delay={f.delay}
          duration={f.duration}
        />
      ))}

      {/* Dấu chân của hai đứa */}
      {footprintsData.map((fp, idx) => (
        <Footprint
          key={idx}
          x={fp.x}
          y={fp.y}
          rotate={fp.rotate}
          appearStart={fp.start}
          scrollYProgress={scrollYProgress}
        />
      ))}

      {/* Dấu chân của chú cún chạy lon ton bên cạnh */}
      {dogPawsData.map((dp, idx) => (
        <DogPaw
          key={`dog-${idx}`}
          x={dp.x}
          y={dp.y}
          rotate={dp.rotate}
          appearStart={dp.start}
          scrollYProgress={scrollYProgress}
        />
      ))}

      {/* Đom đóm lập lòe */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full pointer-events-none z-5"
          style={{
            width: f.size * 3,
            height: f.size * 3,
            left: `calc(${f.left}% - ${f.size}px)`,
            top: `calc(${f.startTop}% - ${f.size}px)`,
            background: 'radial-gradient(circle at center, rgba(253,224,71,0.8) 0%, rgba(253,224,71,0.2) 50%, transparent 100%)',
            animation: `float-firefly ${f.duration}s ${f.delay}s infinite linear`,
            '--drift': `${f.drift}px`,
          }}
        />
      ))}

      {/* Nội dung chính */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-6xl w-full mt-10">
        
        {/* Lời thơ dẫn nhập */}

        {/* Timeline quà tặng spaced out gracefully */}
        <div className="w-full mt-44 mb-44 pt-8">
          <div className="flex flex-col gap-12">
            {GRASS_TIMELINE.map((milestone, idx) => (
              <GrassTimelineItem
                key={idx}
                milestone={milestone}
                index={idx}
                playBubble={playBubble}
                playTyping={playTyping}
              />
            ))}
            <GrassLoveNote />
          </div>
        </div>

        {/* Album ký ức xanh spaced out gracefully */}
        <div className="w-full mt-44 mb-24 pt-8">
          <div className="flex flex-wrap justify-center gap-8">
            {SECTION_MEDIA.grass.map((media, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="w-[calc(50%-16px)] sm:w-[calc(33.333%-22px)] lg:w-[calc(25%-24px)] max-w-[240px]"
              >
                <TiltCard className="p-1 h-full">
                  {media.type === 'video' ? (
                    <LazyVideo src={media.src} className="w-full h-auto max-h-[300px] object-contain rounded-lg bg-black/10" />
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg bg-black/10 cinematic"
                      loading="lazy"
                    />
                  )}
                  {media.alt && <p className="text-xs text-green-200/60 mt-2 text-center font-inter">{media.alt}</p>}
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chiikawa trang trí bay nhảy dọc đường hành trình */}
      <FloatingChiikawa src={GRASS_CHIIKAWA[0].src} alt={GRASS_CHIIKAWA[0].alt} className="top-[8%] left-5 md:left-10" />
      <FloatingChiikawa src={GRASS_CHIIKAWA[1].src} alt={GRASS_CHIIKAWA[1].alt} className="top-[35%] right-10 md:right-20" />
      <FloatingChiikawa src={GRASS_CHIIKAWA[2].src} alt={GRASS_CHIIKAWA[2].alt} className="bottom-[15%] left-10 md:left-20" />
      
      {/* Lời nhắn riêng tư ở góc */}
      <SelfFadingNote />

      <ThousandYearsNote scrollYProgress={scrollYProgress} />
    </section>
  );
};

export default Grass;
