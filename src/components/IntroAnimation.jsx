import { useState, useEffect } from 'react';

const IntroAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 2.5 seconds total intro:
    // Display the logo, then slide/fade it up, then disappear
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500); // 500ms for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-surface flex flex-col items-center justify-center transition-opacity duration-500 ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center justify-center animate-intro-logo">
        <img 
          src="/images/svg-logo.png" 
          alt="Shri Vrindavan Garments Logo" 
          className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-full shadow-[0_10px_40px_rgba(184,150,12,0.2)]"
        />
        <div className="mt-8 flex gap-2">
          {"SHRI VRINDAVAN GARMENTS".split("").map((letter, i) => (
            <span 
              key={i} 
              className={`font-serif text-lg md:text-xl tracking-[0.2em] text-text ${letter === ' ' ? 'w-2' : ''}`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .animate-intro-logo {
          animation: scaleUpReveal 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes scaleUpReveal {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
