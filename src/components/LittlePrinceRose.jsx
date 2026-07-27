import { useState } from 'react';
import { motion } from 'framer-motion';

// Generates lightweight, organic stardust sparkles around the flower
const generateSparkles = () => {
  return [
    { id: 1, x: -60, y: -100, size: 3, delay: '0.1s', duration: '3s', opacity: 0.7 },
    { id: 2, x: 70, y: -80, size: 4, delay: '0.7s', duration: '3.8s', opacity: 0.8 },
    { id: 3, x: -90, y: -30, size: 2.5, delay: '0.4s', duration: '2.6s', opacity: 0.5 },
    { id: 4, x: 80, y: 20, size: 4, delay: '1.5s', duration: '4.2s', opacity: 0.65 },
    { id: 5, x: -50, y: 70, size: 3, delay: '1s', duration: '3.4s', opacity: 0.75 },
    { id: 6, x: 80, y: -130, size: 2.5, delay: '0.2s', duration: '2.8s', opacity: 0.6 },
    { id: 7, x: -80, y: -150, size: 3.5, delay: '1.3s', duration: '3.6s', opacity: 0.7 },
    { id: 8, x: 40, y: 100, size: 4, delay: '2s', duration: '4s', opacity: 0.8 }
  ];
};

export default function LittlePrinceRose() {
  const [sparkles] = useState(generateSparkles);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full py-20 px-4 bg-gradient-to-b from-slate-950 via-[#0a0c14] to-[#090a0f] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Starry/Cosmic Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft background rose-colored nebulas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-950/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-950/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* GPU Accelerated CSS Styles for ultra-smooth performance */}
      <style>{`
        @keyframes float-sparkle-gpu {
          0% {
            transform: translate(0, 0) scale(0.6);
            opacity: 0;
          }
          50% {
            opacity: var(--max-opacity);
            transform: translate(var(--tx), -20px) scale(1);
          }
          100% {
            transform: translate(calc(var(--tx) * 1.3), -40px) scale(0.6);
            opacity: 0;
          }
        }
        .gpu-sparkle {
          animation: float-sparkle-gpu var(--dur) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }
        .watercolor-canvas {
          background-color: #fdfaf4;
          background-image: 
            radial-gradient(rgba(0,0,0,0.01) 1px, transparent 0),
            linear-gradient(to right, rgba(139,92,26,0.005) 1px, transparent 0),
            linear-gradient(to bottom, rgba(139,92,26,0.005) 1px, transparent 0);
          background-size: 100% 100%, 20px 20px, 20px 20px;
          border: 1px solid rgba(139,92,26,0.08);
          box-shadow: 
            0 4px 20px rgba(0,0,0,0.35),
            inset 0 0 30px rgba(139,92,26,0.02);
        }
      `}</style>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto w-full text-center">
        
        {/* Watercolor Painting Canvas (Elegant 2D Frame) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="watercolor-canvas w-[330px] sm:w-[370px] rounded-3xl p-5 pb-8 mb-8 flex flex-col items-center relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Framed border lining inside the card */}
          <div className="absolute inset-3 rounded-[20px] border border-amber-900/5 pointer-events-none" />

          {/* Rose Display Area */}
          <div className="relative w-full h-[400px] sm:h-[440px] flex items-center justify-center select-none overflow-visible">
            
            {/* Sparkles / Stardust Particles (Super Light-weight & CSS Driven for high FPS) */}
            {sparkles.map((sparkle) => (
              <div
                key={sparkle.id}
                className="absolute gpu-sparkle rounded-full bg-gradient-to-r from-rose-300 via-pink-200 to-amber-100"
                style={{
                  width: sparkle.size,
                  height: sparkle.size,
                  left: `calc(50% + ${sparkle.x}px)`,
                  top: `calc(40% + ${sparkle.y}px)`,
                  '--tx': `${sparkle.x * 0.15}px`,
                  '--dur': sparkle.duration,
                  '--delay': sparkle.delay,
                  '--max-opacity': sparkle.opacity
                }}
              />
            ))}

            {/* COMPLETELY 2D HAND-DRAWN WATERCOLOR ROSE SVG */}
            <motion.svg
              className="w-full h-full"
              viewBox="0 0 320 440"
              style={{ transformOrigin: 'bottom center' }}
              animate={{
                rotate: [-1.2, 1.2, -1.2]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <defs>
                {/* Clean, Soft 2D Watercolor Gradients - No 3D shadows, lightings, or projections */}
                <linearGradient id="flat-rose-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isHovered ? "#ff6075" : "#ff4057"} />
                  <stop offset="50%" stopColor={isHovered ? "#e01f3d" : "#c91430"} />
                  <stop offset="100%" stopColor={isHovered ? "#9e061c" : "#800213"} />
                </linearGradient>

                <linearGradient id="flat-petal-rim" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffb3be" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>

                <linearGradient id="flat-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isHovered ? "#99e3a5" : "#79cf86"} />
                  <stop offset="50%" stopColor={isHovered ? "#3d9653" : "#2f8043"} />
                  <stop offset="100%" stopColor={isHovered ? "#184d26" : "#113d1c"} />
                </linearGradient>

                <linearGradient id="flat-stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isHovered ? "#786445" : "#5c4d35"} />
                  <stop offset="100%" stopColor={isHovered ? "#3f592c" : "#2d421e"} />
                </linearGradient>
              </defs>

              {/* ==================== CÀNH HOA (STEM) ==================== */}
              {/* Elegant curved S-shape mimicking hand-painted brushstroke */}
              <path
                d="M 162 148 Q 174 215 176 270 T 140 385"
                fill="none"
                stroke="url(#flat-stem-grad)"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* 2D Thorns */}
              <path d="M 170 230 L 161 234 Q 167 235 171 233 Z" fill="#5c4d35" />
              <path d="M 175 278 L 182 282 Q 177 283 175 279 Z" fill="#5c4d35" />

              {/* ==================== LÁ HOA (4 Hand-Drawn Watercolor 2D Leaves) ==================== */}
              
              {/* Leaf 1: Top Right */}
              <g>
                <path
                  d="M 175 225 C 194 227, 226 200, 244 162 C 215 171, 190 192, 175 225 Z"
                  fill="url(#flat-leaf-grad)"
                  fillOpacity="0.88"
                  stroke="#1c4725"
                  strokeWidth="1"
                />
                {/* 2D Flat Veins */}
                <path d="M 175 225 Q 209 193 244 162" fill="none" stroke="#113017" strokeWidth="1.5" opacity="0.6" />
                <path d="M 192 208 Q 205 204 212 203" fill="none" stroke="#113017" strokeWidth="1" opacity="0.5" />
                <path d="M 209 192 Q 224 188 230 187" fill="none" stroke="#113017" strokeWidth="1" opacity="0.5" />
              </g>

              {/* Leaf 2: Top Left */}
              <g>
                <path
                  d="M 168 190 C 156 180, 120 166, 108 184 C 116 200, 143 207, 168 190 Z"
                  fill="url(#flat-leaf-grad)"
                  fillOpacity="0.85"
                  stroke="#1c4725"
                  strokeWidth="1"
                />
                {/* 2D Flat Vein */}
                <path d="M 168 190 Q 138 178 108 184" fill="none" stroke="#113017" strokeWidth="1" opacity="0.5" />
              </g>

              {/* Leaf 3: Mid Left */}
              <g>
                <path
                  d="M 171 242 C 152 234, 106 216, 112 254 C 126 264, 154 259, 171 242 Z"
                  fill="url(#flat-leaf-grad)"
                  fillOpacity="0.9"
                  stroke="#1c4725"
                  strokeWidth="1"
                />
                {/* 2D Flat Veins */}
                <path d="M 171 242 Q 141 234 112 254" fill="none" stroke="#113017" strokeWidth="1.5" opacity="0.6" />
                <path d="M 153 238 Q 139 244 131 247" fill="none" stroke="#113017" strokeWidth="1" opacity="0.5" />
              </g>

              {/* Leaf 4: Lower Right */}
              <g>
                <path
                  d="M 174 262 C 196 264, 246 235, 266 256 C 240 274, 206 278, 174 262 Z"
                  fill="url(#flat-leaf-grad)"
                  fillOpacity="0.9"
                  stroke="#1c4725"
                  strokeWidth="1"
                />
                {/* 2D Flat Veins */}
                <path d="M 174 262 Q 220 259 266 256" fill="none" stroke="#113017" strokeWidth="1.5" opacity="0.6" />
                <path d="M 203 261 Q 218 269 227 272" fill="none" stroke="#113017" strokeWidth="1" opacity="0.5" />
              </g>

              {/* Small Sepals (Lá đài ôm hoa) */}
              <g fill="url(#flat-leaf-grad)" stroke="#113017" strokeWidth="0.8" fillOpacity="0.95">
                <path d="M 162 148 Q 146 156 144 176 Q 156 165 162 148 Z" />
                <path d="M 164 148 Q 180 154 182 172 Q 172 163 164 148 Z" />
              </g>

              {/* ==================== HOA HỒNG NỞ 2D (FLAT WATERCOLOR STYLE) ==================== */}
              {/* Strictly 2D vector art, no shadow filters, styled with clean ink strokes and flat fills */}
              <g transform="rotate(-5, 163, 112)">
                
                {/* 1. LỚP NỀN SAO CÙNG (Back Petals - Closed Solid Shapes to Block Background) */}
                <path
                  d="M 120 75 C 80 75, 75 130, 110 148 C 125 154, 150 156, 163 156 C 176 156, 201 154, 216 148 C 251 130, 246 75, 206 75 C 180 65, 146 65, 120 75 Z"
                  fill="url(#flat-rose-fill)"
                  fillOpacity="0.95"
                  stroke="#6b0311"
                  strokeWidth="1.2"
                />

                {/* 2. BẦU HOA ĐÁY (Bottom Cup / Receptacle - Overlaps Stem & Sepals at Y:148-156) */}
                <path
                  d="M 98 115 C 98 140, 125 157, 163 157 C 201 157, 228 140, 228 115 C 200 145, 126 145, 98 115 Z"
                  fill="url(#flat-rose-fill)"
                  fillOpacity="0.98"
                  stroke="#6b0311"
                  strokeWidth="1.2"
                />
                {/* Highlight/Rim of the Bottom Cup */}
                <path
                  d="M 100 117 C 128 142, 198 142, 226 117"
                  fill="none"
                  stroke="url(#flat-petal-rim)"
                  strokeWidth="1.6"
                />

                {/* 3. CÁC CÁNH HOA CUỘN ÔM (Side Wraps & Front Shields - Layered Overlapping) */}
                {/* Left Outer-Mid Wrap */}
                <path
                  d="M 102 110 C 85 85, 130 75, 152 95 C 146 115, 116 122, 102 110 Z"
                  fill="url(#flat-rose-fill)"
                  fillOpacity="0.96"
                  stroke="#6b0311"
                  strokeWidth="1.2"
                />
                <path
                  d="M 102 110 C 88 88, 126 80, 146 96"
                  fill="none"
                  stroke="url(#flat-petal-rim)"
                  strokeWidth="1.4"
                />

                {/* Right Outer-Mid Wrap */}
                <path
                  d="M 224 110 C 241 85, 196 75, 174 95 C 180 115, 210 122, 224 110 Z"
                  fill="url(#flat-rose-fill)"
                  fillOpacity="0.96"
                  stroke="#6b0311"
                  strokeWidth="1.2"
                />
                <path
                  d="M 224 110 C 238 88, 200 80, 180 96"
                  fill="none"
                  stroke="url(#flat-petal-rim)"
                  strokeWidth="1.4"
                />

                {/* Left Inner Wrap */}
                <path
                  d="M 112 112 C 102 102, 122 88, 146 102 C 140 118, 124 122, 112 112 Z"
                  fill="url(#flat-rose-fill)"
                  fillOpacity="0.97"
                  stroke="#6b0311"
                  strokeWidth="1.2"
                />

                {/* Right Inner Wrap */}
                <path
                  d="M 214 112 C 224 102, 204 88, 180 102 C 186 118, 202 122, 214 112 Z"
                  fill="url(#flat-rose-fill)"
                  fillOpacity="0.97"
                  stroke="#6b0311"
                  strokeWidth="1.2"
                />

                {/* Front Petal Shield (Che chắn giữa) */}
                <path
                  d="M 124 112 C 120 134, 206 134, 202 112 C 185 128, 141 128, 124 112 Z"
                  fill="url(#flat-rose-fill)"
                  fillOpacity="0.98"
                  stroke="#6b0311"
                  strokeWidth="1.2"
                />
                <path
                  d="M 126 114 C 122 130, 204 130, 200 114"
                  fill="none"
                  stroke="url(#flat-petal-rim)"
                  strokeWidth="1.5"
                />

                {/* 4. LÕI XOẮN ỐC TÂM HOA (Spiral Center - Closed Interlocking Droplets) */}
                {/* Inner Spiral 1 */}
                <path
                  d="M 142 94 C 132 80, 158 75, 164 92 C 158 102, 146 102, 142 94 Z"
                  fill="url(#flat-rose-fill)"
                  stroke="#52010b"
                  strokeWidth="1.5"
                />

                {/* Inner Spiral 2 */}
                <path
                  d="M 184 94 C 194 80, 168 75, 162 92 C 168 102, 180 102, 184 94 Z"
                  fill="url(#flat-rose-fill)"
                  stroke="#52010b"
                  strokeWidth="1.5"
                />

                {/* Inner Spiral 3 (Swirl transition) */}
                <path
                  d="M 150 98 C 146 88, 180 88, 176 98 C 172 106, 154 106, 150 98 Z"
                  fill="url(#flat-rose-fill)"
                  stroke="#52010b"
                  strokeWidth="1.5"
                />

                {/* Inner Spiral 4 (Center core bud) */}
                <path
                  d="M 156 94 C 153 90, 173 90, 170 94 C 168 98, 158 98, 156 94 Z"
                  fill="url(#flat-rose-fill)"
                  stroke="#52010b"
                  strokeWidth="1.2"
                />

                {/* Accent watercolor crevice lines inside spiral for added beauty */}
                <path
                  d="M 144 102 Q 163 110 182 102"
                  fill="none"
                  stroke="#40010a"
                  strokeWidth="2"
                />
                <path
                  d="M 138 108 Q 163 118 188 108"
                  fill="none"
                  stroke="#40010a"
                  strokeWidth="1.5"
                />
              </g>

              {/* Hand-signed signature at bottom-right corner */}
              <text
                x="245"
                y="410"
                fontFamily="font-cormorant, 'Cormorant Garamond', Georgia, serif"
                fontSize="11"
                fill="#8c7865"
                fontStyle="italic"
                opacity="0.4"
                className="select-none tracking-widest"
              >
                Antoine
              </text>
            </motion.svg>
          </div>
        </motion.div>

        {/* Elegant Serif Quote (Strictly Literal Text Rendered in Cormorant Garamond / Playfair Display) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex flex-col items-center gap-3 px-4"
        >
          {/* Decorative Divider */}
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent mb-2" />

          {/* EXACT QUOTE ONLY, ENHANCED TYPOGRAPHY */}
          <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-100 font-light italic leading-relaxed max-w-2xl text-center px-4 tracking-wide">
            "Chính thời gian mà bạn dành cho đóa hồng của mình mới làm cho đóa hồng của bạn trở nên quan trọng đến thế."
          </p>

          <p className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-white/30 mt-2">
            — Antoine de Saint-Exupéry, Hoàng Tử Bé
          </p>

          {/* Decorative Divider */}
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent mt-2" />
        </motion.div>
      </div>
    </section>
  );
}
