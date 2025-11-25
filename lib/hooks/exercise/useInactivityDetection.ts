import { useState, useEffect, useCallback, useRef } from "react";

interface UseInactivityDetectionProps {
  isActive: boolean;
}

export const useInactivityDetection = ({
  isActive,
}: UseInactivityDetectionProps) => {
  const [inactivityDetected, setInactivityDetected] = useState<boolean>(false);
  const lastActivityTimeRef = useRef<number>(Date.now());

  const updateActivityTime = useCallback((time: number) => {
    lastActivityTimeRef.current = time;
  }, []);

  useEffect(() => {
    if (!isActive) return;

    let inactivityTimer: NodeJS.Timeout;
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTimeRef.current;

      if (timeSinceLastActivity > 5000) {
        setInactivityDetected(true);
      } else {
        setInactivityDetected(false);
      }
    };

    inactivityTimer = setInterval(checkInactivity, 2000);
    lastActivityTimeRef.current = Date.now();
    setInactivityDetected(false);

    return () => {
      clearInterval(inactivityTimer);
    };
  }, [isActive]);

  return {
    inactivityDetected,
    updateActivityTime,
  };
};
