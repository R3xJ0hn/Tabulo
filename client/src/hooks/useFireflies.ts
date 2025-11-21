import { useEffect, useMemo, useRef, useState } from "react";

export type Firefly = {
  id: string;
  depth: number;
  top: number;
  left: number; 
  size: string;
  hue: string; // seconds for hue animation
  bloom: string; // seconds for bloom animation
  delay: string; // can be negative for lifecycle offset
};

export function useFireflies(
  opts?: {
    count?: number;
    starCount?: number;
    spawnMode?: "cssDelay" | "negativeDelay" | "mixed"; // how delays are assigned
    respawn?: boolean; // whether to do JS-driven respawns
    respawnRateMs?: number; // how often to perform respawn checks
    respawnPercent?: number; // fraction to respawn each tick (0..1)
    maxRespawnSafeCount?: number; // avoid heavy respawn for very large counts
  }
) {
  const {
    count = 220,
    starCount = 60,
    spawnMode = "mixed",
    respawn = false,
    respawnRateMs = 1200,
    respawnPercent = 0.12,
    maxRespawnSafeCount = 200,
  } = opts ?? {};

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const makeId = () =>
    (typeof crypto !== "undefined" && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : Math.random().toString(36).slice(2, 9));

  const createFirefly = (): Firefly => {
    const depth = Math.random(); // 0..1 (used for blur/size)
    const r = Math.random();
    const size =
      depth < 0.4 ? `${r * 1.2 + 0.4}px` : depth < 0.8 ? `${r * 2 + 1}px` : `${r * 4 + 2}px`;

    // delays:
    const positiveDelay = `${Math.random() * 5}s`; // 0..5s
    const negativeDelay = `-${Math.random() * 6}s`; // -0..-6s
    let delay = positiveDelay;
    if (spawnMode === "negativeDelay") delay = negativeDelay;
    else if (spawnMode === "mixed") delay = Math.random() > 0.5 ? negativeDelay : positiveDelay;
    else if (spawnMode === "cssDelay") delay = positiveDelay;

    return {
      id: makeId(),
      depth,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size,
      hue: `${5 + r * 7}s`,
      bloom: `${6 + r * 14}s`,
      delay,
    };
  };

  // static fireflies (no respawn) -> memo
  const staticFireflies = useMemo(
    () => Array.from({ length: count }).map(() => createFirefly()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, spawnMode]
  );

  // stars (always static)
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: `${Math.random() * 1.5 + 0.5}px`,
        twinkle: `${4 + Math.random() * 6}s`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [starCount]
  );

  // If respawn is disabled or count too high, return static arrays (best perf)
  if (!respawn || count > maxRespawnSafeCount) {
    return { anchorRef, rect, fireflies: staticFireflies, stars };
  }

  // Respawn mode: manage state and interval for partial respawns
  const [fireflies, setFireflies] = useState<Firefly[]>(() =>
    Array.from({ length: count }).map(() => createFirefly())
  );

  useEffect(() => {
    let mounted = true;
    if (!respawn) return;

    const tick = () => {
      setFireflies((prev) => {
        // clone once
        const next = prev.slice();
        const respawnCount = Math.max(1, Math.floor(next.length * respawnPercent));
        for (let i = 0; i < respawnCount; i++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = createFirefly();
        }
        return next;
      });
    };

    const id = setInterval(() => {
      if (!mounted) return;
      tick();
    }, Math.max(200, respawnRateMs));

    return () => {
      mounted = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respawn, respawnRateMs, respawnPercent, spawnMode]);

  return { anchorRef, rect, fireflies, stars };
}
