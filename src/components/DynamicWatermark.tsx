import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";

// DynamicWatermark — logo Azora în 6 poziții rotative, cu cross-fade.
// Anti-copy: schimbă poziția la fiecare 4s pentru a dificulta editarea.
// Activ de la f0 până la start CTA (include în <Sequence durationInFrames={ctaStart}>).
//
// Folosire:
//   <Sequence from={0} durationInFrames={ctaStart}>
//     <DynamicWatermark />
//   </Sequence>

const WATERMARK_POSITIONS = [
  { top: "8%", left: "6%" },
  { top: "8%", right: "6%" },
  { top: "38%", left: "6%" },
  { top: "38%", right: "6%" },
  { top: "68%", left: "6%" },
  { top: "68%", right: "6%" },
];
const SWITCH_EVERY_FRAMES = 120; // 4s @ 30fps

export const DynamicWatermark: React.FC = () => {
  const frame = useCurrentFrame();
  const posIndex = Math.floor(frame / SWITCH_EVERY_FRAMES) % WATERMARK_POSITIONS.length;
  const nextIndex = (posIndex + 1) % WATERMARK_POSITIONS.length;
  const frameInSlot = frame % SWITCH_EVERY_FRAMES;
  const fadeFrames = 15;

  const fadeOut = interpolate(
    frameInSlot,
    [SWITCH_EVERY_FRAMES - fadeFrames, SWITCH_EVERY_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeIn = interpolate(
    frameInSlot,
    [SWITCH_EVERY_FRAMES - fadeFrames, SWITCH_EVERY_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const wStyle: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };

  return (
    <>
      <div style={{ ...wStyle, ...WATERMARK_POSITIONS[posIndex], opacity: 0.38 * fadeOut }}>
        <Img
          src={staticFile("brand/logo-copywrite.png")}
          style={{ width: 130, objectFit: "contain" }}
        />
      </div>
      <div style={{ ...wStyle, ...WATERMARK_POSITIONS[nextIndex], opacity: 0.38 * fadeIn }}>
        <Img
          src={staticFile("brand/logo-copywrite.png")}
          style={{ width: 130, objectFit: "contain" }}
        />
      </div>
    </>
  );
};
