import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, List, X, Music } from 'lucide-react';
import { BGM_PLAYLIST } from '../utils/constants';

// SVG icon loa, hiển thị sóng âm dựa trên mức volume
const VolumeIcon = ({ volume }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
    {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
  </svg>
);

const BGMPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isHoverVolume, setIsHoverVolume] = useState(false);
  const audioRef = useRef(null);
  const prevTrackIndex = useRef(0);

  // Khôi phục âm lượng từ localStorage hoặc mặc định 0.5
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('bgm-volume');
    return saved ? parseFloat(saved) : 0.5;
  });

  const currentTrack = BGM_PLAYLIST[currentTrackIndex];

  // Phát / dừng bài hiện tại
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log('Play error:', err));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Chọn một bài từ playlist
  const playTrack = useCallback((index) => {
    if (index === currentTrackIndex) {
      togglePlay();
      return;
    }
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, [currentTrackIndex, togglePlay]);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % BGM_PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);

  const prevTrack = useCallback(() => {
    const prevIndex = currentTrackIndex === 0 ? BGM_PLAYLIST.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);

  // Thay đổi âm lượng
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    localStorage.setItem('bgm-volume', val);
  };

  // Tự động phát khi trang được mở (xử lý chính sách autoplay)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const attemptAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Trình duyệt chặn autoplay – đợi tương tác đầu tiên của người dùng
        const playOnInteraction = () => {
          audio.play().catch(() => {});
          setIsPlaying(true);
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
      }
    };

    attemptAutoplay();

    return () => {
      audio.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cập nhật src và phát khi chuyển bài
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (prevTrackIndex.current !== currentTrackIndex) {
      audio.src = BGM_PLAYLIST[currentTrackIndex].src;
      audio.load();
      audio.volume = volume;
      if (isPlaying) {
        audio.play().catch(() => {});
      }
      prevTrackIndex.current = currentTrackIndex;
    }
  }, [currentTrackIndex, isPlaying, volume]);

  // Tự động chuyển bài khi kết thúc
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => nextTrack();
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [nextTrack]);

  // Đồng bộ trạng thái isPlaying với sự kiện play/pause thực tế
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="fixed top-4 left-4 z-50 flex flex-col items-start"
    >
      {/* Thanh điều khiển chính */}
      <div className="glass-card rounded-full! flex items-center gap-2 px-3 py-2 shadow-lg">
        <audio
          ref={audioRef}
          src={BGM_PLAYLIST[currentTrackIndex].src}
          preload="auto"
        />

        {/* Play / Pause */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-pink-300 hover:bg-white/20 transition-colors"
        >
          {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
        </motion.button>

        {/* Previous */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevTrack}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-pink-300 hover:bg-white/20 transition-colors"
        >
          <SkipBack size={12} className="fill-current" />
        </motion.button>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextTrack}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-pink-300 hover:bg-white/20 transition-colors"
        >
          <SkipForward size={12} className="fill-current" />
        </motion.button>

        {/* Thông tin bài hát */}
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-montserrat leading-none mb-1">
            Now Playing
          </span>
          <span className="text-sm font-inter font-medium text-cream leading-none truncate max-w-[120px]">
            {currentTrack.title}
          </span>
        </div>

        {/* ───── Điều khiển âm lượng (vẽ bằng code, trượt ngang) ───── */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsHoverVolume(true)}
          onMouseLeave={() => setIsHoverVolume(false)}
        >
          {/* Nút loa (luôn hiển thị) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-pink-300 hover:bg-white/20 transition-colors"
            aria-label="Âm lượng"
          >
            <VolumeIcon volume={volume} />
          </motion.button>

          {/* Thanh trượt âm lượng – trượt ra từ nút khi rê chuột */}
          <motion.div
            initial={false}
            animate={{
              width: isHoverVolume ? 80 : 0,
              opacity: isHoverVolume ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="overflow-hidden ml-1 flex items-center"
            style={{ height: '24px' }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider w-full m-0"
            />
          </motion.div>
        </div>

        {/* Mở danh sách phát */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-pink-300 hover:bg-white/20 transition-colors"
        >
          {showPlaylist ? <X size={12} /> : <List size={12} />}
        </motion.button>
      </div>

      {/* Danh sách bài hát */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1 glass-card rounded-xl! overflow-hidden w-full max-w-[220px]"
          >
            <div className="p-2 space-y-1">
              {BGM_PLAYLIST.map((track, index) => (
                <button
                  key={index}
                  onClick={() => playTrack(index)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-inter text-sm transition-colors flex justify-between items-center ${
                    index === currentTrackIndex
                      ? 'bg-white/20 text-pink-200 font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate">{track.title}</span>
                  {index === currentTrackIndex && isPlaying && (
                    <Music size={12} className="text-pink-300 ml-1 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BGMPlayer;