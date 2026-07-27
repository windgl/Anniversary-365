import { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart } from 'lucide-react';
import { WORD_SPHERE_TAGS } from '../utils/constants';

// Hook tính toán các điểm trên mặt cầu (Fibonacci sphere)
const useSphereWords = (words, radius) => {
  return useMemo(() => {
    const n = words.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    return words.map((word, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      
      return {
        word,
        x: x * radius,
        y: y * radius,
        z: z * radius,
        color: i % 2 === 0 ? '#fbcfe8' : '#fdfbf7', // Hồng pastel và Cream
        font: word.length > 8 ? 'font-cormorant italic' : 'font-playfair'
      };
    });
  }, [words, radius]);
};

// Hạt sáng bay quỹ đạo quanh quả cầu
const OrbitingParticles = ({ radius }) => {
  return (
    <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ perspective: 1000, transformStyle: 'preserve-3d' }}>
      {[...Array(6)].map((_, i) => {
        const tiltX = (Math.sin(i * 123) * 60);
        const tiltY = (Math.sin(i * 321) * 60);
        // Use pseudo-random for duration to satisfy linter but give variation
        const pseudoRand = (Math.sin(i * 456) * 10000) - Math.floor(Math.sin(i * 456) * 10000);
        const duration = 8 + pseudoRand * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
            animate={{ rotateZ: 360 }}
            transition={{ duration, repeat: Infinity, ease: 'linear' }}
          >
            <div 
              className="w-1.5 h-1.5 bg-[#fbcfe8] rounded-full shadow-[0_0_8px_#fbcfe8]" 
              style={{ transform: `translateY(${radius + 40}px)` }} 
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// Nền sao lấp lánh
const StarfieldBackground = () => {
    const stars = useMemo(() => Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        top: `${((Math.sin(i * 12) * 10000) - Math.floor(Math.sin(i * 12) * 10000)) * 100}%`,
        left: `${((Math.sin(i * 34) * 10000) - Math.floor(Math.sin(i * 34) * 10000)) * 100}%`,
        size: ((Math.sin(i * 56) * 10000) - Math.floor(Math.sin(i * 56) * 10000)) * 2 + 1,
        opacity: ((Math.sin(i * 78) * 10000) - Math.floor(Math.sin(i * 78) * 10000)) * 0.5 + 0.3,
        animationDuration: `${2 + ((Math.sin(i * 90) * 10000) - Math.floor(Math.sin(i * 90) * 10000)) * 3}s`
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {stars.map(s => (
                <div
                    key={s.id}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                        top: s.top, left: s.left, width: s.size, height: s.size,
                        opacity: s.opacity, animationDuration: s.animationDuration
                    }}
                />
            ))}
        </div>
    );
};

const WordSphereSection = () => {
  const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const containerRef = useRef(null);
  
  // Responsive radius
  const [radius, setRadius] = useState(165);
  useEffect(() => {
    const handleResize = () => setRadius(window.innerWidth < 768 ? 105 : 165);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const points = useSphereWords(WORD_SPHERE_TAGS, radius);
  
  // Audio loop
  const ambientAudio = useRef(null);
  useEffect(() => {
    if (!ambientAudio.current) {
        ambientAudio.current = new Audio('./audio/ambient/space-hum.mp3');
        ambientAudio.current.loop = true;
        ambientAudio.current.volume = 0.1;
    }
    if (inView) {
        ambientAudio.current.play().catch(() => {}); // ignore autoplay restrictions if any
    } else {
        ambientAudio.current.pause();
    }
  }, [inView]);

  // Rotation states
  const angleX = useRef(0);
  const angleY = useRef(0);
  const velocityX = useRef(0.003);
  const velocityY = useRef(0);
  
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const hoveredIndexRef = useRef(-1);
  const isContainerHovered = useRef(false);

  const wordRefs = useRef([]);

  useAnimationFrame(() => {
    if (!inView) return;

    if (!isDragging.current && !isContainerHovered.current) {
       // Return to default slow spin
       velocityX.current += (0.003 - velocityX.current) * 0.05;
       velocityY.current += (0 - velocityY.current) * 0.05;
    }

    angleX.current += velocityX.current;
    angleY.current -= velocityY.current;

    const cosY = Math.cos(angleX.current);
    const sinY = Math.sin(angleX.current);
    const cosX = Math.cos(angleY.current);
    const sinX = Math.sin(angleY.current);

    const hoverIdx = hoveredIndexRef.current;

    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = points[i];
      
      // Rotate around Y
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.z * cosY + p.x * sinY;
      
      // Rotate around X
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = z1 * cosX + p.y * sinX;

      const zRatio = (z2 + radius) / (2 * radius); // 0 to 1
      const baseScale = 0.6 + zRatio * 0.8;
      const baseOpacity = 0.2 + zRatio * 0.8;
      const baseBlur = z2 < -radius * 0.2 ? `blur(${Math.min(2, Math.abs(z2)/radius * 2)}px)` : 'none';

      let finalScale = baseScale;
      let finalOpacity = baseOpacity;
      let finalBlur = baseBlur;
      let color = p.color;
      let textShadow = 'none';
      let zIndex = Math.round(zRatio * 100);

      if (hoverIdx !== -1) {
          if (hoverIdx === i) {
              finalScale = baseScale * 1.3;
              finalOpacity = 1;
              finalBlur = 'none';
              color = '#f472b6'; // Hồng đậm rực hơn
              textShadow = '0 0 12px rgba(244, 114, 182, 0.8)';
              zIndex = 1000;
          } else {
              finalOpacity *= 0.3;
          }
      }

      el.style.transform = `translate3d(${x1}px, ${y2}px, 0) scale(${finalScale})`;
      el.style.opacity = finalOpacity;
      el.style.filter = finalBlur;
      el.style.color = color;
      el.style.textShadow = textShadow;
      el.style.zIndex = zIndex;
    });
  });

  const handlePointerDown = (e) => {
      isDragging.current = true;
      let cx = e.clientX;
      let cy = e.clientY;
      if (e.touches && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      }
      lastMousePos.current = { x: cx, y: cy };
  };

  const handlePointerMove = (e) => {
      let cx = e.clientX;
      let cy = e.clientY;
      if (e.touches && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      }

      if (cx === undefined || cy === undefined) return;

      if (isDragging.current) {
          const dx = cx - lastMousePos.current.x;
          const dy = cy - lastMousePos.current.y;
          velocityX.current = dx * 0.002;
          velocityY.current = dy * 0.002;
          lastMousePos.current = { x: cx, y: cy };
      } else if (isContainerHovered.current && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = cx - centerX;
          const dy = cy - centerY;
          
          const targetVx = (dx / (rect.width/2)) * 0.015;
          const targetVy = (dy / (rect.height/2)) * 0.015;
          
          velocityX.current += (targetVx - velocityX.current) * 0.05;
          velocityY.current += (targetVy - velocityY.current) * 0.05;
      }
  };

  const handlePointerUp = () => {
      isDragging.current = false;
  };

  const handleWordEnter = (idx) => {
      hoveredIndexRef.current = idx;
      const audio = new Audio('./audio/sfx/word-chime.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
  };

  const handleWordLeave = (idx) => {
      if (hoveredIndexRef.current === idx) {
          hoveredIndexRef.current = -1;
      }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[110vh] overflow-hidden bg-[radial-gradient(circle_at_center,_#4c1d3d_0%,_#020617_80%)] flex flex-col items-center justify-center select-none"
    >
      <StarfieldBackground />

      <div className="absolute top-20 left-0 w-full flex flex-col items-center text-center px-4 z-20 pointer-events-none">
        
      </div>

      <div 
        ref={containerRef}
        className="relative mx-auto mt-20 cursor-grab active:cursor-grabbing"
        style={{ width: radius * 2, height: radius * 2, perspective: 1000, transformStyle: 'preserve-3d' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={() => isContainerHovered.current = true}
        onPointerLeave={() => {
            isContainerHovered.current = false;
            isDragging.current = false;
        }}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <OrbitingParticles radius={radius} />

        {/* Bóng phản chiếu */}
        <div className="absolute left-1/2 bottom-[-60px] -translate-x-1/2 w-[150px] md:w-[250px] h-[20px] bg-black/60 blur-xl rounded-full" />

        {/* Central Heart */}
        <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 blur-[1px]" />
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400 absolute inset-0" />
        </motion.div>

        {/* Words */}
        {points.map((p, i) => (
            <div
                key={i}
                ref={el => wordRefs.current[i] = el}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-200 text-lg md:text-xl whitespace-nowrap ${p.font}`}
                onPointerEnter={() => handleWordEnter(i)}
                onPointerLeave={() => handleWordLeave(i)}
            >
                {p.word}
            </div>
        ))}
      </div>
    </section>
  );
};

export default WordSphereSection;
