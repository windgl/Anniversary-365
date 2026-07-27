import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress
 * @param {string} position - 'top' (thanh ngang trên) hoặc 'right' (thanh dọc phải)
 * @param {number} thickness - Độ dày (px) cho thanh (mặc định 2)
 * @param {string} fromColor - Màu bắt đầu gradient (mặc định from-pink-400)
 * @param {string} toColor - Màu kết thúc gradient (mặc định to-blue-400)
 */
const ScrollProgress = ({
  position = 'right',
  thickness = 2,
  fromColor = '#f472b6', // pink-400
  toColor = '#60a5fa',   // blue-400
}) => {
  const { scrollYProgress } = useScroll();

  // Hiệu ứng lò xo mượt mà
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Style chung cho thanh nền (track)
  const trackStyle = {
    right: position === 'right' ? 0 : undefined,
    top: position === 'top' ? 0 : undefined,
    width: position === 'right' ? thickness : '100%',
    height: position === 'top' ? thickness : '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(2px)',
    zIndex: 50,
  };

  // Style cho thanh chỉ thị (indicator)
  const indicatorStyle = {
    width: position === 'right' ? '100%' : undefined,
    height: position === 'top' ? '100%' : undefined,
    background: `linear-gradient(${position === 'right' ? 'to bottom' : 'to right'}, ${fromColor}, ${toColor})`,
    boxShadow: `0 0 8px ${fromColor}80`,
    scaleY: position === 'right' ? springProgress : undefined,
    scaleX: position === 'top' ? springProgress : undefined,
    originY: position === 'right' ? 0 : undefined,
    originX: position === 'top' ? 0 : undefined,
  };

  return (
    <div className="fixed pointer-events-none" style={trackStyle}>
      <motion.div
        className="absolute"
        style={{
          ...indicatorStyle,
          left: position === 'right' ? 0 : undefined,
          top: position === 'top' ? 0 : undefined,
          right: position === 'right' ? 0 : undefined,
          bottom: position === 'top' ? 0 : undefined,
          width: position === 'top' ? '100%' : '100%',
          height: position === 'right' ? '100%' : '100%',
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />
    </div>
  );
};

export default ScrollProgress;