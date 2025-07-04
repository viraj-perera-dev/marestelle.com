'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export default function LenisProvider({ children }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Enable Lenis only if screen width is at least 768px
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  if (!isDesktop) {
    // On mobile/tablet, return children directly without Lenis
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        smoothWheel: true,
        lerp: 0.05,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        syncTouch: true,
        syncTouchLerp: 0.1,
        touchInertiaMultiplier: 50,
        wheelMultiplier: 0.75,
        touchMultiplier: 0.75,
        normalizeWheel: false,
        infinite: false,
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
