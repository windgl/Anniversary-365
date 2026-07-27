import { useState, useEffect } from 'react';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    
    // Đặt bộ đếm thời gian gõ từng chữ mỗi 100ms
    const typingInterval = setInterval(() => {
      currentIndex++;
      setDisplayedText(text.slice(0, currentIndex));

      // Kiểm tra nếu đã gõ xong toàn bộ chuỗi
      if (currentIndex >= text.length) {
        clearInterval(typingInterval);
        
        // Chờ 2 giây sau đó tắt con trỏ nhấp nháy
        setTimeout(() => {
          setShowCursor(false);
        }, 2000);
      }
    }, 100);

    // Cleanup: xóa bộ đếm khi component bị gỡ bỏ
    return () => {
      clearInterval(typingInterval);
    };
  }, [text]); // Chạy lại hiệu ứng nếu prop 'text' thay đổi

  return (
    <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold flex items-center justify-center">
      {/* Phần Text mang màu gradient sang trọng */}
      <span className="bg-linear-to-r from-pink-200 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-md py-2">
        {displayedText}
      </span>
      
      {/* Con trỏ nhấp nháy (chỉ hiển thị khi showCursor là true) */}
      <span 
        className={`text-pink-300 font-light ml-1 -translate-y-1 md:-translate-y-2 transition-opacity duration-300 ${
          showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`}
      >
        |
      </span>
    </h1>
  );
};

export default Typewriter;