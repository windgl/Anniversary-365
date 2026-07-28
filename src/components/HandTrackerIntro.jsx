import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export default function HandTrackerIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  
  const [hasCameraError, setHasCameraError] = useState(false);
  const [showHtmlButton, setShowHtmlButton] = useState(false);
  const [handPresent, setHandPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // High-performance state tracking via refs
  const stateRef = useRef(-1); // Current rendered state
  const targetStateRef = useRef(-1); // Target state based on AI
  const stateTimerRef = useRef(0); // Debounce timer for state changes
  const isReadyToStart = useRef(false); // Flag set when State 5 is reached

  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  const isExploding = useRef(false); // Flag when transitioning to HTML button
  const cameraFrameId = useRef(null);
  const streamRef = useRef(null);
  const avoidPointsRef = useRef([]);

  const ambientAudioRef = useRef(null);
  const transitionAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio('./audio/ambient/space-hum.mp3');
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.5;
    }

    if (!transitionAudioRef.current) {
      transitionAudioRef.current = new Audio('./audio/sfx/lantern-release.mp3');
      transitionAudioRef.current.volume = 0.7;
    }

    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio('./audio/sfx/word-chime.mp3');
      hoverAudioRef.current.volume = 0.6;
    }

    const unlockAudio = () => {
      if (!audioUnlockedRef.current) {
        if (ambientAudioRef.current) {
          const playPromise = ambientAudioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              audioUnlockedRef.current = true;
              
              // Silently unlock other audio elements to bypass iOS/Safari restrictions
              if (transitionAudioRef.current) {
                transitionAudioRef.current.play().then(() => {
                  transitionAudioRef.current.pause();
                  transitionAudioRef.current.currentTime = 0;
                }).catch(() => {});
              }
              if (hoverAudioRef.current) {
                hoverAudioRef.current.play().then(() => {
                  hoverAudioRef.current.pause();
                  hoverAudioRef.current.currentTime = 0;
                }).catch(() => {});
              }

              window.removeEventListener('click', unlockAudio);
              window.removeEventListener('touchstart', unlockAudio);
              window.removeEventListener('keydown', unlockAudio);
            }).catch(e => console.log('Unlock failed:', e));
          }
        }
      }
    };

    unlockAudio(); // Try immediately since user already clicked "Bắt đầu"

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);

      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current.src = '';
        ambientAudioRef.current = null;
      }
      if (transitionAudioRef.current) {
        transitionAudioRef.current.pause();
        transitionAudioRef.current.src = '';
        transitionAudioRef.current = null;
      }
      if (hoverAudioRef.current) {
        hoverAudioRef.current.pause();
        hoverAudioRef.current.src = '';
        hoverAudioRef.current = null;
      }
    };
  }, []);

  // 1. Initial Spawning (Crucial)
  const initParticles = useCallback(() => {
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const particles = [];

    for (let i = 0; i < 3000; i++) {
      let px = Math.random() * cw;
      let py = Math.random() * ch;

      particles.push({
        x: px, 
        y: py,
        targetX: px,
        targetY: py,
        vx: 0,
        vy: 0,
        baseSize: 1.2 + Math.random() * 0.8,
        color: '#e2e8f0', // default
        shadowColor: '#cbd5e1',
        springFactor: 0.03 + Math.random() * 0.02,
        friction: 0.85,
        speed: 0.02 + Math.random() * 0.03,
        uniqueSeed: Math.random() * 1000,
        isHeart: false,
        baseTargetX: px,
        baseTargetY: py,
        noiseOffset: Math.random() * 1000,
        noiseSpeed: 0.001 + Math.random() * 0.002,
        alpha: 1.0
      });
    }
    particlesRef.current = particles;
  }, []);

  // 2. Off-screen Text Coordinate Extraction
  const getTextCoordinates = useCallback((text, isButton = false, isLongText = false) => {
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const off = document.createElement('canvas');
    off.width = cw;
    off.height = ch;
    const ctx = off.getContext('2d');
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);
    
    let fontSize = Math.min(cw * 0.3, ch * 0.4);
    if (['1', '2', '3'].includes(text)) {
      fontSize = ch * 0.5; // Scale to 50% screen height
    } else if (text.length > 50) {
      fontSize = Math.min(cw * 0.04, 28);
    } else if (isLongText) {
      fontSize = Math.min(cw * 0.08, 80);
    } else if (isButton) {
      fontSize = Math.min(cw * 0.08, 60);
    }

    ctx.font = `900 ${fontSize}px 'Exo 2', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#ffffff';
    // Draw text with a slight offset to ensure no clipping
    if (text.length > 50) {
      const words = text.split(' ');
      let line = '';
      let yOff = ch / 2 - 40;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > Math.min(cw * 0.8, 600) && n > 0) {
          ctx.fillText(line.trim(), cw / 2, yOff);
          line = words[n] + ' ';
          yOff += fontSize * 1.5;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), cw / 2, yOff);
    } else {
      ctx.fillText(text, cw / 2, ch / 2);
    }

    const data = ctx.getImageData(0, 0, cw, ch).data;
    const points = [];
    
    // Resolution step - adjust for density
    const step = 6; 
    for (let y = 0; y < ch; y += step) {
      for (let x = 0; x < cw; x += step) {
        if (data[(y * cw + x) * 4] > 128) {
          points.push({ x, y });
        }
      }
    }
    
    // Shuffle the points to distribute particles randomly
    for (let i = points.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [points[i], points[j]] = [points[j], points[i]];
    }
    return points;
  }, []);

  // 4. State Target Assignment Matrix
  const assignTargets = useCallback((state) => {
    const cw = window.innerWidth;
    let points = [];
    let color = '#e2e8f0';
    let shadowColor = '#cbd5e1';

    if (state === 1) {
      points = getTextCoordinates('anh');
      color = '#fbbf24'; 
      shadowColor = '#f59e0b';
    } else if (state === 2) {
      points = getTextCoordinates('yêu');
      color = '#22d3ee'; 
      shadowColor = '#06b6d4';
    } else if (state === 3) {
      points = getTextCoordinates('em');
      color = '#e879f9'; 
      shadowColor = '#d946ef';
    } else if (state === 4) {
      points = getTextCoordinates('I ♥ U');
    } else if (state === 5) {
      points = getTextCoordinates('only for my love', false, true);
      color = '#f9a8d4'; 
      shadowColor = '#f9a8d4';
    }

    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.isHeart = false;

      if (state === -1 || state === 0) {
        p.color = Math.random() > 0.5 ? '#e2e8f0' : '#cbd5e1';
        p.shadowColor = '#cbd5e1';
      } else if (points.length > 0) {
        // Map overflow particles into existing points
        const pt = points[i % points.length];
        p.targetX = pt.x;
        p.targetY = pt.y;
        
        if (state === 1) {
          p.color = '#fbbf24'; 
          p.shadowColor = '#f59e0b';
        } else if (state === 2) {
          p.color = Math.random() > 0.5 ? '#22d3ee' : '#06b6d4'; 
          p.shadowColor = '#06b6d4';
        } else if (state === 3) {
          p.color = Math.random() > 0.5 ? '#e879f9' : '#d946ef'; 
          p.shadowColor = '#d946ef';
        } else if (state === 4) {
          if (pt.x > cw * 0.4 && pt.x < cw * 0.6) { // Adjusted bounding for Heart
            p.color = '#f43f5e'; 
            p.shadowColor = '#be123c';
            p.isHeart = true;
          } else {
            p.color = '#ffffff'; 
            p.shadowColor = '#e2e8f0';
          }
        } else {
          p.color = color;
          p.shadowColor = shadowColor;
        }
      }
    }
  }, [getTextCoordinates]);

  // 5. The Hand Drop Trigger Event
  const triggerExplosion = useCallback(() => {
    isExploding.current = true;
    
    // Disconnect AI model tracking completely
    if (cameraFrameId.current) {
      cancelAnimationFrame(cameraFrameId.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Particles explode outwards
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.x - cw / 2;
      const dy = p.y - ch / 2;
      const dist = Math.hypot(dx, dy) || 1;
      const dirX = dx / dist;
      const dirY = dy / dist;
      
      const speed = 15.0 + Math.random() * 10.0; // 15 to 25 scalar
      p.vx = dirX * speed;
      p.vy = dirY * speed;
      p.friction = 0.98; // smooth explosion decay
    }

    setTimeout(() => {
      setShowHtmlButton(true);
    }, 2000);
  }, []);

  // 6. Logic handlers
  const countFingers = (landmarks) => {
    let fingers = 0;
    const tips = [8, 12, 16, 20];
    const dips = [7, 11, 15, 19];
    const pips = [6, 10, 14, 18];
    const mcps = [5, 9, 13, 17];
    const wrist = landmarks[0];

    for (let i = 0; i < 4; i++) {
      const tip = landmarks[tips[i]];
      const dip = landmarks[dips[i]];
      const pip = landmarks[pips[i]];
      const mcp = landmarks[mcps[i]];

      const distMcpTip = Math.hypot(tip.x - mcp.x, tip.y - mcp.y);
      const distMcpPip = Math.hypot(pip.x - mcp.x, pip.y - mcp.y);
      const distPipDip = Math.hypot(dip.x - pip.x, dip.y - pip.y);
      const distDipTip = Math.hypot(tip.x - dip.x, tip.y - dip.y);
      
      const totalLength = distMcpPip + distPipDip + distDipTip;
      const isStraight = distMcpTip > totalLength * 0.85;

      const distWristTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      const distWristPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);

      if (isStraight && distWristTip > distWristPip) {
        fingers++;
      }
    }

    // Thumb logic
    const thumbTip = landmarks[4];
    const thumbIp = landmarks[3];
    const thumbMcp = landmarks[2];
    const thumbCmc = landmarks[1];
    
    const distCmcTip = Math.hypot(thumbTip.x - thumbCmc.x, thumbTip.y - thumbCmc.y);
    const distCmcMcp = Math.hypot(thumbMcp.x - thumbCmc.x, thumbMcp.y - thumbCmc.y);
    const distMcpIp = Math.hypot(thumbIp.x - thumbMcp.x, thumbIp.y - thumbMcp.y);
    const distIpTip = Math.hypot(thumbTip.x - thumbIp.x, thumbTip.y - thumbIp.y);
    
    const thumbTotal = distCmcMcp + distMcpIp + distIpTip;
    const isThumbStraight = distCmcTip > thumbTotal * 0.85;
    
    const indexMcp = landmarks[5];
    const distThumbTipToIndex = Math.hypot(thumbTip.x - indexMcp.x, thumbTip.y - indexMcp.y);
    const distThumbMcpToIndex = Math.hypot(thumbMcp.x - indexMcp.x, thumbMcp.y - indexMcp.y);

    if (isThumbStraight && distThumbTipToIndex > distThumbMcpToIndex) {
      fingers++;
    }

    return Math.min(fingers, 5);
  };

  const updateStateFromFingers = useCallback((fingers) => {
    if (fingers === targetStateRef.current) return;
    targetStateRef.current = fingers;
    stateTimerRef.current = Date.now();
  }, []);

  // Initialization Effect
  useEffect(() => {
    let isMounted = true;
    let handLandmarker;
    let lastVideoTime = -1;

    const initializeModel = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("MediaDevices API not supported");
        }

        // Load WASM dynamically via jsdelivr to avoid bundle bloat
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.9,
          minHandPresenceConfidence: 0.9,
          minTrackingConfidence: 0.9
        });
        
        if (!isMounted) return;

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.addEventListener("loadeddata", predictWebcam);
        }
      } catch {
        if (isMounted) {
          setHasCameraError(true);
          setIsLoading(false);
        }
      }
    };

    const predictWebcam = () => {
      if (!isMounted || !videoRef.current || isExploding.current || !handLandmarker) return;
      setIsLoading(false); 
      
      const videoElement = videoRef.current;
      const startTimeMs = performance.now();
      
      if (videoElement.currentTime !== lastVideoTime) {
        lastVideoTime = videoElement.currentTime;
        const results = handLandmarker.detectForVideo(videoElement, startTimeMs);
        
        if (results.landmarks && results.landmarks.length > 0) {
          setHandPresent(true);
          const fingers = countFingers(results.landmarks[0]);
          updateStateFromFingers(fingers);

          if (fingers === 5) {
            isReadyToStart.current = true;
          }

        } else {
          setHandPresent(false);
          updateStateFromFingers(-1);

          // The "Drop Hand" Trigger: Only when hand lowered AFTER state 5 was reached
          if (isReadyToStart.current && !isExploding.current) {
            triggerExplosion();
          }
        }
      }
      cameraFrameId.current = requestAnimationFrame(predictWebcam);
    };

    initializeModel();

    return () => {
      isMounted = false;
      if (cameraFrameId.current) {
        cancelAnimationFrame(cameraFrameId.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [updateStateFromFingers, triggerExplosion]);

  // High-Performance Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      avoidPointsRef.current = getTextCoordinates('Em bé của anh hãy xem trên máy tính và nhấn F11 (toàn màn hình) để có trải nghiệm tốt nhất nhe', false, true);
      if (!isExploding.current && stateRef.current > 0) {
        assignTargets(stateRef.current);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    initParticles();

    // Do NOT auto-assign targets on load; let them drift (State -1) until a hand is found or 0 fingers sets State 0

    const drawLoop = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      const cw = canvasRef.current.width;
      const ch = canvasRef.current.height;

      // Absolute black backdrop
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, cw, ch);

      const now = Date.now();
      const globalTime = now * 0.001;

      // Debounced State Transition (400ms to allow smooth hand forming)
      if (targetStateRef.current !== stateRef.current) {
        if (now - stateTimerRef.current > 400) {
          if (stateRef.current !== targetStateRef.current) {
            if (transitionAudioRef.current) {
              transitionAudioRef.current.currentTime = 0;
              transitionAudioRef.current.play().catch(e => console.log('Audio error:', e));
            }
          }
          stateRef.current = targetStateRef.current;
          if (!isExploding.current) {
            assignTargets(stateRef.current);
          }
        }
      }

      const particles = particlesRef.current;
      // Heartbeat Math (Scale up and down 8%)
      const heartPulse = 1 + Math.cos(now * 0.005) * 0.08;
      const cx = cw / 2;
      const cy = ch / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isExploding.current) {
          let tx, ty;

          if (stateRef.current === -1) {
            // State -1: Full screen scatter and drift, avoiding text
            p.x += Math.sin(globalTime * p.speed + p.uniqueSeed) * 0.5;
            p.y += Math.cos(globalTime * p.speed + p.uniqueSeed) * 0.5;
            
            const avoidPts = avoidPointsRef.current;
            const threshold = 16;
            const thresholdSq = threshold * threshold;
            let hit = false;
            let repX = 0;
            let repY = 0;
            for (let j = 0; j < avoidPts.length; j += 2) { // check every 2nd for perf but cleaner than 4th
              const apt = avoidPts[j];
              const dx = p.x - apt.x;
              const dy = p.y - apt.y;
              if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
                 const distSq = dx * dx + dy * dy;
                 if (distSq < thresholdSq) {
                   const dist = Math.sqrt(distSq) || 1;
                   repX += (dx / dist) * 2;
                   repY += (dy / dist) * 2;
                   hit = true;
                 }
              }
            }
            if (hit) {
              p.vx += repX;
              p.vy += repY;
            }
            tx = p.x;
            ty = p.y;
          } else if (stateRef.current === 0) {
            // State 0: Chaotic Nebula at center
            const time = now * p.noiseSpeed + p.noiseOffset;
            const noiseX = Math.sin(time) * 60 + Math.cos(time * 1.5) * 30;
            const noiseY = Math.cos(time * 0.8) * 60 + Math.sin(time * 1.2) * 30;
            tx = cx + noiseX;
            ty = cy + noiseY;
          } else {
            tx = p.targetX;
            ty = p.targetY;
            if (p.isHeart) {
               tx = cx + (tx - cx) * heartPulse;
               ty = cy + (ty - cy) * heartPulse;
            }
          }

          let dx = tx - p.x;
          let dy = ty - p.y;

          if (stateRef.current !== -1) {
            // Advanced Spring Physics (No LERP)
            p.vx += dx * p.springFactor; 
            p.vy += dy * p.springFactor;
            p.vx *= p.friction; 
            p.vy *= p.friction;
            p.x += p.vx;
            p.y += p.vy;

            // Organic Micro-Jitter (Firefly Effect)
            p.x += Math.sin(globalTime * p.speed * 10 + p.uniqueSeed) * 0.5;
            p.y += Math.cos(globalTime * p.speed * 10 + p.uniqueSeed) * 0.5;
          } else {
             // For state -1, we still want friction and velocity to apply for repulsion!
             p.vx *= 0.9; 
             p.vy *= 0.9;
             p.x += p.vx;
             p.y += p.vy;
             
             // screen wrap
             if (p.x < 0) p.x = cw;
             if (p.x > cw) p.x = 0;
             if (p.y < 0) p.y = ch;
             if (p.y > ch) p.y = 0;
          }
        } else {
          // Explosion physics
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.x += p.vx;
          p.y += p.vy;
          // Fade decay
          p.alpha -= 0.01;
          if (p.alpha < 0) p.alpha = 0;
        }

        if (p.alpha > 0) {
          ctx.globalAlpha = p.alpha;
          // Glow Rendering
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.shadowColor || p.color;
          ctx.fillStyle = p.color;
          
          ctx.beginPath();
          // Sharp intense core
          ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animationFrameId.current = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [assignTargets, initParticles, getTextCoordinates]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#050505] overflow-hidden z-[9999] cursor-auto" style={{ fontFamily: "'Exo 2', sans-serif" }}>
      
      {/* Hidden Camera Feed */}
      <video ref={videoRef} autoPlay playsInline muted className="opacity-0 absolute z-[-1] hidden pointer-events-none" />
      
      {/* The Visual Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

      <AnimatePresence>
        {!handPresent && !hasCameraError && !showHtmlButton && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 px-4"
          >
            {/* Warm UX Notification */}
            <p className="text-[#fdfbf7] opacity-60 text-center max-w-lg text-lg lg:text-xl leading-relaxed animate-pulse">
              Em bé của anh hãy xem trên máy tính và nhấn F11 (toàn màn hình) để có trải nghiệm tốt nhất nhe
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Subtle Gesture Hint */}
        {!hasCameraError && !showHtmlButton && !isLoading && (
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none w-full px-4 text-center"
           >
              <p className="text-[#fdfbf7] opacity-30 text-sm md:text-base tracking-wide whitespace-nowrap">
                Em hãy giơ bàn tay lên và từ từ đếm từ 0 đến 5 nhé (nếu tính năng hog hoạt động thì em nhấn F5 nho)
              </p>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && !hasCameraError && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none"
          >
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin mb-4" />
            <p className="text-[#fdfbf7] opacity-50 text-sm animate-pulse tracking-widest uppercase">Đang tải</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Permission Fallback Modal */}
        {hasCameraError && !showHtmlButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-[#050505]/60 backdrop-blur-md"
          >
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl text-center max-w-sm shadow-2xl">
              <h2 className="text-2xl text-[#fdfbf7] mb-3">Chưa có Camera</h2>
              <p className="text-[#fdfbf7] opacity-60 mb-8 text-sm leading-relaxed">Tính năng này cần sử dụng camera một chút, em đồng ý cấp quyền để trải nghiệm nha</p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#fdfbf7] rounded-full transition duration-300"
                >
                  Thử lại Camera
                </button>
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-pink-500/80 hover:bg-pink-500 text-white rounded-full transition duration-300 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                >
                  Bỏ qua bước này
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* The HTML Button Fade-in on Drop Hand */}
        {showHtmlButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto"
          >
            <button
              onClick={onComplete}
              onMouseEnter={() => {
                if (hoverAudioRef.current) {
                  hoverAudioRef.current.currentTime = 0;
                  hoverAudioRef.current.play().catch(e => console.log(e));
                }
              }}
              className="text-[#fdfbf7] text-2xl font-bold tracking-widest hover:text-pink-300 hover:scale-105 transition-all duration-500"
            >
              Tiếp tục
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
