import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Gift } from 'lucide-react';
import useAudioSync from '../hooks/useAudioSync';
import TiltCard from '../components/TiltCard';
import LazyVideo from '../components/LazyVideo';
import StoryNote from '../components/StoryNote';
import {
  SKY_TIMELINE,
  SKY_CHIIKAWA,
  SECTION_MEDIA,
} from '../utils/constants';

/* ============================================================
   ĐÁM MÂY & ĐÀN CHIM
   ============================================================ */
const Cloud = memo(({ className }) => (
  <div
    className={`relative bg-gradient-to-b from-white via-white/95 to-slate-100/80 rounded-full ${className}`}
  >
    <div className="absolute top-[-50%] left-[12%] w-[45%] h-[120%] bg-gradient-to-b from-white to-white/90 rounded-full" />
    <div className="absolute top-[-70%] right-[15%] w-[55%] h-[150%] bg-gradient-to-b from-white via-white to-white/85 rounded-full" />
    <div className="absolute top-[-35%] left-[38%] w-[40%] h-[110%] bg-gradient-to-b from-white to-white/85 rounded-full" />
  </div>
));

const BirdFlock = memo(() => (
  <svg
    width="240"
    height="120"
    viewBox="0 0 240 120"
    fill="currentColor"
    className="text-white/90 drop-shadow-md"
  >
    <path d="M22,54c-2.5-1.5-5.2-3-8-4.1c2.1-2,4.5-3.7,7.3-4.8c1.5-0.5,3.1-0.3,4.3,0.6c1.3,1,1.9,2.6,2.7,4 C30,53.1,30.2,54.1,22,54z" />
    <path d="M48,44c-3.4-1.8-7.1-3.1-10.9-3.6c2.3-2.6,5.1-4.8,8.4-5.9c1.7-0.5,3.5-0.2,4.9,0.9c1.5,1.2,2.4,3,3.3,4.6 C55.6,42.5,55.1,43.6,48,44z" />
    <path d="M84,28c-4.8-2.3-9.9-3.6-15.1-3.5c2.8-3.9,6.3-7.2,10.4-9.3c2.1-1.1,4.8-1.1,6.8,0.3c2.3,1.6,3.7,4,5.2,6.3 C94,25.5,92.4,27,84,28z" />
    <path d="M145,49c-3.9-1.8-8-3.1-12.2-3.5c2.5-2.8,5.6-5.1,9.2-6.5c1.8-0.7,3.9-0.5,5.4,0.8c1.7,1.3,2.6,3.3,3.7,5.1 C153,47.6,152.1,48.6,145,49z" />
    <path d="M192,63c-3-1.3-6.1-2.2-9.3-2.5c2-2,4.3-3.7,7-4.6c1.4-0.5,3-0.3,4.2,0.6c1.3,1,2,2.5,2.8,3.8 C198.2,62,197.5,62.8,192,63z" />
  </svg>
));

const SingleAnimatedBird = memo(({ delay, duration, startY, scale, direction = 'ltr' }) => {
  const isRtl = direction === 'rtl';
  const initialX = isRtl ? '110%' : '-10%';
  const targetX = isRtl ? '-10%' : '110%';

  return (
    <motion.div
      initial={{ x: initialX, y: startY, opacity: 0 }}
      animate={{
        x: targetX,
        y: [startY, startY - 25, startY + 20, startY],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: 'linear',
      }}
      className="absolute pointer-events-none z-10"
      style={{ scaleX: isRtl ? -scale : scale, scaleY: scale }}
    >
      <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor" className="text-white/50">
        <path d="M 10 50 Q 30 15 50 50 Q 70 15 90 50 Q 70 55 50 50 Q 30 55 10 50 Z">
          <animate 
            attributeName="d" 
            dur="0.6s" 
            repeatCount="indefinite"
            values="
              M 10 50 Q 30 15 50 50 Q 70 15 90 50 Q 70 55 50 50 Q 30 55 10 50 Z;
              M 10 50 Q 30 75 50 50 Q 70 75 90 50 Q 70 45 50 50 Q 30 45 10 50 Z;
              M 10 50 Q 30 15 50 50 Q 70 15 90 50 Q 70 55 50 50 Q 30 55 10 50 Z
            "
          />
        </path>
      </svg>
    </motion.div>
  );
});

/* ============================================================
   GIÓ THỔI NGHỆ THUẬT (Bản ghi gió trôi lơ lửng)
   ============================================================ */
