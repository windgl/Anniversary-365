 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Typewriter from '../components/Typewriter';
import useTimeCounter from '../hooks/useTimeCounter';
import { FIRST_MESSAGE_DATE, HERO_CHIIKAWA } from '../utils/constants';

// ---------- Chiikawa nhỏ bay lơ lửng dễ thương ----------
const FloatingChiikawa = ({ src, alt, className }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`absolute w-14 h-14 md:w-18 md:h-18 object-contain pointer-events-none ${className}`}
    animate={{
      y: [0, -12, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

const Hero = () => {
  const { ref, inView } = useInView({ triggerOnce: false });
  const { days, hours, minutes } = useTimeCounter(FIRST_MESSAGE_DATE, !inView);

  // Khởi tạo hạt lấp lánh (Req 1/Hạn chế Math.random khi render)
  const [sparkles] = useState(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: 0.3 + Math.random() * 0.4,
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 2,
  })));

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Nền gradient chuyển động */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(-45deg, #0a0a0a, #1f102b, #0a1128, #120a1f)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Hạt lấp lánh di chuyển chậm (hiệu ứng 2D dễ thương) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-pink-300 rounded-full"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              opacity: sparkle.opacity,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Số đếm mờ lớn làm nền */}
      <div className="hero-counter-bg">
        {String(days).padStart(2, '0')}:{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
      </div>

      {/* Hiệu ứng tách đôi màn hình (Curtain Split) */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-black z-50 origin-left"
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-black z-50 origin-right"
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <Typewriter text="Anniversary" />
        <motion.p
          className="font-cormorant text-xl md:text-2xl text-pink-100/80 mt-4 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Kỷ niệm 1 năm kể từ tin nhắn đầu tiên giữa anh và em
        </motion.p>
      </div>

      {/* Chiikawa trang trí Hero */}
      {HERO_CHIIKAWA.map((chii, idx) => (
        <FloatingChiikawa
          key={idx}
          src={chii.src}
          alt={chii.alt}
          className={idx === 0 ? 'top-10 left-5' : 'bottom-16 right-8'}
        />
      ))}
    </section>
  );
};

export default Hero;