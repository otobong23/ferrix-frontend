'use client';

import { useEffect, useState } from "react";

const DURATION = 30 * 60; // 30 minutes in seconds

const CountdownTimer = ({ onExpire }: { onExpire?: () => void }) => {
  const [secondsLeft, setSecondsLeft] = useState(DURATION);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const isUrgent = secondsLeft <= 5 * 60; // last 5 minutes

  return (
    <div className="flex flex-col items-center gap-1 mx-4 mt-4 px-3 py-3.5 rounded-lg bg-[#F5F5F7]/7">
      <p className="text-sm text-[#9EA4AA]">Order expires in</p>
      <p className={`text-2xl font-bold tabular-nums tracking-widest ${isUrgent ? 'text-red-400' : 'text-[#4DB6AC]'}`}>
        {minutes}:{seconds} minutes
      </p>
      {secondsLeft <= 0 && (
        <p className="text-sm text-red-400">Order expired. Please create a new one.</p>
      )}
    </div>
  );
};

export default CountdownTimer;