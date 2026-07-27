 
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuoteHeader from '../components/QuoteHeader';
import { useInView } from 'react-intersection-observer';
import useAudioSync from '../hooks/useAudioSync';

const prand = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Nền sao tĩnh
const StarfieldBackground = () => {
    const stars = useMemo(() => Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        top: `${prand(i * 12) * 100}%`,
        left: `${prand(i * 34) * 100}%`,
        size: prand(i * 56) * 1.5 + 0.5,
        opacity: prand(i * 78) * 0.3 + 0.1,
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

const Lantern = ({ id, startX, startY, delay, duration, scale, onComplete }) => {
    // Swaying animation
    const xOffset = prand(id) * 100 - 50;
    
    return (
        <motion.div
            className="absolute z-20"
            style={{ left: startX, top: startY, x: '-50%', y: '-50%' }}
            initial={{ y: 0, x: 0, opacity: 0, scale: scale * 0.8 }}
            animate={{ 
                y: - (window.innerHeight + 200),
                x: [0, xOffset, -xOffset * 0.5, xOffset * 1.5],
                opacity: [0, 1, 0.8, 0],
                scale: [scale, scale * 0.8, scale * 0.5, scale * 0.3]
            }}
            transition={{ 
                duration: duration, 
                delay: delay,
                ease: 'easeOut',
                onComplete: () => onComplete(id)
            }}
        >
            <div className="relative w-[30px] h-[45px] flex flex-col items-center">
                {/* Lantern Body */}
                <div className="w-full h-full bg-gradient-to-t from-orange-500 via-yellow-500 to-yellow-300 rounded-t-[50%] rounded-b-sm shadow-[0_0_15px_rgba(234,179,8,0.8),inset_0_-5px_15px_rgba(249,115,22,0.8)] flex justify-center items-end pb-1 relative overflow-hidden">
                    {/* Bamboo frame lines */}
                    <div className="absolute w-[1px] h-full bg-orange-700/30 left-1/4" />
                    <div className="absolute w-[1px] h-full bg-orange-700/30 left-1/2 -translate-x-1/2" />
                    <div className="absolute w-[1px] h-full bg-orange-700/30 right-1/4" />
                    <div className="absolute w-full h-[1px] bg-orange-700/30 top-1/3" />
                    <div className="absolute w-full h-[1px] bg-orange-700/30 top-2/3" />

                    {/* Flickering light inside */}
                    <motion.div 
                        className="w-4 h-4 bg-white rounded-full blur-[4px]"
                        animate={{ opacity: [0.7, 1, 0.6, 0.9, 0.7] }}
                        transition={{ duration: 0.5 + prand(id) * 0.5, repeat: Infinity }}
                    />
                </div>
                {/* Base */}
                <div className="w-[80%] h-[3px] bg-amber-900 rounded-b-sm" />
                
                {/* Trailing sparks */}
                <motion.div 
                   className="absolute -bottom-4 w-1 h-1 bg-yellow-200 rounded-full blur-[1px]"
                   animate={{ y: [0, 20], opacity: [1, 0], scale: [1, 0] }}
                   transition={{ duration: 0.8, repeat: Infinity, delay: prand(id) }}
                />
            </div>
        </motion.div>
    );
};

const Landscape = () => (
    <div className="absolute bottom-0 w-full h-[30%] pointer-events-none z-10">
        {/* River */}
        <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-[#020617] to-[#0f172a] opacity-90" />
        
        {/* River reflection blur overlay */}
        <div className="absolute bottom-0 w-full h-[50%] backdrop-blur-[2px]" />

        {/* Distant Mountains / Trees */}
        <svg viewBox="0 0 1000 100" className="absolute bottom-[50%] w-full h-[60%] preserveAspectRatio-none">
            <path d="M0,100 L0,50 Q100,40 200,60 T400,30 T600,50 T800,20 T1000,40 L1000,100 Z" fill="#020617" />
            <path d="M0,100 L0,70 Q150,60 250,80 T500,50 T750,70 T1000,60 L1000,100 Z" fill="#0f172a" />
        </svg>

        {/* Small people silhouettes */}
        <div className="absolute bottom-[50%] right-[20%] w-[15px] h-[25px]">
           <div className="absolute bottom-0 w-[6px] h-[18px] bg-[#020617] rounded-t-full" />
           <div className="absolute bottom-0 right-0 w-[5px] h-[15px] bg-[#020617] rounded-t-full" />
        </div>
        <div className="absolute bottom-[48%] left-[15%] w-[10px] h-[20px]">
           <div className="absolute bottom-0 w-[5px] h-[15px] bg-[#020617] rounded-t-full" />
        </div>
    </div>
);

const Moon = () => (
    <div className="absolute top-[10%] right-[15%] w-[80px] md:w-[120px] h-[80px] md:h-[120px] rounded-full bg-[#fdfbf7] shadow-[0_0_50px_rgba(253,251,247,0.4),0_0_100px_rgba(253,251,247,0.2)] opacity-80 pointer-events-none z-0">
        {/* Moon craters */}
        <div className="absolute top-[20%] left-[20%] w-[20%] h-[20%] bg-slate-300/30 rounded-full blur-[2px]" />
        <div className="absolute top-[50%] right-[30%] w-[30%] h-[25%] bg-slate-300/20 rounded-full blur-[3px]" />
        <div className="absolute bottom-[20%] left-[40%] w-[15%] h-[15%] bg-slate-300/30 rounded-full blur-[2px]" />
    </div>
);

const LanternReleaseSection = () => {
    const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
    const { playSound } = useAudioSync();
    
    const [lanterns, setLanterns] = useState([]);
    const [bgLanterns, setBgLanterns] = useState([]);

    const ambientAudio = useRef(null);

    useEffect(() => {
        if (!ambientAudio.current) {
            ambientAudio.current = new Audio('./audio/ambient/sky-wind.mp3');
            ambientAudio.current.loop = true;
            ambientAudio.current.volume = 0.1;
        }
        if (inView) {
            ambientAudio.current.play().catch(() => {});
        } else {
            ambientAudio.current.pause();
        }
    }, [inView]);

    // Spawn background lanterns randomly
    useEffect(() => {
        if (!inView) return;
        let timeout;
        const spawnBg = () => {
            if (bgLanterns.length < 5) {
                const id = Date.now() + Math.random();
                setBgLanterns(prev => [...prev, {
                    id,
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 50,
                    delay: 0,
                    duration: 15 + Math.random() * 10,
                    scale: 0.2 + Math.random() * 0.3
                }]);
            }
            timeout = setTimeout(spawnBg, 4000 + Math.random() * 5000);
        };
        spawnBg();
        return () => clearTimeout(timeout);
    }, [inView, bgLanterns.length]);

    const handleRemoveLantern = useCallback((id) => {
        setLanterns(prev => prev.filter(l => l.id !== id));
    }, []);

    const handleRemoveBgLantern = useCallback((id) => {
        setBgLanterns(prev => prev.filter(l => l.id !== id));
    }, []);

    useEffect(() => {
        if (!inView) return;
        
        let interval;
        
        const autoRelease = () => {
            playSound('./audio/sfx/lantern-release.mp3', 0.4);
            
            // Release 5 lanterns over 2 seconds
            for (let i = 0; i < 5; i++) {
                const id = Date.now() + Math.random();
                const randomDelay = Math.random() * 2000; // delay within 2 seconds
                
                setTimeout(() => {
                    setLanterns(prev => {
                        const next = [...prev, {
                            id,
                            x: Math.random() * window.innerWidth,
                            y: window.innerHeight * 0.8 + Math.random() * (window.innerHeight * 0.2), // bottom 20%
                            delay: 0,
                            duration: 8 + Math.random() * 4,
                            scale: 0.8 + Math.random() * 0.4,
                        }];
                        if (next.length > 30) {
                            return next.slice(next.length - 30);
                        }
                        return next;
                    });
                }, randomDelay);
            }
        };

        // Initial release
        autoRelease();
        interval = setInterval(autoRelease, 2000);
        
        return () => clearInterval(interval);
    }, [inView, playSound]);

    return (
        <section 
            ref={sectionRef}
            className="relative w-full min-h-[100vh] overflow-hidden bg-gradient-to-b from-[#020208] to-[#0d1b2e] select-none touch-none"
        >
      <div className="absolute top-40 left-0 w-full z-30 pointer-events-none">
        <QuoteHeader 
            quote="I would rather share one lifetime with you than face all the ages of this world alone." 
            author="J.R.R. Tolkien" 
        />
      </div>
            <StarfieldBackground />
            <Moon />
            <Landscape />

            {/* River reflections for bg lanterns */}
            <div className="absolute bottom-0 w-full h-[15%] pointer-events-none z-10 opacity-30 flex items-start justify-center overflow-hidden">
                <div className="w-full h-full relative" style={{ transform: 'scaleY(-1)', filter: 'blur(8px)' }}>
                     {bgLanterns.map(l => (
                        <div key={`ref-bg-${l.id}`} className="absolute w-[10px] h-[15px] bg-orange-500 rounded-full" style={{ left: l.x, bottom: 0 }} />
                     ))}
                     {lanterns.map(l => (
                        <div key={`ref-${l.id}`} className="absolute w-[20px] h-[30px] bg-orange-400 rounded-full" style={{ left: l.x, bottom: 0 }} />
                     ))}
                </div>
            </div>

            {/* Foreground Lanterns */}
            <AnimatePresence>
                {bgLanterns.map(l => (
                    <Lantern 
                        key={l.id} 
                        id={l.id} 
                        startX={l.x} 
                        startY={l.y} 
                        delay={l.delay}
                        duration={l.duration}
                        scale={l.scale}
                        isBackground={true}
                        onComplete={handleRemoveBgLantern}
                    />
                ))}
            </AnimatePresence>

            {/* Foreground Lanterns */}
            <AnimatePresence>
                {lanterns.map(l => (
                    <Lantern 
                        key={l.id} 
                        id={l.id} 
                        startX={l.x} 
                        startY={l.y} 
                        delay={l.delay}
                        duration={l.duration}
                        scale={l.scale}
                        isBackground={false}
                        onComplete={handleRemoveLantern}
                    />
                ))}
            </AnimatePresence>
        </section>
    );
};

export default LanternReleaseSection;
