 
import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useTransform, motionValue } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import useAudioSync from '../hooks/useAudioSync';

const TOTAL_COLS = 7;
const TOTAL_ROWS = 5;

const BUCKET_LIST_DATA = [
  // Cột 1
  [
    "Anh muốn lưu tất cả hình ảnh của em vào máy",
    "Anh muốn call với em thật nhiều",
    "Anh muốn chơi game cùng em",
    "Anh muốn cùng em học tập",
    "Anh muốn mỗi sáng thức dậy người đầu tiên anh nhắn tin luôn là em",
  ],
  // Cột 2
  [
    "Anh muốn mỗi tối trước khi ngủ đều được nghe giọng nói của em",
    "Anh muốn nghe giọng em mỗi khi thức dậy",
    "Anh muốn ngồi nghe em kể về những chuyện trong ngày",
    "Anh muốn lắng nghe em thật nhiều",
    "Anh muốn ghi nhớ từng sở thích nhỏ nhất của em",
  ],
  // Cột 3
  [
    "Anh muốn đêm nào em cũng ngủ thật ngon, mơ thật đẹp",
    "Anh muốn ngắm nhìn khuôn mặt dễ thương của em",
    "Anh muốn ngắm em thật lâu",
    "Anh muốn tự tay chụp lại từng khoảnh khắc rạng rỡ, đáng yêu nhất của em",
    "Anh muốn cùng em nấu ăn",
  ],
  // Cột 4
  [
    "Anh muốn học cách nấu những món em thích nhất",
    "Anh muốn đi chơi với em thật nhiều",
    "Anh muốn cùng em đi thật nhiều nơi",
    "Anh muốn mình cùng nhau ngắm pháo hoa",
    "Anh muốn gặp em nhiều hơn",
  ],
  // Cột 5
  [
    "Anh muốn nắm tay em",
    "Anh muốn ôm em",
    "Anh muốn khoảng cách giữa hai đứa mình sẽ sớm được xóa bỏ để anh thực sự được ở bên cạnh em",
    "Anh muốn em biết rằng anh luôn ở đây",
    "Anh muốn thức cùng em vào những đêm em trằn trọc khó ngủ",
  ],
  // Cột 6
  [
    "Anh muốn dùng tay của mình lau đi những giọt nước mắt của em khi khóc",
    "Anh muốn bảo vệ em khỏi những điều tiêu cực",
    "Anh muốn là lý do khiến em cảm thấy an toàn",
    "Anh muốn làm chỗ dựa vững chắc nhất cho em",
    "Anh muốn luôn là người đầu tiên em nghĩ đến khi có chuyện vui hay buồn",
  ],
  // Cột 7
  [
    "Anh muốn nói với em rằng anh đang rất hạnh phúc khi có em",
    "Anh muốn cả thế giới này đều biết em là người con gái anh yêu nhất",
    "Anh muốn tình yêu của chúng mình sẽ luôn bình yên và bền chặt",
    "Anh muốn biến mọi ước mơ, mọi mong ước của em thành hiện thực",
    "Anh muốn kiếp sau, nếu có, anh vẫn sẽ tìm thấy và yêu em thêm một lần nữa",
  ],
];

// ──────────────────────────────────────────────
// Helpers for styling based on row
// ──────────────────────────────────────────────
const getPaperStyle = (rowIndex, colIndex, totalRows = TOTAL_ROWS, totalCols = TOTAL_COLS) => {
  // Thứ tự đọc: trên → dưới, trong cùng hàng thì trái → phải
  const totalItems = totalRows * totalCols;
  const globalIndex = rowIndex * totalCols + colIndex;
  const percent = globalIndex / Math.max(1, totalItems - 1);
  if (percent <= 0.3) {
    // ~30% đầu tiên: giấy kem nhạt
    return { bg: 'bg-[#fdfbf7]', text: 'text-pink-300', seal: 'text-pink-300', shadow: 'shadow-md group-hover:shadow-[0_0_15px_rgba(244,114,182,0.5)]' };
  } else if (percent <= 0.7) {
    // ~40% giữa: hồng đào
    return { bg: 'bg-pink-100', text: 'text-rose-800', seal: 'text-rose-800', shadow: 'shadow-md group-hover:shadow-[0_0_20px_rgba(225,29,72,0.6)]' };
  } else {
    // ~30% cuối: đỏ rực
    return { bg: 'bg-rose-600', text: 'text-white', seal: 'text-white', shadow: 'shadow-[0_0_15px_rgba(225,29,72,0.8)] group-hover:shadow-[0_0_30px_rgba(225,29,72,1)]' };
  }
};

