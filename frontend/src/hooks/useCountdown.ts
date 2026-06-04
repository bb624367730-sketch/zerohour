import { useState, useEffect } from 'react';

export interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
  isUrgent: boolean; // less than 5 minutes
}

export function useCountdown(timerEndMs: string | number | null | undefined): Countdown {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timerEndMs) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: false, isUrgent: false };
  }

  const totalMs = Math.max(0, Number(timerEndMs) - now);
  const isExpired = totalMs <= 0;
  const isUrgent = totalMs < 5 * 60 * 1000; // < 5 min

  if (isExpired) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true, isUrgent: false };
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalMs, isExpired, isUrgent };
}
