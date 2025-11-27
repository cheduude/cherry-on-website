// src/security/deviceDetect.ts
import { useEffect, useState } from 'react';

export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  return { isMobile };
};