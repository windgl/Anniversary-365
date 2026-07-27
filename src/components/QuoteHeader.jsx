
import { motion } from 'framer-motion';

const QuoteHeader = ({ quote, author, source, className = "" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className={`flex flex-col items-center justify-center w-full px-6 py-8 ${className}`}
    >
      <div className="w-16 md:w-24 h-[1px] bg-white/20 mb-6" />
      
      <p className="font-cormorant italic text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-100 leading-relaxed max-w-2xl text-center">
        "{quote}"
      </p>
      
      <p className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-white/30 mt-4 text-center">
        — {author}{source ? `, ${source}` : ''}
      </p>
      
      <div className="w-16 md:w-24 h-[1px] bg-white/20 mt-6" />
    </motion.div>
  );
};

export default QuoteHeader;
