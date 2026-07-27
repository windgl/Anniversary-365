 
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Waves } from 'lucide-react';
import useAudioSync from '../hooks/useAudioSync';
import QuoteHeader from '../components/QuoteHeader';
import TiltCard from '../components/TiltCard';
import LazyVideo from '../components/LazyVideo';
import StoryNote from '../components/StoryNote';
import {
  OCEAN_TIMELINE,
  OCEAN_CHIIKAWA,
  SECTION_MEDIA,
} from '../utils/constants';

// ---------- Một cột mốc trong dòng thời gian đại dương ----------
const OceanTimelineItem = ({ milestone, index }) => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-3xl mx-auto mb-16"
      initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
    >
      <div className="glass-card bg-blue-900/30 backdrop-blur-md p-6 md:p-8 border border-blue-300/30 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 flex items-center justify-center text-white shadow-lg">
            <Waves size={18} />
          </div>
          <div>
            <p className="font-montserrat text-xs text-cyan-200 tracking-widest">{milestone.date}</p>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-cream">{milestone.label}</h3>
          </div>
        </div>
        {milestone.description && (
          <p className="text-sm text-blue-100/80 mb-5 italic">{milestone.description}</p>
        )}
        {milestone.images && milestone.images.length > 0 && (
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
                {media.alt && <p className="text-xs text-blue-100/60 mt-2 text-center">{media.alt}</p>}
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ---------- Chiikawa bay lơ lửng trong lòng đại dương ----------
const FloatingChiikawa = ({ src, alt, className }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`absolute w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none ${className}`}
    animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ---------- Section Chính – Đại Dương ----------
const Ocean = () => {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const { playRipple, playBubble } = useAudioSync(inView ? 'ocean' : '');

  // State cho hiệu ứng gợn sóng, bong bóng, particles (giữ nguyên)
  const [ripples, setRipples] = useState([]);
  const [bubbles] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    left: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    randomX1: Math.random() * 40 - 20,
    randomX2: Math.random() * 20 - 10,
  })));
  const [poppedBubbles, setPoppedBubbles] = useState([]);
  const [particles] = useState(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    bottom: Math.random() * 100,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
  })));

  const handleOceanClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    if (playRipple) playRipple();
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1500);
  };

  const handleBubbleDoubleClick = (e, id) => {
    e.stopPropagation();
    if (playBubble) playBubble();
    setPoppedBubbles((prev) => [...prev, id]);
  };

  return (
    <section
      ref={ref}
      id="ocean"
      className="relative w-full min-h-[450vh] overflow-hidden flex flex-col items-center cursor-pointer py-24"
      onClick={handleOceanClick}
      style={{ background: 'linear-gradient(to bottom, #0b1e33 0%, #0f2b4a 40%, #0d3b66 70%, #0b1e33 90%, #0a0a0a 100%)' }}
    >
      {/* CSS cho sóng xoáy, hạt sáng, hiệu ứng chữ */}
      <style>
        {`
          @keyframes spin-wave {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          .ocean-waves::before {
            content: "";
            position: absolute;
            width: 300vw;
            height: 300vw;
            top: 50%;
            left: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.06), transparent 70%),
                        radial-gradient(circle at 70% 60%, rgba(14, 165, 233, 0.08), transparent 70%);
            border-radius: 42%;
            animation: spin-wave 25s infinite linear;
            pointer-events: none;
            z-index: 0;
            will-change: transform;
          }
          .ocean-waves::after {
            content: "";
            position: absolute;
            width: 280vw;
            height: 280vw;
            top: 50%;
            left: 50%;
            background: radial-gradient(circle at 60% 40%, rgba(148, 163, 184, 0.04), transparent 60%),
                        radial-gradient(circle at 20% 70%, rgba(56, 189, 248, 0.05), transparent 60%);
            border-radius: 38%;
            animation: spin-wave 35s infinite linear reverse;
            pointer-events: none;
            z-index: 0;
            will-change: transform;
          }
          @keyframes float-particle {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
          }
          .water-text-hover {
            display: inline-block;
            transition: color 0.5s, text-shadow 0.5s;
          }
          .water-text-hover:hover {
            animation: text-ripple 2s infinite ease-in-out;
            color: #bae6fd;
            text-shadow: 0 0 12px rgba(56, 189, 248, 0.8), 0 0 24px rgba(14, 165, 233, 0.6);
          }
          @keyframes text-ripple {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(56,189,248,0.4)); }
            50% { transform: scale(1.03); filter: drop-shadow(0 0 12px rgba(56,189,248,0.9)); }
          }
        `}
      </style>

      {/* Sóng xoáy nền */}
      <div className="ocean-waves absolute inset-0 pointer-events-none" />

      {/* Texture wave.svg */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: 'url(./images/textures/wave.svg)', backgroundSize: 'cover' }}
      />

      {/* Hạt bụi sáng */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/60"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              opacity: 0,
              animation: `float-particle ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Gợn sóng khi click */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute rounded-full border-2 border-sky-300/60 pointer-events-none z-10"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 120,
              height: 120,
              x: '-50%',
              y: '-50%',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Bong bóng nổi */}
      {bubbles.map((bubble) => {
        if (poppedBubbles.includes(bubble.id)) return null;
        return (
          <motion.div
            key={bubble.id}
            className="absolute bottom-0 rounded-full bg-white/10 border border-white/20 z-10 cursor-crosshair"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: -window.innerHeight - 120,
              opacity: [0, 0.9, 0.9, 0],
              x: [0, bubble.randomX1, bubble.randomX2, 0],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            onDoubleClick={(e) => handleBubbleDoubleClick(e, bubble.id)}
            title="Double click để làm vỡ bong bóng"
          />
        );
      })}

      {/* Nội dung chính – ngăn click lan ra ngoài tạo gợn sóng */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-6xl px-4" onClick={(e) => e.stopPropagation()}>
        <QuoteHeader 
          quote="My bounty is as boundless as the sea, My love as deep; the more I give to thee, The more I have, for both are infinite." 
          author="William Shakespeare" 
          source="Romeo and Juliet" 
          className="mb-16"
        />

        {/* Dòng thời gian đại dương – cột mốc lần đầu gặp gỡ */}
        <div className="w-full mb-24 pt-8">
          {OCEAN_TIMELINE.map((milestone, idx) => (
            <OceanTimelineItem key={idx} milestone={milestone} index={idx} />
          ))}
        </div>

        {/* Kỷ niệm sâu thẳm (ảnh từ SECTION_MEDIA.ocean) */}
        <div className="w-full mb-24 mt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {SECTION_MEDIA.ocean.map((media, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[240px]"
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
                  {media.alt && <p className="text-xs text-blue-100/60 mt-2 text-center font-inter">{media.alt}</p>}
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chiikawa lơ lửng */}
      <FloatingChiikawa src={OCEAN_CHIIKAWA[0].src} alt={OCEAN_CHIIKAWA[0].alt} className="top-20 left-5" />
      <FloatingChiikawa src={OCEAN_CHIIKAWA[1].src} alt={OCEAN_CHIIKAWA[1].alt} className="top-60 right-10" />
      <FloatingChiikawa src={OCEAN_CHIIKAWA[2].src} alt={OCEAN_CHIIKAWA[2].alt} className="bottom-40 left-10" />
      
      <StoryNote
        type="spoken"
        lines={[
          "nếu em gặp bất kỳ khó khăn hay tâm sự gì cứ tìm đến anh,",
          "anh sẽ rất vui khi được hiện diện trong cuộc sống của em đó",
        ]}
        position={{ bottom: 'calc(3% + 10rem)' }}
        theme={{
          gradientClass: 'from-blue-100 via-cyan-50 to-teal-100',
          glowColor: 'rgba(103,232,249,0.5)',
        }}
        variant="mist-reveal"
        maxWidth="max-w-lg"
        zIndex={22}
        textClassName="!font-['Lora'] italic !text-[15px] sm:!text-lg md:!text-xl"
      />
    </section>
  );
};

export default Ocean;