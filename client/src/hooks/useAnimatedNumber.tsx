import { useEffect, useState } from "react";

export function useAnimatedNumber(value: number, speed = 150) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let frame: number;

    const animate = () => {
      setDisplay((prev) => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.05) return Number(value.toFixed(2));
        return prev + (diff / speed) * 10;
      });
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return Number(display.toFixed(2));
}