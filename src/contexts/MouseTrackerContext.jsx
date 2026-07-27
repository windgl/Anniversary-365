import { createContext, useContext, useRef, useEffect } from 'react';

const MouseTrackerContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useMouseTracker = () => {
  const context = useContext(MouseTrackerContext);
  if (!context) {
    throw new Error('useMouseTracker must be used within a MouseTrackerProvider');
  }
  return context;
};

export const MouseTrackerProvider = ({ children }) => {
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mousePosRef.current = { x: e.clientX, y: e.clientY };
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

  return (
    <MouseTrackerContext.Provider value={mousePosRef}>
      {children}
    </MouseTrackerContext.Provider>
  );
};
