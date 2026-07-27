import { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import useMouseTrack from '../hooks/useMouseTrack';

const CustomCursor = () => {
  const { x, y } = useMouseTrack();
  const [windowHeight, setWindowHeight] = useState(() => typeof window !== 'undefined' ? window.innerHeight : 800);
  const [hasMoved, setHasMoved] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isNearBottomRef = useRef(isNearBottom);
  
  const trail0X = useSpring(x, { stiffness: 600, damping: 28, mass: 0.5 });
  const trail0Y = useSpring(y, { stiffness: 600, damping: 28, mass: 0.5 });
  const trail1X = useSpring(x, { stiffness: 400, damping: 25, mass: 0.5 });
  const trail1Y = useSpring(y, { stiffness: 400, damping: 25, mass: 0.5 });
  const trail2X = useSpring(x, { stiffness: 250, damping: 20, mass: 0.5 });
  const trail2Y = useSpring(y, { stiffness: 250, damping: 20, mass: 0.5 });
  const trail3X = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const trail3Y = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });
  const trail4X = useSpring(x, { stiffness: 100, damping: 10, mass: 0.5 });
  const trail4Y = useSpring(y, { stiffness: 100, damping: 10, mass: 0.5 });
  const trail5X = useSpring(x, { stiffness: 50, damping: 10, mass: 0.5 });
  const trail5Y = useSpring(y, { stiffness: 50, damping: 10, mass: 0.5 });

  useEffect(() => {
    // Cưỡng chế ẩn con trỏ mặc định trên toàn body
    document.body.style.cursor = 'none';

    const handleResize = () => setWindowHeight(window.innerHeight);
    const handleMove = () => {
      setHasMoved(true);
      window.removeEventListener('mousemove', handleMove);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('[data-hide-cursor="true"]')) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    const unsubscribe = y.on("change", (latestY) => {
      const nearBottom = latestY > windowHeight - 60 && windowHeight > 0;
      if (nearBottom !== isNearBottomRef.current) {
        isNearBottomRef.current = nearBottom;
        setIsNearBottom(nearBottom);
      }
    });

    return () => {
      // Cleanup: trả lại chuột nếu component bị gỡ bỏ
      document.body.style.cursor = 'auto';
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
      unsubscribe();
    };
  }, [y, windowHeight]);

  const trailsData = [
    { size: 10, opacity: 0.8, x: trail0X, y: trail0Y },
    { size: 8, opacity: 0.6, x: trail1X, y: trail1Y },
    { size: 6, opacity: 0.4, x: trail2X, y: trail2Y },
    { size: 4, opacity: 0.3, x: trail3X, y: trail3Y },
    { size: 3, opacity: 0.2, x: trail4X, y: trail4Y },
    { size: 2, opacity: 0.1, x: trail5X, y: trail5Y },
  ];

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-9999"
      style={{ opacity: isVisible && hasMoved ? 1 : 0, transition: 'opacity 0.3s ease', display: isVisible ? 'block' : 'none' }}
    >
      {/* Các hạt nhỏ bám theo (Cursor Trails) */}
      {trailsData.map((trail, index) => {
        return (
          <motion.div
            key={index}
            className="absolute rounded-full bg-linear-to-r from-pink-300 to-blue-300 left-0 top-0"
            style={{
              width: trail.size,
              height: trail.size,
              x: trail.x,
              y: trail.y,
              translateX: "-50%",
              translateY: "-50%",
              opacity: trail.opacity,
            }}
          />
        );
      })}

      {/* Vòng tròn chính (Main Cursor) - Kích thước 12px */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-linear-to-tr from-pink-400 to-blue-400 shadow-[0_0_15px_rgba(251,207,232,0.8)]"
        style={{ 
          width: 12, 
          height: 12,
          x, 
          y,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scaleY: isNearBottom ? [1, 0.6, 1.2, 1] : 1,
          scaleX: isNearBottom ? [1, 1.2, 0.9, 1] : 1,
          marginTop: isNearBottom ? [0, 8, -4, 0] : 0,
        }}
        transition={{
          scaleY: {
            repeat: isNearBottom ? Infinity : 0,
            duration: 1.2,
            ease: 'easeInOut',
          },
          scaleX: {
            repeat: isNearBottom ? Infinity : 0,
            duration: 1.2,
            ease: 'easeInOut',
          },
          marginTop: {
            repeat: isNearBottom ? Infinity : 0,
            duration: 1.2,
            ease: 'easeInOut',
          },
        }}
      />
    </div>
  );
};

export default CustomCursor;