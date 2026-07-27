import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

// Global Components
import CustomCursor from './components/CustomCursor';
import BGMPlayer from './components/BGMPlayer';
import ScrollProgress from './components/ScrollProgress';
import BalloonButton from './components/BalloonButton';

// Sections
import Hero from './sections/Hero';
import Space from './sections/Space';
import Sky from './sections/Sky';
import Grass from './sections/Grass';
import Ocean from './sections/Ocean';

// Transitions
import Transition01HeroSpace from './components/transitions/Transition01HeroSpace';
import Transition02SpaceSky from './components/transitions/Transition02SpaceSky';
import Transition03SkyGrass from './components/transitions/Transition03SkyGrass';
import Transition04GrassOcean from './components/transitions/Transition04GrassOcean';
import TransitionOceanSnoopy from './components/transitions/TransitionOceanSnoopy';
import TransitionSnoopyRose from './components/transitions/TransitionSnoopyRose';

import Transition07RoseRedThread from './components/transitions/Transition07RoseRedThread';
import Transition08RedThreadDandelion from './components/transitions/Transition08RedThreadDandelion';
import Transition09DandelionWordSphere from './components/transitions/Transition09DandelionWordSphere';
import Transition10WordSphereMirror from './components/transitions/Transition10WordSphereMirror';
import Transition11MirrorSparkler from './components/transitions/Transition11MirrorSparkler';
import Transition12SparklerBucketList from './components/transitions/Transition12SparklerBucketList';
import Transition13BucketListLantern from './components/transitions/Transition13BucketListLantern';
import Transition14LanternReply from './components/transitions/Transition14LanternReply';

// Features
import SnoopySection from './features/snoopy/SnoopySection'; // Góc hồng Snoopy
import LittlePrinceRose from './components/LittlePrinceRose'; // Đóa hồng Hoàng Tử Bé
import RedThreadSection from './features/RedThreadSection';   // Sợi chỉ đỏ
import DandelionSection from './features/DandelionSection';   // Bồ công anh
import WordSphereSection from './features/WordSphereSection'; // Quả cầu từ ngữ
import MirrorSection from './features/MirrorSection';         // Phản chiếu bóng nước
import SparklerSection from './features/SparklerSection';     // Pháo bông
import LanternReleaseSection from './features/LanternReleaseSection'; // Lồng đèn trời
import ReplyBox from './features/ReplyBox';               // Form gửi lời nhắn
import BucketList from './features/BucketList';           // Những điều muốn làm cùng em

// ──────────────────────────────────────────────
// Component bọc section với hiệu ứng lazy load mượt mà, tải nhanh chóng
// ──────────────────────────────────────────────
const SectionContainer = ({ children, className = '', placeholderHeight = 'min-h-[100vh]', ...props }) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  
  const handleInViewChange = useCallback((inViewVal) => {
    if (inViewVal && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [hasBeenVisible]);

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '600px 0px 600px 0px',
    onChange: handleInViewChange
  });

  return (
    <div
      ref={ref}
      className={`relative section-heavy ${className} ${!hasBeenVisible ? placeholderHeight : ''} ${!inView ? 'pause-animations' : ''}`}
      {...props}
    >
      {hasBeenVisible ? children : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/25">
          <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-white/30 animate-spin" />
        </div>
      )}
    </div>
  );
};

import { MouseTrackerProvider } from './contexts/MouseTrackerContext';
import HandTrackerIntro from './components/HandTrackerIntro';

