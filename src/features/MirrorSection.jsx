 
import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart } from 'lucide-react';
import useAudioSync from '../hooks/useAudioSync';
import QuoteHeader from '../components/QuoteHeader';

const prand = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const WillowBranch = ({ position }) => (
    <svg viewBox="0 0 100 150" className={`absolute top-0 ${position === 'left' ? 'left-0' : 'right-0 scale-x-[-1]'} w-32 md:w-48 h-auto opacity-80 pointer-events-none z-20`} fill="#06101c">
        <path d="M0,0 Q50,0 70,50 Q60,80 50,120 Q40,150 45,150 Q55,100 80,60 Q90,100 85,140 Q90,130 100,80 Q90,30 0,0 Z" />
        <path d="M20,0 Q40,40 30,100 Q25,120 28,120 Q35,80 50,40 Z" />
        <path d="M30,0 Q60,30 55,90 Q50,130 55,130 Q65,80 80,20 Z" />
    </svg>
);

const MirrorSection = () => {
    const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
    const { playSound } = useAudioSync();
    
    const canvasRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fontLoaded, setFontLoaded] = useState(false);
    
    const isAudioPlaying = useRef(false);
    const isFullyRevealedRef = useRef(false);
    const lastProgress = useRef(0);
    
    const dropRippleRef = useRef(null);

    useEffect(() => {
        document.fonts.ready.then(() => setFontLoaded(true));
    }, []);

    useEffect(() => {
        if (!fontLoaded || !inView) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const scale = window.innerWidth < 768 ? 0.35 : 0.25;
        const rect = canvas.getBoundingClientRect();
        const W = Math.floor(rect.width * scale);
        const H = Math.floor(rect.height * scale);
        
        canvas.width = W;
        canvas.height = H;
        
        let buffer1 = new Int16Array(W * H);
        let buffer2 = new Int16Array(W * H);
        
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = W; bgCanvas.height = H;
        const bgCtx = bgCanvas.getContext('2d', { willReadFrequently: true });
        
        const textCanvas = document.createElement('canvas');
        textCanvas.width = W; textCanvas.height = H;
        const textCtx = textCanvas.getContext('2d', { willReadFrequently: true });
        
        // Render text
        textCtx.fillStyle = '#000000';
        textCtx.fillRect(0, 0, W, H);
        textCtx.clearRect(0, 0, W, H); // clear alpha to 0
        textCtx.fillStyle = '#ffffff';
        textCtx.font = `italic ${Math.floor(W * 0.15)}px 'Cormorant Garamond', serif`;
        textCtx.textAlign = 'center';
        textCtx.textBaseline = 'middle';
        textCtx.fillText('anh yêu em', W / 2, H / 2);
        
        const textData = textCtx.getImageData(0, 0, W, H).data;
        
        const ctx = canvas.getContext('2d', { alpha: false });
        const outData = ctx.createImageData(W, H);
        
        // Init alpha channel
        for (let i = 3; i < outData.data.length; i += 4) {
            outData.data[i] = 255;
        }

        const fishes = Array.from({length: 4}).map(() => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            color: Math.random() > 0.4 ? '#f97316' : '#ffffff' 
        }));
        
        const petals = Array.from({length: 6}).map(() => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: 0.1 + Math.random() * 0.2, vy: (Math.random() - 0.5) * 0.1,
            size: 1.5 + Math.random() * 1.5
        }));

        let animId;
        let firstInteractionTime = null;
        let accumulatedDropPower = 0;

        dropRippleRef.current = (x, y, radius, power) => {
            if (!firstInteractionTime) firstInteractionTime = Date.now();
            
            accumulatedDropPower += power * radius;
            let currentProgress = Math.min(100, (accumulatedDropPower / 300000) * 100);
            if (currentProgress - lastProgress.current > 1) {
                lastProgress.current = currentProgress;
                setProgress(currentProgress);
            }
            if (!isFullyRevealedRef.current && accumulatedDropPower > 300000) {
                isFullyRevealedRef.current = true;
                setIsRevealed(true);
                playSound('./audio/sfx/wind-chime.mp3', 0.6);
            }

            for (let iy = -radius; iy <= radius; iy++) {
                for (let ix = -radius; ix <= radius; ix++) {
                    if (ix * ix + iy * iy <= radius * radius) {
                        let px = x + ix;
                        let py = y + iy;
                        if (px > 0 && px < W - 1 && py > 0 && py < H - 1) {
                            buffer1[py * W + px] += power;
                        }
                    }
                }
            }
        };

        const render = () => {
            // Draw background
            bgCtx.fillStyle = '#0b1e33';
            bgCtx.fillRect(0, 0, W, H);
            
            // Reflected moon
            bgCtx.fillStyle = 'rgba(253, 251, 247, 0.15)';
            bgCtx.beginPath();
            bgCtx.arc(W / 2, -H * 0.1, W * 0.15, 0, Math.PI * 2);
            bgCtx.fill();
            
            // Reflected stars
            bgCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for(let i=0; i<15; i++) {
                let sx = (i * 73) % W;
                let sy = (i * 37) % (H/2);
                bgCtx.fillRect(sx, sy, 1, 1);
            }

            // Fishes
            fishes.forEach(f => {
                f.x += f.vx; f.y += f.vy;
                if (f.x < 0) f.x += W; if (f.x > W) f.x -= W;
                if (f.y < 0) f.y += H; if (f.y > H) f.y -= H;
                bgCtx.fillStyle = f.color;
                bgCtx.globalAlpha = 0.2; 
                bgCtx.beginPath();
                bgCtx.ellipse(f.x, f.y, 5, 2, Math.atan2(f.vy, f.vx), 0, Math.PI * 2);
                bgCtx.fill();
            });
            
            bgCtx.globalAlpha = 1.0;
            petals.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x > W + 10) p.x = -10;
                if (p.y < 0) p.y += H; if (p.y > H) p.y -= H;
                bgCtx.fillStyle = '#fbcfe8';
                bgCtx.globalAlpha = 0.6;
                bgCtx.beginPath();
                bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                bgCtx.fill();
            });
            bgCtx.globalAlpha = 1.0;

            const bgPixels = bgCtx.getImageData(0, 0, W, H).data;
            const destPixels = outData.data;

            let now = Date.now();
            let baseTextAlpha = 0;
            if (firstInteractionTime && now > firstInteractionTime + 6000) {
                let elapsed = now - (firstInteractionTime + 6000);
                baseTextAlpha = Math.min(255, (elapsed / 60000) * 255);
            }
            if (isFullyRevealedRef.current) {
                baseTextAlpha = 255;
            }

            for (let y = 0; y < H; y++) {
                for (let x = 0; x < W; x++) {
                    let idx = y * W + x;
                    let val = 0;
                    if (x > 0 && x < W - 1 && y > 0 && y < H - 1) {
                        val = ((buffer1[idx - 1] + buffer1[idx + 1] + buffer1[idx - W] + buffer1[idx + W]) >> 1) - buffer2[idx];
                        val -= val >> 5;
                        buffer2[idx] = val;
                    }
                    
                    let dx = (x < W - 1) ? buffer2[idx + 1] - val : 0;
                    let dy = (y < H - 1) ? buffer2[idx + W] - val : 0;
                    
                    let sx = x + (dx >> 3);
                    let sy = y + (dy >> 3);
                    
                    if (sx < 0) sx = 0; else if (sx >= W) sx = W - 1;
                    if (sy < 0) sy = 0; else if (sy >= H) sy = H - 1;
                    
                    let srcIdx = (sy * W + sx) << 2;
                    let destIdx = idx << 2;
                    
                    let r = bgPixels[srcIdx];
                    let g = bgPixels[srcIdx + 1];
                    let b = bgPixels[srcIdx + 2];
                    
                    let tA = textData[srcIdx + 3];
                    if (tA > 0) {
                        let reveal = baseTextAlpha + Math.abs(val) * 6;
                        if (isFullyRevealedRef.current) reveal = 255;
                        else if (reveal > 255) reveal = 255;
                        
                        if (reveal > 0) {
                            let alphaRatio = (reveal * tA) / 65025;
                            r = r + (255 - r) * alphaRatio;
                            g = g + (255 - g) * alphaRatio;
                            b = b + (255 - b) * alphaRatio;
                        }
                    }
                    
                    let shade = dx >> 1;
                    
                    destPixels[destIdx] = Math.min(255, Math.max(0, r + shade));
                    destPixels[destIdx + 1] = Math.min(255, Math.max(0, g + shade));
                    destPixels[destIdx + 2] = Math.min(255, Math.max(0, b + shade));
                }
            }

            let temp = buffer1;
            buffer1 = buffer2;
            buffer2 = temp;

            ctx.putImageData(outData, 0, 0);
            animId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animId);
    }, [fontLoaded, inView, playSound]);

    const handlePointerMove = (e) => {
        if (!dropRippleRef.current || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        let cx = e.clientX;
        let cy = e.clientY;
        if (e.touches && e.touches.length > 0) {
            cx = e.touches[0].clientX;
            cy = e.touches[0].clientY;
        }
        
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        
        const canvasX = Math.floor((cx - rect.left) * scaleX);
        const canvasY = Math.floor((cy - rect.top) * scaleY);
        
        dropRippleRef.current(canvasX, canvasY, 2, 300);
        
        if (!isAudioPlaying.current) {
            playSound('./audio/sfx/water-ripple.mp3', 0.1);
            isAudioPlaying.current = true;
            setTimeout(() => { isAudioPlaying.current = false; }, 200);
        }
    };

    const handlePointerDown = (e) => {
        if (!dropRippleRef.current || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        let cx = e.clientX;
        let cy = e.clientY;
        if (e.touches && e.touches.length > 0) {
            cx = e.touches[0].clientX;
            cy = e.touches[0].clientY;
        }
        
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        
        const canvasX = Math.floor((cx - rect.left) * scaleX);
        const canvasY = Math.floor((cy - rect.top) * scaleY);
        
        dropRippleRef.current(canvasX, canvasY, 6, 1200);
        playSound('./audio/sfx/water-ripple.mp3', 0.4);
    };

    const stars = useMemo(() => Array.from({length: 40}).map((_, i) => ({
        id: i,
        top: `${prand(i * 12) * 100}%`,
        left: `${prand(i * 34) * 100}%`,
        width: prand(i * 56) * 2 + 1,
        height: prand(i * 78) * 2 + 1,
        opacity: prand(i * 90) * 0.5 + 0.1
    })), []);

    return (
        <section 
            ref={sectionRef}
            className="relative w-full min-h-[100vh] flex flex-col bg-[#0b1e33] overflow-hidden select-none touch-none"
        >
            <div className="absolute top-10 w-full flex flex-col items-center text-center px-4 z-40 pointer-events-none">
                <QuoteHeader 
                    quote="I love thee to the depth and breadth and height my soul can reach." 
                    author="Elizabeth Barrett Browning" 
                    source="Sonnets from the Portuguese" 
                />
            </div>

            {/* Progress indicator */}
            <div className="absolute top-8 right-8 z-30 opacity-60 pointer-events-none hidden md:block">
                <Heart className="text-slate-500 absolute inset-0" strokeWidth={1.5} />
                <Heart 
                    className="text-pink-400 fill-pink-400 absolute inset-0 transition-all duration-200" 
                    strokeWidth={1.5} 
                    style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} 
                />
            </div>

            {/* Sky Section */}
            <div className="h-[30vh] w-full bg-gradient-to-b from-[#0b1e33] to-[#1e3a5f] relative overflow-hidden pointer-events-none z-10 border-b border-[#1e3a5f]/50">
                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-16 md:w-24 h-16 md:h-24 bg-[#fdfbf7] rounded-full shadow-[0_0_40px_rgba(253,251,247,0.5)]" />
                
                {/* Stars */}
                {stars.map((star) => (
                    <div key={star.id} className="absolute bg-white rounded-full" style={{
                        top: star.top,
                        left: star.left,
                        width: star.width,
                        height: star.height,
                        opacity: star.opacity
                    }} />
                ))}
                
                <WillowBranch position="left" />
                <WillowBranch position="right" />
            </div>

            {/* Lake Section */}
            <div 
                className="flex-1 w-full relative"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onTouchMove={handlePointerMove}
            >
                <canvas ref={canvasRef} className="w-full h-full object-cover touch-none" />
                
                <AnimatePresence>
                    {isRevealed && (
                        <motion.div 
                            className="absolute inset-0 pointer-events-none flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2 }}
                        >
                            <div className="absolute inset-0 bg-pink-500/10 mix-blend-screen" />
                            <div className="absolute w-[250px] h-[250px] bg-pink-400/20 blur-3xl rounded-full" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
                                className="mb-[50px]"
                            >
                                <Heart className="w-8 h-8 md:w-12 md:h-12 text-pink-300 fill-pink-300 drop-shadow-[0_0_15px_rgba(244,114,182,1)]" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default MirrorSection;
