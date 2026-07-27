import { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { VIDEO_SPEED_CONFIG } from '../utils/constants';

const LazyVideo = ({ src, className = '', ...props }) => {
  const { ref: loadRef, inView: hasLoaded } = useInView({
    triggerOnce: true, // Only load the video once it is scrolled into view
    rootMargin: '200px 0px', // Start loading 200px before it rolls into view
  });

  const { ref: playRef, inView: isPlaying } = useInView({
    triggerOnce: false,
  });

  const videoRef = useRef(null);

  const setVideoRef = (node) => {
    videoRef.current = node;
    loadRef(node);
    playRef(node);
  };

  const setDivRef = (node) => {
    loadRef(node);
    playRef(node);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      const isException = VIDEO_SPEED_CONFIG?.exceptions?.includes(src);
      video.playbackRate = isException ? 1 : (VIDEO_SPEED_CONFIG?.defaultPlaybackRate || 10);
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, src]);

  return (
    <>
      {hasLoaded ? (
        <video
          ref={setVideoRef}
          src={src}
          className={className}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          {...props}
        />
      ) : (
        <div ref={setDivRef} className={`${className} flex items-center justify-center min-h-[200px]`}>
          <span className="text-white/20 text-xs font-mono animate-pulse">Đang tải video...</span>
        </div>
      )}
    </>
  );
};

export default LazyVideo;
