 
// src/features/snoopy/SnoopyFloatingImage.jsx
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hàm helper để render SVG hoặc CSS shape dựa vào type
const ParticleShape = ({ shape, color, size }) => {
  if (shape === 'heart') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  
  if (shape === 'star') {
    return (
      <div 
        style={{
          width: size, 
          height: size, 
          backgroundColor: color,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        }}
      />
    );
  }

  if (shape === 'petal') {
    return (
      <div 
        style={{
          width: size, 
          height: size, 
          backgroundColor: color,
          borderRadius: '50% 0 50% 50%',
          transform: 'rotate(45deg)'
        }}
      />
    );
  }

  // default circle
  return (
    <div 
      style={{
        width: size, 
        height: size, 
        backgroundColor: color,
        borderRadius: '50%'
      }}
    />
  );
};

const SnoopyFloatingImage = ({
  src,
  alt,
  size = 160,
  top,
  left,
  right,
  bottom,
  burstColor = '#fbcfe8',
  burstShape = 'circle',
  zIndex = 20,
  onClickExtra
}) => {
  const [particles, setParticles] = useState([]);
  
  // Seed cho độ xoay (rotation) dựa vào độ dài của chuỗi src để nhất quán giữa các lần render
  // KHÔNG dùng Math.random() trực tiếp ở đây để tránh bị nhảy hình mỗi khi re-render
  const baseRotation = useMemo(() => {
    const seed = src ? src.length : 1;
    return (seed % 5) - 2; // Sinh giá trị từ -2 đến +2
  }, [src]);

  const createParticles = useCallback((min, max, minRadius, maxRadius) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const particleSize = 8 + Math.random() * 8;
      
      return {
        id: Date.now() + i + Math.random(),
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: particleSize,
        rotate: Math.random() * 180
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const handleClick = useCallback(() => {
    createParticles(10, 14, 60, 90); // 10-14 hạt, bay xa hơn
    if (onClickExtra) {
      onClickExtra();
    }
  }, [createParticles, onClickExtra]);

  const handleParticleComplete = (id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        top, left, right, bottom, 
        zIndex,
        width: size
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
        <div
          className="relative w-full h-auto"
          style={{ transform: `rotate(${baseRotation}deg)` }}
        >
          <div
            onClick={handleClick}
            style={{ cursor: 'none' }}
          >
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-auto object-contain select-none"
              draggable="false"
            />
          </div>
        </div>

        {/* Hệ thống hạt nổ (Sparkles / Particles) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <AnimatePresence>
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{ 
                  opacity: 0, 
                  x: particle.x, 
                  y: particle.y, 
                  scale: 1,
                  rotate: particle.rotate 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onAnimationComplete={() => handleParticleComplete(particle.id)}
                className="absolute"
                style={{
                  top: -particle.size / 2,
                  left: -particle.size / 2,
                }}
              >
                <ParticleShape shape={burstShape} color={burstColor} size={particle.size} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SnoopyFloatingImage;
