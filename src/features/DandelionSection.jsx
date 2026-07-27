import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useAudioSync from '../hooks/useAudioSync';

const prand = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const DandelionPlant = memo(({ f, onBlow }) => {
  return (
    <motion.div
      className="absolute bottom-0 origin-bottom"
      style={{ 
         left: `${f.x}%`, 
         bottom: `${f.bottom}%`,
         transform: `scale(${f.scale})` 
      }}
      animate={{ rotate: [-3, 3] }}
      transition={{ 
          duration: f.swayDuration, 
          repeat: Infinity, 
          repeatType: 'mirror', 
          ease: 'easeInOut',
          delay: f.swayDelay
      }}
    >
      {/* Stem */}
      <svg width="20" height={f.stemHeight} className="overflow-visible" viewBox={`0 0 20 ${f.stemHeight}`}>
        <path d={`M 10 ${f.stemHeight} Q 15 ${f.stemHeight/2} 10 0`} fill="none" stroke="#166534" strokeWidth="1.5" />
      </svg>
      
      {/* Head container */}
      <div 
         className="absolute top-0 left-[10px] -translate-x-1/2 -translate-y-full w-[60px] h-[60px] flex items-center justify-center pointer-events-auto cursor-pointer"
         onClick={(e) => onBlow(f.id, e)}
         onPointerDown={(e) => onBlow(f.id, e)}
      >
        {f.isYellow ? (
          <svg width="30" height="30" viewBox="-15 -15 30 30" className="overflow-visible">
            <circle cx="0" cy="0" r="8" fill="#eab308" />
            {[...Array(14)].map((_, i) => (
              <line key={i} x1="0" y1="0" x2="0" y2="-12" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${i*(360/14)})`} />
            ))}
            <circle cx="0" cy="0" r="4" fill="#ca8a04" />
          </svg>
        ) : (
          <svg width="60" height="60" viewBox="-30 -30 60 60" className="overflow-visible">
            <circle cx="0" cy="0" r="3" fill="#166534" />
            {f.seedCount > 0 && [...Array(f.seedCount)].map((_, i) => {
              const a = (i / 50) * Math.PI * 2; 
              const r = 15 + prand(f.id * 100 + i) * 10;
              const tx = Math.cos(a) * r;
              const ty = Math.sin(a) * r;
              return (
                <g key={i}>
                  <line x1="0" y1="0" x2={tx} y2={ty} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                  <circle cx={tx} cy={ty} r="1" fill="rgba(255,255,255,0.8)" />
                  <path d={`M ${tx} ${ty} L ${tx-2} ${ty-2} M ${tx} ${ty} L ${tx+2} ${ty-2}`} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </motion.div>
  );
});
DandelionPlant.displayName = 'DandelionPlant';

const DandelionSection = () => {
  const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { playSound } = useAudioSync();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [flowers, setFlowers] = useState(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        id: i,
        x: prand(i * 13) * 100,
        bottom: prand(i * 17) * 15 - 5, // -5 to 10
        scale: 0.3 + prand(i * 19) * 0.7, // 0.3 to 1.0
        isYellow: prand(i * 23) > 0.85, // 15% yellow
        seedCount: 50,
        swayDuration: 3 + prand(i * 29) * 2,
        swayDelay: prand(i * 31) * -3,
        stemHeight: 100 + prand(i * 37) * 80,
      });
    }
    return arr.sort((a, b) => a.scale - b.scale);
  });

  const particlesRef = useRef([]);
  const mouseRef = useRef({ lastX: -1000, lastY: -1000 });
  const isHeartFormation = useRef(false);
  const heartTimer = useRef(null);
  const dimensions = useRef({ width: 0, height: 0 });
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      dimensions.current = { width: rect.width, height: rect.height };
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const parts = particlesRef.current;
      const dims = dimensions.current;
      
      const targetHeart = [];
      if (isHeartFormation.current) {
        for (let i=0; i<parts.length; i++) {
            const t = (i / Math.max(1, parts.length)) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            targetHeart.push({
                x: dims.width/2 + hx * 8,
                y: dims.height/2 + hy * 8 - 50
            });
        }
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        
        if (isHeartFormation.current && targetHeart[i]) {
            const tx = targetHeart[i].x;
            const ty = targetHeart[i].y;
            p.vx += (tx - p.x) * 0.02;
            p.vy += (ty - p.y) * 0.02;
            p.vx *= 0.92;
            p.vy *= 0.92;
        } else {
            p.vy += 0.015; // gravity
            p.vx += (Math.sin(p.life * 0.1 + p.id) * 0.02); // wind turbulence
            p.vx *= 0.98; // friction
            p.vy *= 0.98;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003; 
        p.angle = Math.atan2(p.vy, p.vx) + Math.PI/2;

        if (p.life <= 0 || p.y > dims.height + 50 || p.x < -50 || p.x > dims.width + 50) {
          parts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.min(1, p.life * 2);
        
        // fluff
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -6 * p.scale);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(0, -6 * p.scale, 1 * p.scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(0, -6 * p.scale);
        ctx.lineTo(-3 * p.scale, -9 * p.scale);
        ctx.moveTo(0, -6 * p.scale);
        ctx.lineTo(3 * p.scale, -9 * p.scale);
        ctx.moveTo(0, -6 * p.scale);
        ctx.lineTo(-1.5 * p.scale, -10 * p.scale);
        ctx.moveTo(0, -6 * p.scale);
        ctx.lineTo(1.5 * p.scale, -10 * p.scale);
        ctx.stroke();
        
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [inView]);

  const spawnParticles = useCallback((fx, fy, count, initVx, initVy, fScale) => {
    const newParts = [];
    for (let i = 0; i < count; i++) {
      newParts.push({
        id: prand(Date.now() + i) * 10000,
        x: fx + (prand(i) - 0.5) * 15 * fScale,
        y: fy + (prand(i + 1) - 0.5) * 15 * fScale,
        vx: initVx + (prand(i + 2) - 0.5) * 3,
        vy: initVy + (prand(i + 3) - 0.5) * 3 - 1,
        life: 1 + prand(i + 4) * 0.5,
        scale: fScale * (0.8 + prand(i + 5) * 0.4),
        angle: 0
      });
    }
    particlesRef.current.push(...newParts);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    if (clientX === undefined || clientY === undefined) return;

    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    
    if (mouseRef.current.lastX === -1000) {
      mouseRef.current.lastX = cx;
      mouseRef.current.lastY = cy;
      return;
    }

    const vx = cx - mouseRef.current.lastX;
    const vy = cy - mouseRef.current.lastY;
    
    mouseRef.current.lastX = cx;
    mouseRef.current.lastY = cy;

    const vMag = Math.hypot(vx, vy);
    let playedSound = false;

    setFlowers(prev => {
      let changed = false;
      const next = prev.map(f => {
        if (f.isYellow || f.seedCount <= 0) return f;
        
        const dims = dimensions.current;
        const fx = (f.x / 100) * dims.width;
        const fy = dims.height - (f.bottom / 100) * dims.height - f.stemHeight * f.scale;
        
        const dist = Math.hypot(cx - fx, cy - fy);
        
        if (dist < 120 && vMag > 1) { 
          const shedCount = Math.min(f.seedCount, Math.ceil(vMag / 4));
          if (shedCount > 0) {
            changed = true;
            spawnParticles(fx, fy, shedCount, vx * 0.1, vy * 0.1, f.scale);
            
            if (!playedSound) {
               playSound('./audio/sfx/wind-soft.mp3', 0.2);
               playedSound = true;
            }
            return { ...f, seedCount: f.seedCount - shedCount };
          }
        }
        return f;
      });
      return changed ? next : prev;
    });
  }, [spawnParticles, playSound]);

  const handlePointerLeave = () => {
    mouseRef.current.lastX = -1000;
    mouseRef.current.lastY = -1000;
  };

  const handleFlowerClick = useCallback((fId, e) => {
    e.stopPropagation();
    setFlowers(prev => prev.map(f => {
      if (f.id !== fId || f.isYellow || f.seedCount <= 0) return f;
      
      const dims = dimensions.current;
      const fx = (f.x / 100) * dims.width;
      const fy = dims.height - (f.bottom / 100) * dims.height - f.stemHeight * f.scale;
      
      spawnParticles(fx, fy, f.seedCount, 1.5, -2, f.scale);
      playSound('./audio/sfx/dandelion-blow.mp3', 0.5);
      
      if (particlesRef.current.length > 80 && !isHeartFormation.current) {
        isHeartFormation.current = true;
        if (heartTimer.current) clearTimeout(heartTimer.current);
        heartTimer.current = setTimeout(() => {
          isHeartFormation.current = false;
        }, 3000);
      }

      return { ...f, seedCount: 0 };
    }));
  }, [spawnParticles, playSound]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden min-h-[110vh] bg-gradient-to-b from-[#c4b5fd] via-[#fbcfe8] to-[#fed7aa] cursor-crosshair select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
    >
      {/* Clouds */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
         <motion.div 
           className="absolute top-[10%] w-[300px] h-[40px] bg-white rounded-full blur-2xl"
           animate={{ x: ['-100vw', '100vw'] }}
           transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
         />
         <motion.div 
           className="absolute top-[25%] w-[500px] h-[50px] bg-white rounded-full blur-3xl opacity-60"
           animate={{ x: ['100vw', '-100vw'] }}
           transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
         />
      </div>

      {/* Sun rays */}
      <div 
         className="absolute top-0 right-0 w-[150%] h-[150%] origin-top-right rotate-[-15deg] pointer-events-none"
         style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.1) 60%, transparent 100%)', backgroundSize: '100% 200px' }}
      ></div>

      {/* Hills silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-[30%] pointer-events-none">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path fill="#166534" fillOpacity="0.8" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,224C840,224,960,192,1080,170.7C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-[80%]" preserveAspectRatio="none">
          <path fill="#14532d" fillOpacity="1" d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,144C1120,139,1280,181,1360,202.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      {/* Content */}
      <div className="absolute top-20 left-0 w-full flex flex-col items-center text-center px-4 z-20 pointer-events-none">
        
        <span className="font-montserrat text-[10px] md:text-xs tracking-[0.2em] uppercase text-slate-600 opacity-70 animate-pulse mt-8">
          Di chuột hoặc chạm vào bông hoa
        </span>
      </div>

      {/* Dandelions */}
      <div className="absolute inset-0 z-10 pointer-events-none" ref={containerRef}>
        {flowers.map(f => (
          <DandelionPlant key={f.id} f={f} onBlow={handleFlowerClick} />
        ))}
      </div>

      {/* Canvas for flying seeds */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
    </section>
  );
};

export default DandelionSection;
