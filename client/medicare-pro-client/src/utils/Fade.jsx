import React, { useRef, useEffect, useState } from 'react';

const FadeInSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "fade-in-up" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.3s`,
        animationDelay: isVisible ? `${delay}s` : "0s"
      }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
