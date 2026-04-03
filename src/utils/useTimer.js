
import { useState, useEffect } from "react";

export default function useTimer(interval = 1000) {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  
  return time;
}