// ──────────────────────────────────────────────
// App chính – Thứ tự:
// Hero → Vũ trụ → Bầu trời → Thảm cỏ → Đại dương
// → Góc nhỏ của em → Bức thư → ReplyBox
// (Dòng thời gian đã được merge vào từng section)
// ──────────────────────────────────────────────
const App = () => {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
          document.documentElement.style.setProperty('--mouse-x-pct', `${((e.clientX / window.innerWidth) - 0.5).toFixed(3)}`);
          document.documentElement.style.setProperty('--mouse-y-pct', `${((e.clientY / window.innerHeight) - 0.5).toFixed(3)}`);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!introDone) {
    return <HandTrackerIntro onComplete={() => setIntroDone(true)} />;
  }

  return (
    <MouseTrackerProvider>
      <main className="relative w-full min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-pink-300/30 selection:text-pink-900 font-inter">
        {/* Toàn cục */}
        <CustomCursor />
        <BGMPlayer />
        <ScrollProgress />
        <BalloonButton />

        {/* 1. HERO – màn hình chào, tách rèm, đếm ngược */}
        <div className="relative">
          <Hero />
        </div>

        <Transition01HeroSpace />

        {/* 2. VŨ TRỤ (Space) – bụi sáng, chòm sao 3D thực tế, timeline vũ trụ, canvas vẽ */}
        <SectionContainer placeholderHeight="min-h-[450vh]">
          <Space />
        </SectionContainer>

        <Transition02SpaceSky />

        {/* 3. BẦU TRỜI (Sky) – mây trôi parallax, đàn chim, timeline quà em tặng */}
        <SectionContainer placeholderHeight="min-h-[380vh]">
          <Sky />
        </SectionContainer>

        <Transition03SkyGrass />

        {/* 4. THẢM CỎ (Grass) – cây bên phải lớn dần, dấu chân, timeline quà anh tặng */}
        <SectionContainer placeholderHeight="min-h-[840vh]">
          <Grass />
        </SectionContainer>

        <Transition04GrassOcean />

        {/* 5. ĐẠI DƯƠNG (Ocean) – sóng CSS, bong bóng, timeline lần đầu gặp */}
        <SectionContainer placeholderHeight="min-h-[450vh]">
          <Ocean />
        </SectionContainer>

        <TransitionOceanSnoopy />

        {/* GÓC HỒNG SNOOPY – 4 khung cảnh tương tác, không có timeline dữ liệu */}
        <SectionContainer placeholderHeight="min-h-[600vh]">
          <SnoopySection />
        </SectionContainer>

        <TransitionSnoopyRose />

        {/* ĐÓA HỒNG HOÀNG TỬ BÉ */}
        <SectionContainer placeholderHeight="min-h-[60vh]">
          <LittlePrinceRose />
        </SectionContainer>
        
        <Transition07RoseRedThread />

        {/* SỢI CHỈ ĐỎ */}
        <SectionContainer placeholderHeight="min-h-[100vh]">
          <RedThreadSection />
        </SectionContainer>
        
        <Transition08RedThreadDandelion />

        {/* BỒ CÔNG ANH */}
        <SectionContainer placeholderHeight="min-h-[110vh]">
          <DandelionSection />
        </SectionContainer>
        
        <Transition09DandelionWordSphere />

        {/* QUẢ CẦU TỪ NGỮ */}
        <SectionContainer placeholderHeight="min-h-[110vh]">
          <WordSphereSection />
        </SectionContainer>
        
        <Transition10WordSphereMirror />

        {/* PHẢN CHIẾU BÓNG NƯỚC */}
        <SectionContainer placeholderHeight="min-h-[100vh]">
          <MirrorSection />
        </SectionContainer>
        
        <Transition11MirrorSparkler />

        {/* PHÁO BÔNG */}
        <SectionContainer placeholderHeight="min-h-[100vh]">
          <SparklerSection />
        </SectionContainer>
        
        <Transition12SparklerBucketList />

        {/* NHỮNG ĐIỀU ANH MUỐN LÀM CÙNG EM (Kết hợp phòng Nhật Bản) */}
        <SectionContainer placeholderHeight="min-h-[160vh]">
          <BucketList />
        </SectionContainer>

        <Transition13BucketListLantern />

        {/* LỒNG ĐÈN TRỜI */}
        <SectionContainer placeholderHeight="min-h-[100vh]">
          <LanternReleaseSection />
        </SectionContainer>

        <Transition14LanternReply />

        {/* 8. REPLY BOX – form gửi lời nhắn qua EmailJS */}
        <SectionContainer placeholderHeight="min-h-[60vh]">
          <div className="w-full bg-[#090a0f] py-16">
            <ReplyBox />
          </div>
        </SectionContainer>
      </main>
    </MouseTrackerProvider>
  );
};

export default App;