/* eslint-disable react-hooks/purity */
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import useAudioSync from '../hooks/useAudioSync';
import QuoteHeader from '../components/QuoteHeader';
import { FIRST_MESSAGE_DATE } from '../utils/constants';

const prand = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Nền sao lấp lánh
const StarfieldBackground = () => {
    const stars = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        top: `${prand(i * 12) * 100}%`,
        left: `${prand(i * 34) * 100}%`,
        size: prand(i * 56) * 2 + 1,
        opacity: prand(i * 78) * 0.4 + 0.1,
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {stars.map(s => (
                <div
                    key={s.id}
                    className="absolute bg-white rounded-full"
                    style={{
                        top: s.top, left: s.left, width: s.size, height: s.size,
                        opacity: s.opacity
                    }}
                />
            ))}
        </div>
    );
};

// Skyline
const CitySkyline = () => (
  <div className="absolute bottom-0 left-0 w-full h-[20%] pointer-events-none opacity-40">
    <svg viewBox="0 0 1000 100" className="w-full h-full" preserveAspectRatio="none">
      <path d="M0,100 L0,80 L20,80 L20,90 L40,90 L40,60 L60,60 L60,85 L80,85 L80,40 L100,40 L100,70 L120,70 L120,50 L140,50 L140,80 L160,80 L160,30 L180,30 L180,65 L200,65 L200,45 L220,45 L220,90 L240,90 L240,55 L260,55 L260,75 L280,75 L280,35 L300,35 L300,80 L320,80 L320,60 L340,60 L340,90 L360,90 L360,20 L380,20 L380,70 L400,70 L400,40 L420,40 L420,85 L440,85 L440,50 L460,50 L460,75 L480,75 L480,30 L500,30 L500,65 L520,65 L520,45 L540,45 L540,90 L560,90 L560,55 L580,55 L580,80 L600,80 L600,40 L620,40 L620,70 L640,70 L640,25 L660,25 L660,60 L680,60 L680,85 L700,85 L700,50 L720,50 L720,75 L740,75 L740,35 L760,35 L760,80 L780,80 L780,45 L800,45 L800,90 L820,90 L820,55 L840,55 L840,70 L860,70 L860,30 L880,30 L880,65 L900,65 L900,40 L920,40 L920,85 L940,85 L940,50 L960,50 L960,75 L980,75 L980,45 L1000,45 L1000,100 Z" fill="#020617" />
    </svg>
  </div>
);

