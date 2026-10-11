import { useEffect, useState } from "react";

// Đếm ngược theo giây, restart() để đếm lại từ đầu
export function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [runId, setRunId] = useState(0);

  const running = secondsLeft > 0;

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [running, runId]);

  const restart = (seconds: number) => {
    setSecondsLeft(seconds);
    setRunId((prev) => prev + 1);
  };

  return { secondsLeft, restart };
}
