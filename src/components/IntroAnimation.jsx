import { useEffect, useState } from 'react';

const IntroAnimation = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('tr_intro_played');
    if (!hasPlayed) {
      setIsPlaying(true);
      sessionStorage.setItem('tr_intro_played', 'true');
      
      const finishTimer = setTimeout(() => {
        setIsPlaying(false);
      }, 1500);

      return () => clearTimeout(finishTimer);
    }
  }, []);

  if (!isPlaying) return null;

  return (
    <div id="introOverlay">
      <div className="intro-content">
        <img 
          src="/images/tr-traders-logo.png" 
          alt="TR TRADERS" 
          className="intro-logo"
        />
        <div className="intro-line"></div>
        <p className="intro-tagline">Ladies Suits Collection</p>
      </div>
    </div>
  );
};

export default IntroAnimation;
