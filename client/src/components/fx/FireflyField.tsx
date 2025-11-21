import React from "react";
import { useFireflies } from "./../../hooks/useFireflies";

export default function FireflyField({
  count = 140,
  respawn = true,
}: {
  count?: number;
  respawn?: boolean;
}) {
  const { anchorRef, rect, fireflies, stars } = useFireflies({
    count,
    starCount: 50,
    spawnMode: "mixed", // cssDelay | negativeDelay | mixed
    respawn,
    respawnRateMs: 1100,
    respawnPercent: 0.12,
    maxRespawnSafeCount: 180,
  });

  return (
    <>
      <div ref={anchorRef} className="firefly-anchor" />

      <div
        className="firefly-container"
        style={{
          position: "fixed",
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      >
        <div className="starfield">
          {stars.map((s, i) => (
            <div
              key={i}
              className="star"
              style={
                {
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  "--twinkle": s.twinkle,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {fireflies.map((f) => (
          <div
            key={f.id}
            className="firefly"
            style={
              {
                top: `${f.top}%`,
                left: `${f.left}%`,
                "--size": f.size,
                "--hue": f.hue,
                "--bloom": f.bloom,
                "--z": f.depth,
                "--delay": f.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}
