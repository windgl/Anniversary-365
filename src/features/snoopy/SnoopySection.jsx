// src/features/snoopy/SnoopySection.jsx
// KIỂM TRA ĐỦ 15 TÀI NGUYÊN
// Scene 1: snoopyrelaxingonrock.webp, snoopy-sleep.gif, rush-late-snoopy.gif, snoopy-hot.gif
// Scene 2: snoopysit.webp, snoopyhugg.gif, snoopy-I-see.gif, snoopy-yay.gif
// Scene 3: snoopyflower.webp, giving-gift-snoopy.gif, hugging-heart-snoopy.gif, snoopy_beating_heart.gif
// Scene 4: cheer-snoopy.gif, snoopy_red_bow_tie.gif, snoopy-cry.gif
// -> Đã xác nhận đầy đủ 15 files được sử dụng.
import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { SNOOPY_COLOR_STOPS, buildSnoopyGradientCss } from './snoopyConstants';
import SnoopyScene1Dreamy from './SnoopyScene1Dreamy';
import SnoopyScene2Garden from './SnoopyScene2Garden';
import SnoopyScene3Love from './SnoopyScene3Love';
import SnoopyScene4Party from './SnoopyScene4Party';
import useAudioSync from '../../hooks/useAudioSync';

/*
  Ghi chú về z-index ở các scene con theo yêu cầu (c):
  - Hiện tại một số component trong scene con (như HeroImage, CSS elements) đang 
    được phân mảng z-0 đến z-20. Lớp tiền cảnh (sân khấu) trong scene 2/3 chưa 
    dùng z-25 mà đang được đặt thứ tự nodeDOM, các SVG background đang ở z-0.
  - Sẽ giữ nguyên logic của scene con và chỉ bọc ngoài bằng lớp z-30 (overlay)
    để không can thiệp code con.
*/

const SnoopySection = () => {
  const sectionRef = useRef(null);
  
  // Parallax cuộn toàn section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  
  // Ánh sáng xuyên mây: Sáng nhất (0.3) ở giữa Scene 3 (khoảng 60% tiến trình), mờ nhất (0.05) ở đầu/cuối
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.05, 0.3, 0.05]);

  // Vùng glow theo chuột nội bộ
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    // Tính % toạ độ chuột (-1 đến 1) để làm parallax cho các ảnh con
    const xPct = (x / rect.width) * 2 - 1;
    const yPct = (y / rect.height) * 2 - 1;
    sectionRef.current.style.setProperty('--mouse-x-pct', xPct);
    sectionRef.current.style.setProperty('--mouse-y-pct', yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
    if (sectionRef.current) {
      sectionRef.current.style.setProperty('--mouse-x-pct', 0);
      sectionRef.current.style.setProperty('--mouse-y-pct', 0);
    }
  };

  // Nền linear gradient xuyên suốt 600vh
  const bgStyle = {
    background: buildSnoopyGradientCss(SNOOPY_COLOR_STOPS)
  };

  // Phản hồi âm thanh khi click Snoopy
  const { playSound } = useAudioSync('snoopy');
  const handleGlobalClick = (e) => {
    // Nếu click vào hình ảnh (tất cả ảnh Snoopy đều là thẻ img)
    if (e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
      playSound('./audio/sfx/bubble-pop.mp3', 0.25);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={bgStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClickCapture={handleGlobalClick}
    >
      {/* SCENE 1 — Góc Mộng Mơ */}
      <SnoopyScene1Dreamy />

      {/* SCENE 2 — Vườn Anh Đào */}
      <SnoopyScene2Garden />

      {/* SCENE 3 — Khu Vườn Yêu Thương */}
      <SnoopyScene3Love />

      {/* SCENE 4 — Bữa Tiệc Nhỏ */}
      <SnoopyScene4Party />

      {/* Lớp overlay ánh sáng toàn cục */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-30 mix-blend-soft-light"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(244,114,182,0.1) 100%)',
          opacity: overlayOpacity
        }}
      />

      {/* Vùng glow theo chuột */}
      <motion.div
        className="absolute pointer-events-none z-30 rounded-full bg-pink-400 mix-blend-screen"
        style={{
          width: 300,
          height: 300,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          filter: 'blur(60px)',
          opacity: 0.08
        }}
      />
    </section>
  );
};

export default SnoopySection;
