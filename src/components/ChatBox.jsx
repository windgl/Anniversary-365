import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ChatBox = ({ messages, playBubble, playTyping }) => {
  // Cấu hình container chứa toàn bộ tin nhắn
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1, // Khoảng cách 1 giây giữa các tin nhắn
        delayChildren: 3,    // Đợi 3 giây trước khi bắt đầu
      },
    },
  };

  // Cấu hình hiệu ứng cho từng bong bóng
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 25, 
      scale: 0.9,
      rotateX: 15, // Thêm hiệu ứng xoay nhẹ 3D
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: { 
        type: 'spring', 
        stiffness: 350, 
        damping: 25,
        mass: 0.6,
      } 
    },
  };

  const [hasTriggered, setHasTriggered] = useState(false);

  // Lên lịch phát âm thanh thủ công để đảm bảo đồng bộ tuyệt đối với staggerChildren
  useEffect(() => {
    if (!hasTriggered || !messages) return;
    
    const timers = [];
    messages.forEach((msg, index) => {
      // 3000ms delay + 1000ms mỗi tin nhắn
      const delay = 3000 + (index * 1000);
      
      const timer = setTimeout(() => {
        if (playBubble) playBubble();
        if (playTyping && msg.sender !== 'System') {
          setTimeout(() => playTyping(), 100);
        }
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [hasTriggered, messages, playBubble, playTyping]);

  return (
    <motion.div 
      className="flex flex-col gap-3 w-full max-w-lg mx-auto p-5 md:p-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={() => setHasTriggered(true)}
    >
      {messages.map((msg, index) => {
        const isEm = msg.sender === 'Em';
        const isAnh = msg.sender === 'Anh';
        const isSystem = msg.sender === 'System';
 
        // Tin nhắn hệ thống (Ngày giờ)
        if (isSystem) {
          return (
            <motion.div
              key={index}
              variants={bubbleVariants}
              className="flex items-center justify-center my-3"
            >
              <div className="flex items-center justify-center w-full max-w-xs">
                <span className="text-xs text-white/40 font-montserrat tracking-[0.15em] uppercase whitespace-nowrap px-2">
                  {msg.text}
                </span>
              </div>
            </motion.div>
          );
        }

        // Bong bóng chat cho "Anh" và "Em"
        return (
          <motion.div
            key={index}
            variants={bubbleVariants}
            className={`flex ${isAnh ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[85%] md:max-w-[75%] px-4 py-3 shadow-lg transition-all duration-300 ${
                isEm 
                  ? 'bg-linear-to-br from-pink-200/90 to-pink-100/80 text-pink-950 rounded-2xl rounded-tl-md' 
                  : 'bg-linear-to-br from-blue-200/90 to-blue-100/80 text-blue-950 rounded-2xl rounded-tr-md'
              }`}
              style={{
                boxShadow: isEm 
                  ? '0 4px 15px rgba(251, 207, 232, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)' 
                  : '0 4px 15px rgba(186, 230, 253, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              {/* Đuôi bong bóng (chat bubble tail) */}
              <div 
                className={`absolute bottom-0 w-3 h-3 ${
                  isEm 
                    ? 'left-0 -translate-x-1/2 bg-pink-200/90' 
                    : 'right-0 translate-x-1/2 bg-blue-200/90'
                }`}
                style={{
                  clipPath: isEm 
                    ? 'polygon(0 0, 100% 100%, 100% 0)' 
                    : 'polygon(0 100%, 100% 0, 0 0)',
                }}
              />
              
              {/* Nội dung tin nhắn */}
              <p className="text-[15px] md:text-base font-inter leading-relaxed whitespace-pre-wrap wrap-break-word">
                {msg.text}
              </p>
              
              {/* Tên người gửi nhỏ phía trên */}
              <span className={`block text-[10px] font-montserrat font-semibold tracking-wider mt-1.5 opacity-60 ${
                isEm ? 'text-pink-800' : 'text-blue-800'
              }`}>
                {isEm ? 'Kphun' : 'Mphu'}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ChatBox;