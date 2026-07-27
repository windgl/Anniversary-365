 
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Mail, Loader2 } from 'lucide-react';
import emailjs from 'emailjs-com';
import useAudioSync from '../hooks/useAudioSync';

const ReplyBox = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState([]);
  const textareaRef = useRef(null);

  const { playTyping } = useAudioSync('replybox');

  const handleChange = (e) => {
    setMessage(e.target.value);
    playTyping();
  };

  const generateHearts = () => {
    const hearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 80 + 10}%`,
      duration: Math.random() * 1.5 + 1,
      delay: Math.random() * 0.5,
      size: Math.random() * 16 + 12
    }));
    setFlyingHearts(hearts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);

    const templateParams = {
      message: message,
    };

    emailjs.send(
      "service_mphulovekphun",
      "template_x4eqe3o",
      templateParams,
      "j-6LlihUH6GNu_ZZC"
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setIsSending(false);
        setIsSuccess(true);
        setMessage('');
        generateHearts();

        setTimeout(() => {
          setIsSuccess(false);
          setFlyingHearts([]);
        }, 4000);
      })
      .catch((err) => {
        console.error('FAILED...', err);
        setIsSending(false);
        alert('Có lỗi xảy ra khi gửi. Bạn thử kiểm tra lại kết nối mạng nhé!');
      });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-black/40 border border-white/10 p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl"
      >
        {/* Hiệu ứng nền trái tim mờ */}
        <div className="absolute -top-10 -right-10 text-pink-300/10 pointer-events-none select-none">
          <Heart size={160} className="fill-current" />
        </div>
        <div className="absolute -bottom-10 -left-10 text-rose-300/10 pointer-events-none select-none">
          <Mail size={160} className="fill-current" />
        </div>

        <h3 className="font-playfair text-3xl font-bold text-center text-pink-100 mb-2 drop-shadow-sm">
          Gửi gắm yêu thương
        </h3>
        <p className="font-inter text-sm text-center text-white/70 mb-6">
          Em bé đáng iu của anh điều gì muốn nói với anh hong?
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          {/* Nhập text */}
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              required
              maxLength={10000}
              placeholder="Hãy ghi ra những cảm nghĩ của em..."
              rows="5"
              className="w-full bg-black/20 text-white placeholder-white/40 border border-white/10 rounded-xl p-4 font-inter text-sm md:text-base outline-none resize-none transition-all duration-300 focus:bg-black/40 focus:border-pink-300/60 focus:ring-2 focus:ring-pink-300/30 shadow-inner"
              disabled={isSending}
              style={{ caretColor: '#f472b6' }}
            />
            <span className="absolute bottom-3 right-3 text-pink-300/30 pointer-events-none">
              <Sparkles size={18} />
            </span>
          </div>

          <button
            type="submit"
            disabled={isSending || isSuccess || !message.trim()}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-montserrat font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
              isSuccess
                ? 'bg-green-500 text-white cursor-default shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                : 'bg-pink-400 hover:bg-pink-300 text-pink-950 shadow-[0_0_20px_rgba(244,114,182,0.4)] hover:shadow-[0_0_30px_rgba(244,114,182,0.6)] active:scale-95'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSending ? (
              <span className="animate-pulse flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Đang gửi tín hiệu...
              </span>
            ) : isSuccess ? (
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="animate-pulse" /> Đã gửi thành công!
              </span>
            ) : (
              <>
                <span>Gửi lời nhắn</span>
                <Heart size={18} className="fill-current" />
              </>
            )}
          </button>
        </form>

        {/* Cơn mưa trái tim khi gửi thành công */}
        <AnimatePresence>
          {isSuccess && flyingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, y: 20, scale: 0.3 }}
              animate={{ opacity: [1, 0.8, 0], y: -160, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: heart.duration,
                delay: heart.delay,
                ease: "easeOut",
              }}
              className="absolute bottom-8 pointer-events-none drop-shadow-[0_0_8px_rgba(244,114,182,0.9)] text-pink-400"
              style={{ left: heart.left }}
            >
              <Heart size={heart.size} className="fill-current" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReplyBox;
