import { useEffect, useCallback } from 'react';

// Singletons ở cấp module
let sharedAmbientAudios = null;
const getSharedAmbientAudios = () => {
  if (!sharedAmbientAudios) {
    sharedAmbientAudios = {
      ocean: new Audio('./audio/ambient/ocean-waves.mp3'),
      grass: new Audio('./audio/ambient/grass-rustling.mp3'),
      sky: new Audio('./audio/ambient/sky-wind.mp3'),
      space: new Audio('./audio/ambient/space-hum.mp3'),
    };

    Object.values(sharedAmbientAudios).forEach((audio) => {
      if (!audio) return;
      audio.loop = true;
      audio.volume = 0;
    });
  }
  return sharedAmbientAudios;
};

const sharedSfxCache = {};
const sharedFadeTimers = {};

const useAudioSync = (section) => {
  // -------- Ambient (âm thanh môi trường) --------

  // Fade chuyển section
  useEffect(() => {
    const audios = getSharedAmbientAudios();
    const targetVolume = 0.3; // âm lượng tối đa

    Object.keys(audios).forEach((key) => {
      const audio = audios[key];
      if (!audio) return;

      // Hủy timer cũ nếu có
      if (sharedFadeTimers[key]) {
        clearInterval(sharedFadeTimers[key]);
      }

      if (key === section) {
        // Fade in
        audio.play().catch(() => {});
        sharedFadeTimers[key] = setInterval(() => {
          if (audio.volume < targetVolume) {
            audio.volume = Math.min(audio.volume + 0.02, targetVolume);
          } else {
            clearInterval(sharedFadeTimers[key]);
          }
        }, 50);
      } else {
        // Fade out
        sharedFadeTimers[key] = setInterval(() => {
          if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - 0.02, 0);
          } else {
            audio.pause();
            clearInterval(sharedFadeTimers[key]);
          }
        }, 50);
      }
    });
  }, [section]);

  // -------- SFX (hiệu ứng âm thanh ngắn) --------

  // Hàm phát âm thanh tổng quát – có thể dùng cho bất kỳ file SFX nào
  const playSound = useCallback((src, volume = 0.5) => {
    if (!sharedSfxCache[src]) {
      sharedSfxCache[src] = new Audio(src);
    }
    const sfx = sharedSfxCache[src].cloneNode();
    sfx.volume = volume;
    sfx.play().catch(() => {});
  }, []);

  // Các hàm cụ thể giữ lại để thuận tiện
  const playTyping = useCallback(() => {
    playSound('./audio/sfx/typing-soft.mp3', 0.5);
  }, [playSound]);

  const playRipple = useCallback(() => {
    playSound('./audio/sfx/water-ripple.mp3', 0.6);
  }, [playSound]);

  const playBubble = useCallback(() => {
    playSound('./audio/sfx/bubble-pop.mp3', 0.4);
  }, [playSound]);

  return { playTyping, playRipple, playBubble, playSound };
};

export default useAudioSync;