// ──────────────────────────────────────────────
// Background Components (from WindChimeRoomSection)
// ──────────────────────────────────────────────
const RightShoji = memo(({ mousePos, inView }) => {
    const doorRef = useRef(null);
    const offset = useRef(0);

    useAnimationFrame(() => {
        if (!inView) return;
        if (!doorRef.current) return;
        let target = 0;
        if (mousePos.current.x !== -1000) {
            const screenW = window.innerWidth;
            const dist = screenW - mousePos.current.x;
            if (dist < 300) {
                target = (300 - dist) * 0.25; 
            }
        }
        offset.current += (target - offset.current) * 0.05;
        doorRef.current.style.transform = `translateX(${offset.current}px)`;
    });

    return (
        <div 
           ref={doorRef}
           className="absolute top-0 right-0 w-[20vw] h-full bg-[#fdfbf7] border-l-8 border-y-8 border-[#271c19] flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] pointer-events-none"
        >
            <div className="w-full h-full flex flex-col">
                {[1,2,3,4,5,6].map(row => (
                   <div key={row} className="flex-1 flex border-b-4 border-[#271c19]">
                      {[1,2,3].map(col => (
                         <div key={col} className="flex-1 border-r-4 border-[#271c19] bg-white/60 backdrop-blur-sm" />
                      ))}
                   </div>
                ))}
            </div>
            
            {/* Light beam from the crack */}
            <div className="absolute top-0 left-[-40vw] h-full w-[40vw] bg-gradient-to-l from-[#fef08a]/10 to-transparent mix-blend-screen opacity-50" />
        </div>
    );
});
RightShoji.displayName = 'RightShoji';

const LeftShoji = memo(({ mousePos, inView }) => {
    const doorRef = useRef(null);
    const offset = useRef(0);

    useAnimationFrame(() => {
        if (!inView) return;
        if (!doorRef.current) return;
        let target = 0;
        if (mousePos.current.x !== -1000) {
            const dist = mousePos.current.x;
            if (dist < 300) {
                target = -(300 - dist) * 0.25; 
            }
        }
        offset.current += (target - offset.current) * 0.05;
        doorRef.current.style.transform = `translateX(${offset.current}px)`;
    });

    return (
        <div 
           ref={doorRef}
           className="absolute top-0 left-0 w-[20vw] h-full bg-[#fdfbf7] border-r-8 border-y-8 border-[#271c19] flex flex-col z-10 shadow-[10px_0_30px_rgba(0,0,0,0.5)] pointer-events-none"
        >
            <div className="w-full h-full flex flex-col">
                {[1,2,3,4,5,6].map(row => (
                   <div key={row} className="flex-1 flex border-b-4 border-[#271c19]">
                      {[1,2,3].map(col => (
                         <div key={col} className="flex-1 border-r-4 border-[#271c19] bg-white/60 backdrop-blur-sm" />
                      ))}
                   </div>
                ))}
            </div>
            {/* Light beam from the crack */}
            <div className="absolute top-0 right-[-40vw] h-full w-[40vw] bg-gradient-to-r from-[#fef08a]/10 to-transparent mix-blend-screen opacity-50" />
        </div>
    );
});
LeftShoji.displayName = 'LeftShoji';

