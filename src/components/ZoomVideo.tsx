import { Video } from "@remotion/media";
import { interpolate, useCurrentFrame } from "remotion";

// ZoomVideo — Ken Burns continuous zoom + micro camera drift.
// Folosit MEREU în interiorul unui <Sequence> (useCurrentFrame = local frame 0).
//
// zoomAmount=0.06 → hook (mai agresiv, scroll-stopping)
// zoomAmount=0.04 → middle segments (subtil)
// zoomAmount=0.02 → CTA background (minimal)
// driftX/driftY   → drift px linear pe durata clipului (parallax effect)
//                   Alternează ±8–12px per clip pentru efect dinamic.

interface ZoomVideoProps {
  src: string;
  style: React.CSSProperties;
  duration: number;
  zoomAmount?: number;
  driftX?: number;
  driftY?: number;
  playbackRate?: number;
  trimBefore?: number;
}

export const ZoomVideo: React.FC<ZoomVideoProps> = ({
  src,
  style,
  duration,
  zoomAmount = 0.04,
  driftX = 0,
  driftY = 0,
  playbackRate,
  trimBefore,
}) => {
  const frame = useCurrentFrame();
  const kenBurns = interpolate(frame, [0, duration], [1, 1 + zoomAmount], {
    extrapolateRight: "clamp",
  });
  const dx = driftX
    ? interpolate(frame, [0, duration], [0, driftX], { extrapolateRight: "clamp" })
    : 0;
  const dy = driftY
    ? interpolate(frame, [0, duration], [0, driftY], { extrapolateRight: "clamp" })
    : 0;
  return (
    <Video
      src={src}
      volume={0}
      style={{
        ...style,
        transform: `${style.transform ?? ""} scale(${kenBurns}) translateX(${dx}px) translateY(${dy}px)`,
      }}
      playbackRate={playbackRate}
      trimBefore={trimBefore}
    />
  );
};
