import { useEffect, useState } from 'react';

const IntroAnimation = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('svg_intro_shown');
    if (!hasPlayed) {
      setIsPlaying(true);
      sessionStorage.setItem('svg_intro_shown', 'true');
      const timer = setTimeout(() => setIsPlaying(false), 3800);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isPlaying) return null;

  return (
    <div id="introOverlay">
      <div className="intro-content">
        <div className="intro-logo-wrap">
          <img
            src="/images/svg-logo.png"
            alt="Shri Vrindavan Garments"
            className="intro-logo"
            draggable="false"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        <div className="intro-line"></div>
        <p className="intro-tagline">The Groom's House · Delhi</p>
      </div>
    </div>
  );
};

export default IntroAnimation;
