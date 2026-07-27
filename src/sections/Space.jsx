 
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';
import useAudioSync from '../hooks/useAudioSync';
import ChatBox from '../components/ChatBox';
import QuoteHeader from '../components/QuoteHeader';
import TiltCard from '../components/TiltCard';
import LazyVideo from '../components/LazyVideo';
import {
  CONSTELLATION_DATA,
  SPACE_TIMELINE,
  SPACE_CHIIKAWA,
  SECTION_MEDIA,
  MESSAGES_FIRST_CHAT,
} from '../utils/constants';

/* ============================================================
   STARFIELD NỀN (Canvas) – Hàng nghìn sao lấp lánh
   ============================================================ */
const StarfieldBackground = ({ isPaused }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createStars();
    };

    const createStars = () => {
      // Density of 400 yields a gorgeous, dense starry sky while ensuring 60fps performance on all devices
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 1000), 800);
      stars = Array.from({ length: count }, () => {
        // Most stars are tiny, realistic dots (0.2 - 0.7px), with some slightly larger ones
        const rSeed = Math.random();
        const radius = rSeed < 0.85 ? (Math.random() * 0.5 + 0.15) : (rSeed < 0.97 ? (Math.random() * 0.8 + 0.5) : (Math.random() * 1.2 + 1.1));
        const isTwinkling = Math.random() < 0.15; // Only 15% twinkle for realistic depth and excellent performance
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius,
          baseAlpha: Math.random() * 0.75 + 0.15,
          alpha: Math.random() * 0.75 + 0.15,
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.015,
          isTwinkling,
        };
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        if (star.isTwinkling) {
          star.alpha = star.baseAlpha + 0.15 * Math.sin(Date.now() * star.speed + star.phase);
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        // Pure white color with opacity
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

/* ============================================================
   SAO BĂNG NGẪU NHIÊN
   ============================================================ */
const ShootingStar = ({ inView }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!inView) return;
    // Low frequency: shooting star appears every 20-40 seconds
    const interval = setInterval(() => {
      const id = Date.now();
      const left = Math.random() * 100;
      const top = Math.random() * 40;
      const delay = Math.random() * 2;
      setStars((prev) => [...prev, { id, left, top, delay }]);
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, 2000);
    }, 20000 + Math.random() * 20000);

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

/* ============================================================
   STAR MAP 3D BACKGROUND – Bản đồ sao khổng lồ làm nền cho Space
   ============================================================ */
const StarMapBackground = ({ data }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      style={{ perspective: '1500px' }}
    >
      <div
        className="absolute inset-0 w-full h-full opacity-40 select-none pointer-events-none"
        style={{
          transform: 'rotateX(calc(var(--mouse-y-pct, 0) * -8deg)) rotateY(calc(var(--mouse-x-pct, 0) * 12deg)) scale(1.1)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease-out',
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {data.connections.map(([startId, endId], i) => {
            const start = data.stars.find((s) => s.id === startId);
            const end = data.stars.find((s) => s.id === endId);
            if (!start || !end) return null;
            return (
              <motion.line
                key={`line-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgba(192,132,252,0.25)"
                strokeWidth="0.15"
                strokeDasharray="0.5 0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{ duration: 3, delay: 0.5 + i * 0.05 }}
              />
            );
          })}
          {data.stars.map((star, i) => (
            <g key={`star-${star.id}`}>
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={(star.size * 1.8) / 20}
                fill={star.color || "#ffffff"}
                opacity={0.1}
                animate={star.glow ? { scale: [1, 1.6, 1], opacity: [0.05, 0.2, 0.05] } : {}}
                transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={(star.size * 0.6) / 20}
                fill={star.color || "#ffffff"}
                animate={star.glow ? { scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] } : {}}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {star.name && (
                <text
                  x={star.x + (star.size * 0.6 + 1.2) / 20}
                  y={star.y + 0.6 / 20}
                  fill="rgba(255,255,255,0.6)"
                  fontSize={1.6 / 20}
                  fontFamily="Montserrat, sans-serif"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  {star.name}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

/* ============================================================
   COMPONENT HIỂN THỊ MỘT MỐC TIMELINE TRONG SPACE
   ============================================================ */
const SpaceMilestone = ({ milestone, index, playBubble, playTyping }) => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });
  const isFirstChat = milestone.label === 'Tin nhắn đầu tiên';
  const chatMessages = isFirstChat ? MESSAGES_FIRST_CHAT : [];

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-2xl mx-auto mb-20"
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <div className="relative glass-card p-6 md:p-8 border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="font-montserrat text-sm text-pink-200 tracking-widest">{milestone.date}</div>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-cream">{milestone.label}</h3>
          </div>
        </div>

        {milestone.description && (
          <p className="font-inter text-sm text-white/70 mb-6 italic">{milestone.description}</p>
        )}

        {chatMessages.length > 0 ? (
          <div className="mt-4">
            <ChatBox
              messages={chatMessages}
              playBubble={playBubble}
              playTyping={playTyping}
            />
            {isFirstChat && (
              <motion.div
                className="mt-8 text-center font-cormorant italic text-white/70 text-lg md:text-xl drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                "hôm đó em đã tag tên anh vào tin nào thế nhỉ?"
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {milestone.images.map((img, idx) => (
              <TiltCard key={idx} className="p-1 w-full max-w-[220px] sm:max-w-[240px]">
                {img.type === 'video' ? (
                  <LazyVideo src={img.src} alt={img.alt} className="w-full h-auto max-h-[250px] object-contain rounded-xl bg-black/10" />
                ) : (
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto max-h-[250px] object-contain rounded-xl bg-black/10 cinematic"
                    loading="lazy"
                  />
                )}
                {img.alt && <p className="text-xs text-white/60 mt-2 text-center">{img.alt}</p>}
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ============================================================
   CHIIKAWA TRANG TRÍ
   ============================================================ */
const FloatingChiikawa = ({ src, alt, className }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`absolute w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
    }}
    style={{
      animation: 'float 4s ease-in-out infinite',
    }}
  />
);

/* ============================================================
   SECTION CHÍNH – SPACE
   ============================================================ */
const Space = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const { playBubble, playTyping } = useAudioSync(inView ? 'space' : '');

  return (
    <section
      ref={ref}
      id="space"
      className="relative w-full min-h-[450vh] overflow-hidden flex flex-col items-center pt-24 pb-32"
      style={{
        background: 'linear-gradient(180deg, #090a0f 0%, #0e1118 45%, #151d2a 75%, #1e3c72 100%)',
      }}
    >
      {/* Nền sao chân thực */}
      <StarfieldBackground isPaused={!inView} />

      {/* Bản đồ sao khổng lồ làm background */}
      <StarMapBackground data={CONSTELLATION_DATA} />

      {/* Dải ngân hà */}
      <div className="milky-way absolute inset-0 pointer-events-none" />

      {/* Sao băng */}
      <ShootingStar inView={inView} />

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4">
        <QuoteHeader 
          quote="So, I love you because the entire universe conspired to help me find you" 
          author="Paulo Coelho" 
        />

        {/* Timeline – Các cột mốc trong vũ trụ */}
        <div className="w-full max-w-6xl mb-24 pt-8">
          {SPACE_TIMELINE.map((milestone, idx) => (
            <SpaceMilestone
              key={idx}
              milestone={milestone}
              index={idx}
              playBubble={playBubble}
              playTyping={playTyping}
            />
          ))}
        </div>

        {/* Kỷ niệm trôi nổi (ảnh lẻ) */}
        <div className="w-full max-w-6xl mb-24 mt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {SECTION_MEDIA.space.map((media, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[240px]"
              >
                <TiltCard className="p-1 h-full">
                  {media.type === 'video' ? (
                    <LazyVideo src={media.src} alt={media.alt} className="w-full h-auto max-h-[300px] object-contain rounded-xl bg-black/10" />
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      className="w-full h-auto max-h-[300px] object-contain rounded-xl bg-black/10 cinematic"
                      loading="lazy"
                    />
                  )}
                  {media.alt && <p className="text-xs text-white/60 mt-2 text-center font-inter">{media.alt}</p>}
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chiikawa bay lơ lửng */}
      <FloatingChiikawa src={SPACE_CHIIKAWA[0].src} alt={SPACE_CHIIKAWA[0].alt} className="top-10 left-5" />
      <FloatingChiikawa src={SPACE_CHIIKAWA[1].src} alt={SPACE_CHIIKAWA[1].alt} className="top-40 right-5" />
      <FloatingChiikawa src={SPACE_CHIIKAWA[2].src} alt={SPACE_CHIIKAWA[2].alt} className="bottom-20 left-10" />
    </section>
  );
};

export default Space;