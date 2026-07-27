import { motion } from 'framer-motion';

const VARIANTS = {
  'cloud-drift': {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1.4, ease: 'easeOut' },
    loop: { y: [0, -10, 0] },
    loopTransition: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
  },
  'mist-reveal': {
    initial: { opacity: 0, filter: 'blur(10px)', y: 12 },
    whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
    transition: { duration: 1.8, ease: 'easeOut' },
  },
  'sprout-glow': {
    initial: { opacity: 0, scaleY: 0.4, y: 24 },
    whileInView: { opacity: 1, scaleY: 1, y: 0 },
    transition: { duration: 1.1, ease: [0.34, 1.56, 0.64, 1] },
    loop: { textShadow: [
      '0 0 6px rgba(134,239,172,0.25)',
      '0 0 18px rgba(134,239,172,0.55)',
      '0 0 6px rgba(134,239,172,0.25)',
    ] },
    loopTransition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
  },
  'ripple-rise': {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1.4, ease: 'easeOut' },
    loop: { opacity: [1, 0.82, 1] },
    loopTransition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  'heart-pulse': {
    initial: { opacity: 0, scale: 0.86 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 1 },
    loop: { scale: [1, 1.035, 1] },
    loopTransition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
  'starlight-twinkle': {
    initial: { opacity: 0, letterSpacing: '0.06em' },
    whileInView: { opacity: 1, letterSpacing: '0.02em' },
    transition: { duration: 1.5, ease: 'easeOut' },
    loop: { opacity: [1, 0.72, 1] },
    loopTransition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  'petal-drift': {
    initial: { opacity: 0, x: -16, rotate: -2 },
    whileInView: { opacity: 1, x: 0, rotate: 0 },
    transition: { duration: 1.2, ease: 'easeOut' },
  },
  'none': {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 1 },
  },
  'heartbeat-glow': {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: [0.9, 1.06, 0.98, 1] },
    transition: { duration: 1.2, times: [0, 0.4, 0.7, 1] },
  },
  'confetti-pop': {
    initial: { opacity: 0, scale: 0.6, rotate: -4 },
    whileInView: { opacity: 1, scale: 1, rotate: 0 },
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const StoryNote = ({
  type = 'spoken',
  lines = [],
  songTitle = '',
  songArtist = '',
  position = {},
  theme = {
    gradientClass: 'from-pink-100 via-rose-200 to-amber-100',
    glowColor: 'rgba(251,207,232,0.5)',
  },
  variant = 'cloud-drift',
  maxWidth = 'max-w-md',
  zIndex = 25,
  externalMotionStyle,
  className = '',
  textClassName = '',
  titleClassName = '',
}) => {
  const v = VARIANTS[variant] || VARIANTS['cloud-drift'];

  const posStyle = {
    top: position.top,
    bottom: position.bottom,
    zIndex,
    ...(position.left
      ? { left: position.left }
      : position.right
      ? { right: position.right }
      : { left: '50%', x: '-50%' }),
  };

  const textBlock = (
    <p
      className={`font-cormorant italic leading-relaxed drop-shadow-md ${
        type === 'song' ? 'text-lg sm:text-xl md:text-2xl' : 'text-xl sm:text-2xl md:text-3xl'
      } bg-gradient-to-r ${theme.gradientClass} bg-clip-text text-transparent ${textClassName}`}
      style={{ filter: `drop-shadow(0 0 12px ${theme.glowColor})` }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {type === 'song' && i === 0 ? '"' : ''}
          {line}
          {type === 'song' && i === lines.length - 1 ? '"' : ''}
        </span>
      ))}
    </p>
  );

  const attribution = type === 'song' && (
    <p className={`font-montserrat text-[10px] md:text-xs tracking-[0.2em] uppercase mt-3 ${titleClassName || 'text-white/40'}`}>
      {songTitle} — {songArtist}
    </p>
  );

  // Trường hợp đặc biệt: được điều khiển bởi scrollYProgress bên ngoài (dùng ở Grass.jsx)
  if (externalMotionStyle) {
    return (
      <motion.div
        className={`absolute ${maxWidth} w-full px-6 pointer-events-none select-none text-center ${className}`}
        style={{ ...posStyle, ...externalMotionStyle }}
      >
        {textBlock}
        {attribution}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`absolute ${maxWidth} w-full px-6 pointer-events-none select-none text-center ${className}`}
      style={posStyle}
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once: true, margin: '-60px' }}
      transition={v.transition}
    >
      <motion.div animate={v.loop} transition={v.loopTransition}>
        {textBlock}
        {attribution}
      </motion.div>
    </motion.div>
  );
};

export default StoryNote;
