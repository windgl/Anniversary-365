import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

const useMouseTrack = () => {
  // Sử dụng useMotionValue thay vì useState để không gây re-render
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Dùng useSpring để tạo chuyển động mượt mà cho con trỏ
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    // Lắng nghe sự kiện di chuyển chuột với { passive: true } để tối ưu hiệu năng
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [x, y]);

  return { x: smoothX, y: smoothY };
};

export default useMouseTrack;