const WindBreeze = memo(() => {
  const breezes = [
    { id: 1, top: '12%', delay: 0, duration: 16, scale: 0.8 },
    { id: 2, top: '28%', delay: 5, duration: 22, scale: 1.1 },
    { id: 3, top: '48%', delay: 2, duration: 14, scale: 0.9 },
    { id: 4, top: '68%', delay: 9, duration: 24, scale: 1.25 },
    { id: 5, top: '85%', delay: 4, duration: 19, scale: 0.75 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-1">
      {breezes.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: '-110%', opacity: 0 }}
          animate={{
            x: '110%',
            opacity: [0, 0.25, 0.25, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: 'easeInOut',
          }}
          className="absolute w-[350px] h-[3px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            top: b.top,
            transform: `scale(${b.scale}) skewX(-20deg)`,
            filter: 'blur(1.5px)',
          }}
        />
      ))}
    </div>
  );
});

/* ============================================================
   MỘT CỘT MỐC TRÊN DÒNG THỜI GIAN CỦA SKY
   ============================================================ */
const SkyTimelineItem = ({ milestone, index }) => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-3xl mx-auto mb-20"
      initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
    >
      <div className="glass-card bg-white/20 backdrop-blur-md p-6 md:p-8 border border-white/30 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-300 to-blue-400 flex items-center justify-center text-white shadow-lg">
            <Gift size={18} />
          </div>
          <div>
            <p className="font-montserrat text-xs text-sky-200 tracking-widest">
              {milestone.date}
            </p>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white">
              {milestone.label}
            </h3>
          </div>
        </div>

        {milestone.description && (
          <p className="text-sm text-white/70 mb-5 italic">{milestone.description}</p>
        )}

        {milestone.images && milestone.images.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {milestone.images.map((media, idx) => (
              <TiltCard key={idx} className="p-1 w-full max-w-[220px] sm:max-w-[240px]">
                {media.type === 'video' ? (
                  <LazyVideo
                    src={media.src}
                    className="w-full h-auto max-h-[250px] object-contain rounded-lg bg-black/10"
                  />
                ) : (
                  <img
                    src={media.src}
                    alt={media.alt}
                    className="w-full h-auto max-h-[250px] object-contain rounded-lg bg-black/10 cinematic"
                    loading="lazy"
                  />
                )}
                {media.alt && <p className="text-xs text-white/50 mt-2 text-center">{media.alt}</p>}
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ============================================================
   CHIIKAWA TRANG TRÍ BAY LƠ LỬNG
   ============================================================ */
const FloatingChiikawa = ({ src, alt, className }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`absolute w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none ${className}`}
    animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ============================================================
   SECTION CHÍNH – SKY (BẦU TRỜI)
   ============================================================ */
const Sky = () => {
  const { ref, inView } = useInView({ threshold: 0.2 });
  // Âm thanh gió
  useAudioSync(inView ? 'sky' : '');

  // Các lớp mây (giữ nguyên nhưng có thể mở rộng thêm)
  const cloudLayers = [
    { speed: 'animate-cloud-slow', top: '5%', width: 'w-48', height: 'h-14', opacity: 'opacity-40', z: 'z-0', parallax: 0.3 },
    { speed: 'animate-cloud-slow', top: '25%', width: 'w-56', height: 'h-16', opacity: 'opacity-30', z: 'z-0', parallax: 0.3, delay: '-10s' },
    { speed: 'animate-cloud-slow', top: '70%', width: 'w-64', height: 'h-12', opacity: 'opacity-35', z: 'z-0', parallax: 0.3, delay: '-20s' },
    { speed: 'animate-cloud-medium', top: '15%', width: 'w-72', height: 'h-20', opacity: 'opacity-50', z: 'z-10', parallax: 0.7 },
    { speed: 'animate-cloud-medium', top: '55%', width: 'w-80', height: 'h-24', opacity: 'opacity-45', z: 'z-10', parallax: 0.7, delay: '-12s' },
    { speed: 'animate-cloud-fast', top: '35%', width: 'w-96', height: 'h-28', opacity: 'opacity-70', z: 'z-30', parallax: 1.5 },
    { speed: 'animate-cloud-fast', top: '75%', width: 'w-[28rem]', height: 'h-32', opacity: 'opacity-60', z: 'z-30', parallax: 1.5, delay: '-6s' },
  ];

  return (
    <section
      ref={ref}
      id="sky"
      className="relative w-full min-h-[380vh] overflow-hidden flex flex-col items-center py-24"
      style={{
        background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 25%, #38bdf8 50%, #bae6fd 75%, #a7f3d0 90%, #064e3b 100%)',
      }}
    >
      {/* CSS animation mây */}
      <style>
        {`@keyframes cloud-drift {
          0% { transform: translateX(110vw); }
          100% { transform: translateX(-20vw); }
        }
        .animate-cloud-slow { animation: cloud-drift 45s linear infinite; }
        .animate-cloud-medium { animation: cloud-drift 30s linear infinite; }
        .animate-cloud-fast { animation: cloud-drift 18s linear infinite; }`}
      </style>

      {/* Đàn chim bay ngang */}
      <AnimatePresence>
        {inView && (
          <motion.div
            initial={{ x: -300, y: 120, scale: 0.7, opacity: 0 }}
            animate={{
              x: 'calc(100vw + 250px)',
              y: -80,
              scale: 1.1,
              opacity: [0, 0.9, 0.9, 0],
              transition: { duration: 14, ease: 'easeInOut' },
            }}
            className="absolute z-20 pointer-events-none"
          >
            <BirdFlock />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chim bay tự do (Mật độ đẹp đẽ, phong phú và bay liên tục hai hướng) */}
      <SingleAnimatedBird delay={1} duration={22} startY="12%" scale={0.7} direction="ltr" />
      <SingleAnimatedBird delay={6} duration={26} startY="28%" scale={0.5} direction="rtl" />
      <SingleAnimatedBird delay={12} duration={18} startY="45%" scale={0.8} direction="ltr" />
      <SingleAnimatedBird delay={3} duration={30} startY="58%" scale={0.6} direction="rtl" />
      <SingleAnimatedBird delay={18} duration={25} startY="72%" scale={0.5} direction="ltr" />
      <SingleAnimatedBird delay={9} duration={22} startY="84%" scale={0.65} direction="rtl" />

      {/* Gió thổi nghệ thuật */}
      <WindBreeze />

      <StoryNote
        type="spoken"
        lines={["anh cảm thấy rất may mắn khi được gặp em"]}
        position={{ top: '10%', left: '65%' }}
        theme={{
          gradientClass: 'from-sky-100 via-white to-blue-200',
          glowColor: 'rgba(186,230,253,0.5)',
        }}
        variant="cloud-drift"
        maxWidth="max-w-lg"
        zIndex={22}
        textClassName="!text-base md:!text-lg"
      />

      {/* Mây parallax */}
      {cloudLayers.map((layer, idx) => (
        <div
          key={idx}
          className={`absolute top-0 left-0 w-full h-full pointer-events-none ${layer.z}`}
          style={{
            transform: `translateX(calc(var(--mouse-x-pct, 0) * ${layer.parallax * 40}px))`,
            transition: 'transform 0.4s ease-out',
          }}
        >
          <div
            className={`${layer.speed} absolute`}
            style={{ top: layer.top, animationDelay: layer.delay || '0s' }}
          >
            <Cloud className={`${layer.width} ${layer.height} ${layer.opacity}`} />
          </div>
        </div>
      ))}

      {/* Nội dung chính */}
      <div className="relative z-25 flex flex-col items-center w-full max-w-6xl px-4">
        {/* Timeline các mốc quà em tặng */}
        <div className="w-full mb-24 pt-8">
          {SKY_TIMELINE.map((milestone, idx) => (
            <SkyTimelineItem key={idx} milestone={milestone} index={idx} />
          ))}
        </div>

        {/* Ảnh kỷ niệm bay bổng (SECTION_MEDIA.sky) */}
        <div className="w-full mb-24 mt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {SECTION_MEDIA.sky.map((media, idx) => (
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
                  {media.alt && (
                    <p className="text-xs text-white/60 mt-2 text-center font-inter">
                      {media.alt}
                    </p>
                  )}
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chiikawa trang trí */}
      <FloatingChiikawa
        src={SKY_CHIIKAWA[0].src}
        alt={SKY_CHIIKAWA[0].alt}
        className="top-20 left-5"
      />
      <FloatingChiikawa
        src={SKY_CHIIKAWA[1].src}
        alt={SKY_CHIIKAWA[1].alt}
        className="top-60 right-10"
      />
      <FloatingChiikawa
        src={SKY_CHIIKAWA[2].src}
        alt={SKY_CHIIKAWA[2].alt}
        className="bottom-40 left-10"
      />

      <StoryNote
        type="song"
        lines={[
          "I'll miss you on a train, I'll miss you in the mornin'",
          "I never know what to think about",
          "I think about you.",
        ]}
        songTitle="About You"
        songArtist="The 1975"
        position={{ bottom: '1%' }}
        theme={{
          gradientClass: 'from-blue-50 via-sky-100 to-indigo-100',
          glowColor: 'rgba(186,230,253,0.4)',
        }}
        variant="mist-reveal"
        maxWidth="max-w-sm"
        zIndex={20}
        textClassName="!font-['Lora'] italic text-center blur-[0.5px] !text-sm sm:!text-base md:!text-lg"
      />
    </section>
  );
};

export default Sky;