const SparklerSection = () => {
  const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { playSound } = useAudioSync();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const particlesRef = useRef([]);
  const backgroundFireworksRef = useRef([]);
  const numberParticlesRef = useRef([]);
  const flowerShellsRef = useRef([]);
  
  const dimensions = useRef({ width: 0, height: 0 });
  const animationFrameId = useRef(null);
  
  const cycleTimerRef = useRef(null);
  const cycleStartTime = useRef(0);

  const spawnBackgroundFirework = useCallback((fx, fy) => {
      const newParts = [];
      const num = 15 + Math.random() * 10;
      const hue = Math.floor(Math.random() * 360);
      for (let i = 0; i < num; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.5;
          newParts.push({
              x: fx, y: fy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1, maxLife: 1 + Math.random() * 0.5,
              color: `hsl(${hue}, 100%, 70%)`,
              size: Math.random() * 1.5 + 0.5
          });
      }
      backgroundFireworksRef.current.push(...newParts);
  }, []);

  const spawnNumberFirework = useCallback(() => {
      if (!dimensions.current.width) return;
      
      const daysCount = Math.floor((Date.now() - FIRST_MESSAGE_DATE.getTime()) / 86400000);
      const text = String(daysCount);

      const W = dimensions.current.width;
      const H = dimensions.current.height;
      
      const offCanvas = document.createElement('canvas');
      offCanvas.width = W;
      offCanvas.height = H;
      const offCtx = offCanvas.getContext('2d');

      offCtx.fillStyle = 'black';
      offCtx.fillRect(0, 0, W, H);

      offCtx.font = `900 ${Math.floor(H * 0.45)}px 'Montserrat', 'Arial Black', sans-serif`;
      offCtx.fillStyle = 'white';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, W / 2, H / 2);

      const imgData = offCtx.getImageData(0, 0, W, H).data;
      const anchorPoints = [];
      
      const step = Math.max(5, Math.floor(W / 150)); 
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const i = (y * W + x) * 4;
          const r = imgData[i]; 
          if (r > 128) {
             anchorPoints.push({ x, y });
          }
        }
      }

      const maxPoints = 200;
      if (anchorPoints.length > maxPoints) {
          anchorPoints.sort(() => Math.random() - 0.5);
          anchorPoints.length = maxPoints;
      }

      const colors = ['#ffffff', '#fef08a', '#fb923c'];
      cycleStartTime.current = Date.now();

      numberParticlesRef.current = anchorPoints.map(pt => {
         const startX = W * (0.3 + Math.random() * 0.4); 
         const startY = H + 10;
         
         const delay = Math.random() * 1000; 
         const flightDuration = 1000 + Math.random() * 200; 
         const isAccent = Math.random() < 0.15;
         const color = isAccent ? '#f472b6' : colors[Math.floor(Math.random() * colors.length)];
         
         return {
            targetX: pt.x,
            targetY: pt.y,
            startX,
            startY,
            x: startX,
            y: startY,
            delay,
            flightDuration,
            color,
            state: 'waiting',
            spawnTime: cycleStartTime.current + delay,
            size: Math.random() * 1.5 + 1.5,
            explosionParticles: []
         };
      });

      flowerShellsRef.current = [];
      const sideColors = ['#f472b6', '#fef08a', '#fb923c', '#ffffff', '#aaccff', '#ffddaa'];
      for (let i = 0; i < 6; i++) {
          const isLeft = i % 2 === 0;
          const startX = isLeft ? (W * 0.1 + Math.random() * W * 0.15) : (W * 0.75 + Math.random() * W * 0.15);
          const targetY = H * 0.15 + Math.random() * H * 0.35;
          flowerShellsRef.current.push({
             startX, startY: H + 10,
             targetX: startX, targetY,
             x: startX, y: H + 10,
             flightDuration: 1000 + Math.random() * 200,
             spawnTime: cycleStartTime.current + i * 1000,
             state: 'flying',
             color: sideColors[i % sideColors.length]
          });
      }
  }, []);

  useEffect(() => {
      if (!inView) {
          clearInterval(cycleTimerRef.current);
          return;
      }
      
      let timeoutId;
      const scheduleNextBg = () => {
          const delay = 1500 + Math.random() * 2500;
          timeoutId = setTimeout(() => {
              if (!dimensions.current.width) {
                  scheduleNextBg();
                  return;
              }
              const x = dimensions.current.width * (0.1 + Math.random() * 0.8);
              const y = dimensions.current.height * (0.1 + Math.random() * 0.5);
              spawnBackgroundFirework(x, y);
              scheduleNextBg();
          }, delay);
      };
      scheduleNextBg();

      spawnNumberFirework();
      cycleTimerRef.current = setInterval(() => {
          spawnNumberFirework();
      }, 6000);

      return () => {
          clearTimeout(timeoutId);
          clearInterval(cycleTimerRef.current);
      };
  }, [inView, spawnBackgroundFirework, spawnNumberFirework]);

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
      const now = Date.now();

      // Render mini click fireworks
      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.05; 
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / (p.maxLife * 60);

        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        if (p.isCrackle) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render background fireworks
      const bgParts = backgroundFireworksRef.current;
      for (let i = bgParts.length - 1; i >= 0; i--) {
        const p = bgParts[i];
        p.vy += 0.02; 
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / (p.maxLife * 60);

        if (p.life <= 0) {
          bgParts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life * 0.6; 
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render number fireworks
      const cycleAge = now - cycleStartTime.current;
      const nParts = numberParticlesRef.current;
      
      for (let i = nParts.length - 1; i >= 0; i--) {
         const p = nParts[i];
         const age = now - p.spawnTime;
         
         if (p.state === 'waiting') {
            if (age > 0) p.state = 'flying';
         }

         if (p.state === 'flying') {
            const t = Math.min(age / p.flightDuration, 1);
            const easeOut = 1 - Math.pow(1 - t, 3);
            
            // X travels with ease out, Y travels with sine wave curve
            p.x = p.startX + (p.targetX - p.startX) * easeOut;
            p.y = p.startY + (p.targetY - p.startY) * Math.sin(t * Math.PI / 2);

            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (t >= 1) {
               p.state = 'exploding';
               const numExplode = 4 + Math.random() * 4;
               for (let k = 0; k < numExplode; k++) {
                   const ang = Math.random() * Math.PI * 2;
                   const spd = Math.random() * 1.5 + 0.5;
                   p.explosionParticles.push({
                      x: p.targetX, y: p.targetY,
                      vx: Math.cos(ang) * spd,
                      vy: Math.sin(ang) * spd,
                      life: 1,
                      color: Math.random() < 0.5 ? '#ffffff' : p.color
                   });
               }
            }
         }

         if (p.state === 'exploding' || p.state === 'glowing' || p.state === 'fading') {
             // update explosion bits
             for (let k = p.explosionParticles.length - 1; k >= 0; k--) {
                 const ep = p.explosionParticles[k];
                 ep.x += ep.vx;
                 ep.y += ep.vy;
                 ep.vx *= 0.9;
                 ep.vy *= 0.9;
                 ep.vy += 0.02; 
                 ep.life -= 0.05;
                 if (ep.life > 0) {
                     ctx.save();
                     ctx.globalAlpha = ep.life;
                     ctx.fillStyle = ep.color;
                     ctx.beginPath();
                     ctx.arc(ep.x, ep.y, 1, 0, Math.PI * 2);
                     ctx.fill();
                     ctx.restore();
                 } else {
                     p.explosionParticles.splice(k, 1);
                 }
             }

             // afterglow
             let glowAlpha;
             if (cycleAge > 2500) {
                 p.state = 'fading';
                 glowAlpha = Math.max(0, 1 - (cycleAge - 2500) / 500); 
             } else {
                 p.state = 'glowing';
                 glowAlpha = 0.6 + Math.random() * 0.4;
             }

             if (glowAlpha > 0) {
                 ctx.save();
                 ctx.globalAlpha = glowAlpha;
                 ctx.fillStyle = p.color;
                 ctx.shadowBlur = 8;
                 ctx.shadowColor = p.color;
                 ctx.beginPath();
                 ctx.arc(p.targetX, p.targetY, p.size, 0, Math.PI * 2);
                 ctx.fill();
                 ctx.restore();
             }
         }
      }

      // Render flower shells
      const fShells = flowerShellsRef.current;
      for (let i = fShells.length - 1; i >= 0; i--) {
          const shell = fShells[i];
          if (shell.state === 'flying') {
              const age = now - shell.spawnTime;
              if (age > 0) {
                  const t = Math.min(age / shell.flightDuration, 1);
                  const easeOut = 1 - Math.pow(1 - t, 3);
                  
                  shell.x = shell.startX + (shell.targetX - shell.startX) * easeOut;
                  shell.y = shell.startY + (shell.targetY - shell.startY) * easeOut;
                  
                  ctx.save();
                  ctx.fillStyle = shell.color;
                  ctx.beginPath();
                  ctx.arc(shell.x, shell.y, 2, 0, Math.PI * 2);
                  ctx.fill();
                  
                  ctx.fillStyle = 'rgba(255,255,255,0.5)';
                  ctx.beginPath();
                  ctx.arc(shell.x, shell.y + 5, 1, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();

                  if (t >= 1) {
                      shell.state = 'exploded';
                      playSound('./audio/sfx/firework-pop.mp3', 0.3);
                      const numPoints = 50 + Math.random() * 30;
                      const newParts = [];
                      for (let k = 0; k < numPoints; k++) {
                          const theta = Math.random() * Math.PI * 2;
                          const r = Math.random() * 3 + 1; 
                          newParts.push({
                              x: shell.targetX, y: shell.targetY,
                              vx: Math.cos(theta) * r,
                              vy: Math.sin(theta) * r,
                              life: 1, maxLife: 1.5 + Math.random() * 0.5,
                              color: Math.random() < 0.2 ? '#ffffff' : shell.color,
                              size: Math.random() * 2 + 1
                          });
                      }
                      backgroundFireworksRef.current.push(...newParts);
                  }
              }
          }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const handlePointerDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let cx = e.clientX;
    let cy = e.clientY;
    if (e.touches && e.touches.length > 0) {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    }
    cx -= rect.left;
    cy -= rect.top;

    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const offsetX = (Math.random() - 0.5) * 150;
            const offsetY = (Math.random() - 0.5) * 150;
            spawnMiniFirework(cx + offsetX, cy + offsetY);
            playSound('./audio/sfx/firework-pop.mp3', 0.15 + Math.random() * 0.15);
             
        }, i * 150 + Math.random() * 100);
    }
  };

  const spawnMiniFirework = (fx, fy) => {
      const colors = ['#ffffff', '#fef08a', '#fb923c', '#f472b6'];
      const newParts = [];
      const num = 25 + Math.random() * 15;
      for (let i = 0; i < num; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6 + 2;
          newParts.push({
              x: fx, y: fy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1, maxLife: 0.6 + Math.random() * 0.4,
              color: colors[Math.floor(Math.random() * colors.length)],
              size: Math.random() * 2.5 + 1,
              isCrackle: Math.random() < 0.2
          });
      }
      particlesRef.current.push(...newParts);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[100vh] overflow-hidden bg-gradient-to-b from-[#050208] to-[#0a0a1f] select-none touch-none"
      onPointerDown={handlePointerDown}
    >
      <StarfieldBackground />
      <CitySkyline />

      {/* Content */}
      <div className="absolute top-20 left-0 w-full flex flex-col items-center text-center px-4 z-20 pointer-events-none">
        <QuoteHeader 
          quote="When we love, we always strive to become better than we are. When we strive to become better than we are, everything around us becomes better too." 
          author="Paulo Coelho" 
        />
        <span className="font-montserrat text-[10px] md:text-xs tracking-[0.2em] uppercase text-slate-400 opacity-70 animate-pulse mt-8">
          Chạm vào bầu trời để thêm những tia lửa của riêng em
        </span>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none" ref={containerRef}>
         <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
      </div>
    </section>
  );
};

export default SparklerSection;