const Teapot = memo(({ mousePos, inView }) => {
    const canvasRef = useRef(null);
    const tableRef = useRef(null);
    const lastUpdate = useRef(0);
    
    useEffect(() => {
        if (!inView) return;
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        const particles = [];
        let animId;
        
        lastUpdate.current = Date.now();

        const render = () => {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            const now = Date.now();
            const dt = Math.min((now - lastUpdate.current) / 1000, 0.1);
            lastUpdate.current = now;

            let emit = false;
            if (mousePos.current.x !== -1000 && tableRef.current) {
                const rect = tableRef.current.getBoundingClientRect();
                const spoutX = rect.left + rect.width - 10;
                const spoutY = rect.top + 20;
                const dist = Math.hypot(mousePos.current.x - spoutX, mousePos.current.y - spoutY);
                if (dist < 150) emit = true;
            }
            
            if (emit && Math.random() < 0.4) {
                particles.push({
                    x: cvs.width * 0.7 + (Math.random() - 0.5) * 5,
                    y: cvs.height * 0.8,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -0.3 - Math.random() * 0.5,
                    life: 1,
                    size: Math.random() * 3 + 2
                });
            }
            
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= dt * 0.5; 
                p.size += dt * 5;
                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.4})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            animId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animId);
    }, [mousePos, inView]);

    return (
        <div className="absolute top-[-40px] right-[40px] w-[60px] h-[40px]" ref={tableRef}>
            <svg width="50" height="40" viewBox="0 0 50 40" className="absolute bottom-0 right-0 drop-shadow-md">
                <path d="M 15 40 C 5 40 5 15 25 15 C 45 15 45 40 35 40 Z" fill="#292524" />
                <path d="M 25 15 C 25 5 32 5 32 15" fill="none" stroke="#292524" strokeWidth="4" />
                <path d="M 40 25 Q 50 20 48 10" fill="none" stroke="#292524" strokeWidth="5" strokeLinecap="round" />
            </svg>
            
            <canvas ref={canvasRef} width="80" height="80" className="absolute top-[-70px] right-[-30px] pointer-events-none" />
            
            <div className="absolute bottom-[0px] left-[-10px] w-[14px] h-[18px] bg-[#292524] rounded-b-sm shadow-sm border-t border-[#444]" />
            <div className="absolute bottom-[0px] left-[10px] w-[14px] h-[18px] bg-[#292524] rounded-b-sm shadow-sm border-t border-[#444]" />
        </div>
    );
});
Teapot.displayName = 'Teapot';

