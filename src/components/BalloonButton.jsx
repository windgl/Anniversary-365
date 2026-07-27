import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const BalloonButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const { scrollY } = useScroll();

  // Lắng nghe sự thay đổi của trục Y một cách tối ưu
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Hiện nút nếu cuộn quá 500px, ẩn nếu ngược lại
    if (latest > 500) {
      if (!isFlying) setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsFlying(false);
    }
  });

  const handleLaunch = () => {
    if (isFlying) return;
    setIsFlying(true);

    // Phát âm thanh khi khởi hành
    const sfx = new Audio('./audio/sfx/water-ripple.mp3');
    sfx.volume = 0.4;
    sfx.play().catch(() => {});

    // Chờ khinh khí cầu bay vút lên rồi mới cuộn trang lên đầu
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 650);
  };

  return (
    // AnimatePresence giúp tạo animation cho component khi nó bị gỡ (unmount) khỏi DOM
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleLaunch}
          // Animation lúc nút xuất hiện và biến mất khỏi màn hình
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={isFlying ? {
            y: -window.innerHeight - 300,
            scale: 1.3,
            opacity: 0,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
          } : {
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.5, y: 50, transition: { duration: 0.3 } }}
          whileHover={isFlying ? {} : { scale: 1.1 }}
          whileTap={isFlying ? {} : { scale: 0.9 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 glass-card rounded-full! p-3 shadow-lg hover:bg-white/10 transition-colors group cursor-none"
        >
          {/* Animation lắc lư lơ lửng vô tận (loop) khi chưa bay */}
          <motion.div
            animate={isFlying ? {
              rotate: [0, 15, -15, 0],
            } : {
              y: [-2, 2, -2],
              rotate: [-3, 3, -3]
            }}
            transition={isFlying ? {
              duration: 0.8,
              ease: "easeInOut"
            } : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* SVG Khinh khí cầu */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-pink-300 drop-shadow-[0_0_5px_rgba(249,168,212,0.6)]"
            >
              {/* Phần bóng bay */}
              <path d="M17.4 8.5c-.2-4-3.1-7.5-7.4-7.5-4.2 0-7.2 3.5-7.4 7.5-.3 4.6 2.3 8.3 5.4 10.5h4c3.1-2.2 5.7-5.9 5.4-10.5Z" />
              {/* Dây nối */}
              <path d="M12 19v3" />
              <path d="M9 19v3" />
              <path d="M15 19v3" />
              {/* Giỏ khinh khí cầu */}
              <path d="M8 22h8" />
            </svg>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BalloonButton;