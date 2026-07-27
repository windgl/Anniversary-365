import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

const TiltCard = ({ children, className = '' }) => {
  // Tham chiếu đến thẻ div thực tế trên DOM
  const tiltRef = useRef(null);

  useEffect(() => {
    // Khởi tạo hiệu ứng Tilt khi component được mount
    const tiltEl = tiltRef.current;
    if (tiltEl) {
      VanillaTilt.init(tiltEl, {
        max: 10,              // Góc nghiêng tối đa (độ)
        speed: 1000,          // Tốc độ chuyển động trở lại vị trí cũ
        glare: true,          // Bật hiệu ứng ánh sáng lóa kính
        "max-glare": 0.3,     // Độ chói tối đa (0 đến 1)
        scale: 1.02,          // Phóng to nhẹ khi hover để tăng cảm giác 3D
      });
    }

    // Dọn dẹp (cleanup) sự kiện lắng nghe của VanillaTilt khi component bị gỡ bỏ
    return () => {
      if (tiltEl && tiltEl.vanillaTilt) {
        tiltEl.vanillaTilt.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={tiltRef} 
      // Gộp class mặc định (bo tròn, tràn viền) với class tùy biến truyền từ ngoài vào
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default TiltCard;