const Lantern = memo(() => {
    const [isGlowing, setIsGlowing] = useState(false);
    
    const handleClick = () => {
        if (isGlowing) return;
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 1200);
    };

    return (
        <div 
            className="absolute top-[-70px] left-[30px] w-[45px] h-[70px] cursor-pointer pointer-events-auto z-10"
            onClick={handleClick}
        >
            <motion.div 
                className="w-full h-full bg-[#ffedd5] border-2 border-[#b45309] rounded-sm relative flex flex-col justify-between"
                animate={{ boxShadow: isGlowing ? '0 0 50px 15px rgba(253, 224, 71, 0.9)' : '0 0 20px 3px rgba(253, 224, 71, 0.4)' }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-full h-[6px] bg-[#451a03]" />
                <div className="flex-1 w-full relative overflow-hidden flex items-end justify-center pb-2">
                    <motion.div 
                        className="w-3 h-5 bg-orange-400 rounded-full blur-[2px]"
                        animate={{ opacity: [0.6, 1, 0.7], scale: [1, 1.1, 0.9] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                    />
                </div>
                <div className="w-full h-[6px] bg-[#451a03]" />
            </motion.div>
        </div>
    );
});
Lantern.displayName = 'Lantern';

const TatamiFloor = () => (
    <div className="absolute bottom-0 w-full h-[35vh] z-0 pointer-events-none">
        <div className="w-full h-[50vh] origin-top bg-[#d4c5a0] border-t-8 border-[#1a1a1a]" style={{ transform: 'perspective(1000px) rotateX(60deg)' }}>
            <div className="w-full h-full flex divide-x-8 divide-[#1a1a1a]">
               <div className="flex-1 bg-[#d4c5a0] shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]" />
               <div className="flex-1 bg-[#d4c5a0] shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]" />
               <div className="flex-1 bg-[#d4c5a0] shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]" />
            </div>
        </div>
    </div>
);

const BackWall = () => (
    <div className="absolute inset-0 bg-[#8c6b5d] z-0 flex items-center justify-center pt-[5vh] pointer-events-none">
        <div className="w-[30vh] h-[30vh] md:w-[40vh] md:h-[40vh] rounded-full border-[12px] border-[#271c19] bg-[#0f172a] overflow-hidden relative shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
            <div className="absolute top-[20%] right-[15%] w-[15%] h-[15%] bg-[#fef08a] rounded-full shadow-[0_0_20px_#fef08a]" />
            
            <svg viewBox="0 0 100 100" className="absolute w-full h-full opacity-80">
                <path d="M -10 55 Q 30 45 60 20 Q 75 10 90 -10" fill="none" stroke="#000" strokeWidth="5" />
                <path d="M 25 46 Q 50 65 75 50" fill="none" stroke="#000" strokeWidth="3" />
                <path d="M 60 20 Q 80 30 100 20" fill="none" stroke="#000" strokeWidth="2" />
                
                <circle cx="55" cy="20" r="3" fill="#fbcfe8" opacity="0.7" />
                <circle cx="65" cy="15" r="2.5" fill="#fbcfe8" opacity="0.7" />
                <circle cx="30" cy="45" r="3" fill="#fbcfe8" opacity="0.7" />
                <circle cx="75" cy="50" r="2" fill="#fbcfe8" opacity="0.7" />
                <circle cx="85" cy="25" r="2.5" fill="#fbcfe8" opacity="0.7" />
            </svg>

            <motion.div 
                className="absolute top-[10%] left-[50%] w-[8px] h-[5px] bg-[#fbcfe8] rounded-full opacity-80 shadow-[0_0_5px_#fbcfe8]"
                animate={{ y: [0, 200], x: [0, -40, 20, -10], rotate: [0, 180, 360] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div 
                className="absolute top-[30%] left-[70%] w-[6px] h-[4px] bg-[#fbcfe8] rounded-full opacity-60 shadow-[0_0_5px_#fbcfe8]"
                animate={{ y: [0, 200], x: [0, 30, -10, 20], rotate: [0, -180, -360] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 2 }}
            />
        </div>
    </div>
);

const RoomFurniture = memo(({ mousePos, inView }) => {
    return (
        <div className="absolute bottom-[5%] left-[50%] -translate-x-1/2 md:left-[35%] w-[350px] h-[150px] z-10 flex items-center justify-center pointer-events-none">
            <div className="absolute top-[20px] left-[50px] w-[100px] h-[30px] bg-[#9f1239] rounded-2xl shadow-lg border-2 border-[#be123c] -rotate-6 scale-y-75" />
            <div className="absolute bottom-[20px] right-[50px] w-[120px] h-[40px] bg-[#9f1239] rounded-2xl shadow-xl border-2 border-[#be123c] rotate-3 z-20" />
            
            <div className="absolute top-[40px] w-[260px] h-[50px] bg-[#451a03] rounded-t-2xl rounded-b-lg shadow-[0_20px_30px_rgba(0,0,0,0.5)] border-t-2 border-[#78350f] z-10">
                <div className="absolute bottom-[-35px] left-[20px] w-[20px] h-[40px] bg-[#451a03] rounded-b-sm shadow-md" />
                <div className="absolute bottom-[-35px] right-[20px] w-[20px] h-[40px] bg-[#451a03] rounded-b-sm shadow-md" />
                
                <Lantern />
                <Teapot mousePos={mousePos} inView={inView} />
            </div>
        </div>
    );
});
RoomFurniture.displayName = 'RoomFurniture';

// ──────────────────────────────────────────────
// Furin containing the string and papers
// ──────────────────────────────────────────────
const Furin = memo(({ xPos, yPos, scale, mousePos, playSound, colItems, colIndex, handleItemClick, inView }) => {
    const chimeRef = useRef(null);
    const angle = useRef(0);
    const chimeVelocity = useRef(0);
    const lastPlayTime = useRef(0);

    const totalRows = colItems.length;

    // Use state for bead curtain physics motion values so they can be accessed during render
    const [motionValues] = useState(() => Array.from({ length: totalRows }).map(() => motionValue(0)));
    
    const nodeXs = useRef(Array(totalRows).fill(0));
    const nodeVxs = useRef(Array(totalRows).fill(0));

    const pathString = useTransform(motionValues, (xs) => {
        let d = `M 0 0`; // relative to top: 75px
        xs.forEach((x, i) => {
            const y = (150 + i * 40) - 75;
            d += ` L ${x} ${y}`;
        });
        if (xs.length > 0) {
            const lastX = xs[xs.length - 1];
            const lastY = (150 + (xs.length - 1) * 40) - 75 + 100;
            d += ` L ${lastX} ${lastY}`;
        }
        return d;
    });

    useAnimationFrame(() => {
        if (!inView) return;
        const gravity = -0.015 * Math.sin(angle.current * Math.PI / 180);
        chimeVelocity.current += gravity;
        chimeVelocity.current *= 0.985; // damping

        let mouseAbsoluteX = mousePos.current.x;
        let mouseAbsoluteY = mousePos.current.y;
        let chimeLeft = 0;
        let chimeTop = 0;

        if (chimeRef.current) {
            const rect = chimeRef.current.getBoundingClientRect();
            chimeLeft = rect.left + rect.width / 2;
            chimeTop = rect.top;
        }

        if (mouseAbsoluteX !== -1000 && chimeRef.current) {
            const cy = chimeTop + 100 * scale; 
            const dx = mouseAbsoluteX - chimeLeft;
            const dy = mouseAbsoluteY - cy;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 56.25 * scale) {
                const forceX = mousePos.current.vx * 0.015 * (1 - dist / (56.25 * scale));
                chimeVelocity.current += forceX;
            }
        }

        angle.current += chimeVelocity.current;
        
        // Giới hạn dao động ở mức 30 độ
        if (angle.current > 30) {
            angle.current = 30;
            chimeVelocity.current *= -0.5;
        } else if (angle.current < -30) {
            angle.current = -30;
            chimeVelocity.current *= -0.5;
        }

        if (chimeRef.current) {
            chimeRef.current.style.transform = `scale(${scale}) rotate(${angle.current}deg)`;
        }

        if (Math.abs(chimeVelocity.current) > 0.5 && Math.abs(angle.current) > 3) {
            const now = Date.now();
            if (now - lastPlayTime.current > 500) {
                playSound('./audio/sfx/wind-chime.mp3', 0.15 + Math.min(0.2, Math.abs(chimeVelocity.current) * 0.05));
                lastPlayTime.current = now;
            }
        }

        // Bead curtain physics
        const tension = 0.08; 
        const damp = 0.92; // slightly less damping for more pendulum swing

        for (let i = 0; i < totalRows; i++) {
            let force = 0;
            const anchorPull = 0.005 * (1 - i / totalRows); 
            force += (0 - nodeXs.current[i]) * anchorPull;

            if (i > 0) {
                force += (nodeXs.current[i-1] - nodeXs.current[i]) * tension;
            } else {
                force += (0 - nodeXs.current[i]) * tension * 2; 
            }

            if (i < totalRows - 1) {
                force += (nodeXs.current[i+1] - nodeXs.current[i]) * tension;
            }

            // Mouse Repulsion
            if (mouseAbsoluteX !== -1000 && chimeLeft !== 0) {
                const paperAbsoluteX = chimeLeft + nodeXs.current[i] * scale;
                const paperAbsoluteY = chimeTop + (150 + i * 40) * scale;

                const dx = paperAbsoluteX - mouseAbsoluteX;
                const dy = paperAbsoluteY - mouseAbsoluteY;
                const dist = Math.hypot(dx, dy);

                const maxDist = 42.1875;
                if (dist < maxDist && dist > 1) {
                    const repelForce = Math.pow(1 - dist / maxDist, 2) * 10;
                    const dirX = dx === 0 ? (Math.random() - 0.5) : (dx / dist);
                    force += (dirX * repelForce) / scale; 
                }
            }
            
            nodeVxs.current[i] += force;
            nodeVxs.current[i] *= damp;
        }

        for (let i = 0; i < totalRows; i++) {
            nodeXs.current[i] += nodeVxs.current[i];
            motionValues[i].set(nodeXs.current[i]);
        }
    });

    return (
        <div 
          className="absolute origin-top z-20 pointer-events-none"
          style={{ left: xPos, top: yPos }}
          ref={chimeRef}
        >
            {/* Thread top part */}
            <div className="absolute top-0 left-1/2 w-[2px] h-[50px] bg-slate-400 -translate-x-1/2 shadow-sm" />
            
            {/* Glass Bell */}
            <div className="absolute top-[50px] left-1/2 w-[44px] h-[36px] bg-white/30 backdrop-blur-md rounded-t-full rounded-b-sm border border-white/50 shadow-[0_0_12px_rgba(255,255,255,0.3)] -translate-x-1/2 overflow-hidden flex items-start justify-center">
                <div className="w-full h-3 bg-gradient-to-b from-blue-200/40 to-transparent" />
                <div className="absolute top-1 right-2 w-3 h-5 bg-white/70 rounded-full rotate-45 blur-[1px]" />
            </div>
            
            {/* Clapper */}
            <div className="absolute top-[60px] left-1/2 w-[6px] h-[16px] bg-slate-300 rounded-full -translate-x-1/2 shadow-inner" />
            
            {/* Long string holding the papers */}
            <svg className="absolute top-[75px] left-1/2 overflow-visible w-2 h-[55vh] z-10 pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
                <motion.path 
                   d={pathString}
                   fill="none" 
                   stroke="rgba(255,255,255,0.4)" 
                   strokeWidth="1"
                />
            </svg>
            
            {/* Render paper items inside this rotating container */}
            {colItems.map((text, rowIndex) => {
                const topPx = 150 + rowIndex * 40; 
                return (
                    <PaperItem
                        key={rowIndex}
                        top={`${topPx}px`}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        totalRows={totalRows}
                        totalCols={TOTAL_COLS}
                        playSound={playSound}
                        onClick={() => handleItemClick(text, rowIndex, colIndex, totalRows, TOTAL_COLS)}
                        mvX={motionValues[rowIndex]}
                    />
                );
            })}
        </div>
    );
});
Furin.displayName = 'Furin';

// ──────────────────────────────────────────────
// Component tờ giấy gấp treo trên dây
// ──────────────────────────────────────────────
const PaperItem = ({ top, rowIndex, colIndex, totalRows, totalCols, onClick, playSound, mvX }) => {
    const { bg, seal, shadow } = getPaperStyle(rowIndex, colIndex, totalRows, totalCols);
    
    // Deterministic slight rotation for natural look
    const initialRotate = ((rowIndex * 31) % 11 - 5);
    const rotate = useTransform(mvX, (x) => initialRotate + x * 0.2);
  
    return (
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group pointer-events-auto z-30"
        style={{ top, x: mvX, rotate }}
        whileHover={{ 
          scale: 1.15
        }}
        onMouseEnter={() => {
           playSound('./audio/sfx/word-chime.mp3', 0.4);
        }}
        onClick={onClick}
      >
        {/* Wooden clip */}
        <div className="w-[3px] h-1.5 sm:w-1 sm:h-2 bg-[#6b4226] rounded-sm shadow-md border border-[#3b2210] z-20 -mb-1" />
  
        {/* Folded paper effect with clip-path - smaller size (30% reduction) */}
        <div 
          className={`relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center p-1 transition-shadow ${bg} ${shadow} border-l border-b border-white/20`}
          style={{
            clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)'
          }}
        >
          {/* Folded Corner Shadow/Element */}
          <div className="absolute top-0 right-0 w-[5px] h-[5px] bg-black/15 shadow-sm rounded-bl-sm" />
  
          {/* Heart seal inside */}
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full border border-current flex items-center justify-center bg-white/40 ${seal}`}>
            <Heart fill="currentColor" className={`w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-[5px] md:h-[5px]`} />
          </div>
        </div>
      </motion.div>
    );
};

// ──────────────────────────────────────────────
// Component Modal khi lật mở giấy
// ──────────────────────────────────────────────
const PaperModal = ({ text, rowIndex, colIndex, totalRows, totalCols, onClose }) => {
    const { bg, text: textColor } = getPaperStyle(rowIndex, colIndex, totalRows, totalCols);
  
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop Darken & Blur */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          onClick={onClose}
        />
  
        {/* Paper unfolding animation */}
        <motion.div
          className={`relative w-full max-w-lg ${bg} p-8 md:p-14 shadow-2xl flex flex-col items-center justify-center`}
          initial={{ scale: 0.5, rotateX: 90, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotateX: -90, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{
            transformPerspective: 1200,
            transformOrigin: 'top center',
            minHeight: '300px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Mute button */}
          <button
            className={`absolute top-3 right-3 sm:top-5 sm:right-5 ${textColor} opacity-60 hover:opacity-100 transition-opacity p-2 z-20`}
            onClick={onClose}
          >
            <X size={24} />
          </button>
  
          {/* Paper creases */}
          <div className={`absolute top-1/3 left-0 right-0 border-t border-black/10 border-dashed pointer-events-none`} />
          <div className={`absolute top-2/3 left-0 right-0 border-t border-black/10 border-dashed pointer-events-none`} />
  
          {/* Content */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <p className={`font-cormorant text-2xl md:text-3xl lg:text-4xl ${textColor} leading-relaxed text-center font-medium italic drop-shadow-sm px-2`}>
              "{text}"
            </p>
          </div>
  
          {/* Inner shadow simulating paper depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.05)] pointer-events-none" />

          {/* Sparkles around open letter */}
          <motion.div 
            className="absolute -top-4 -left-4 text-pink-300 pointer-events-none"
            animate={{ rotate: 180, scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
              <Sparkles size={32} />
          </motion.div>
          <motion.div 
            className="absolute -bottom-4 -right-4 text-rose-300 pointer-events-none"
            animate={{ rotate: -180, scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
              <Sparkles size={28} />
          </motion.div>
        </motion.div>
      </motion.div>
    );
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
const BucketList = () => {
    const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
    const { playSound, playBubble } = useAudioSync('bucketlist');
    
    const [selectedItem, setSelectedItem] = useState(null);
    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0 });
    const ambientAudio = useRef(null);

    useEffect(() => {
        if (!ambientAudio.current) {
            ambientAudio.current = new Audio('./audio/ambient/japanese-room-breeze.mp3');
            ambientAudio.current.loop = true;
            ambientAudio.current.volume = 0.15;
        }
        if (inView) {
            ambientAudio.current.play().catch(() => {});
        } else {
            ambientAudio.current.pause();
        }
    }, [inView]);

    const handlePointerMove = useCallback((e) => {
        let cx = e.clientX;
        let cy = e.clientY;
        if (e.touches && e.touches.length > 0) {
            cx = e.touches[0].clientX;
            cy = e.touches[0].clientY;
        }
        if (cx === undefined) return;
        
        if (mouseRef.current.x !== -1000) {
            mouseRef.current.vx = cx - mouseRef.current.x;
            mouseRef.current.vy = cy - mouseRef.current.y;
        }
        mouseRef.current.x = cx;
        mouseRef.current.y = cy;
    }, []);

    const handlePointerLeave = useCallback(() => {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
    }, []);

    const handleItemClick = (text, rowIndex, colIndex, totalRows, totalCols) => {
        playBubble();
        setSelectedItem({ text, rowIndex, colIndex, totalRows, totalCols });
    };

    // BUCKET_LIST_DATA giờ đã là mảng 2 chiều gồm 7 cột sẵn, không cần chia nữa
    const columns = BUCKET_LIST_DATA;

    return (
        <section 
            ref={sectionRef}
            className="relative w-full min-h-[120vh] md:min-h-[140vh] overflow-hidden bg-[#8c6b5d] select-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerLeave}
        >
            {/* Room Background Elements */}
            <BackWall />
            <TatamiFloor />
            <LeftShoji mousePos={mouseRef} inView={inView} />
            <RightShoji mousePos={mouseRef} inView={inView} />
            <RoomFurniture mousePos={mouseRef} inView={inView} />
            
            {/* Glowing Lantern Light effect on the floor/background */}
            <div className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-red-500/10 via-orange-400/5 to-transparent blur-3xl pointer-events-none z-10" />

            {/* Header Text overlay */}
            <div className="absolute top-12 left-0 w-full flex flex-col items-center text-center px-4 z-40 pointer-events-none">
                
            </div>

            {/* The 7 Furin Columns */}
            {columns.map((colItems, colIndex) => {
                // 7 cột xếp gần nhau hơn, khoảng cách ngắn hơn gấp đôi so với trước (bước nhảy 6.25% thay vì 12.5%)
                const xPositions = ["31.25%", "37.5%", "43.75%", "50%", "56.25%", "62.5%", "68.75%"];
                const scales = [1.05, 0.9, 1.0, 0.95, 1.0, 0.9, 1.05];
                
                return (
                    <Furin 
                        key={colIndex}
                        xPos={xPositions[colIndex]} 
                        yPos="0px" 
                        scale={scales[colIndex]} 
                        mousePos={mouseRef} 
                        playSound={playSound}
                        colItems={colItems}
                        colIndex={colIndex}
                        handleItemClick={handleItemClick}
                        inView={inView}
                    />
                );
            })}

            {/* Modal Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <PaperModal
                        text={selectedItem.text}
                        rowIndex={selectedItem.rowIndex}
                        colIndex={selectedItem.colIndex}
                        totalRows={selectedItem.totalRows}
                        totalCols={selectedItem.totalCols}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default BucketList;
