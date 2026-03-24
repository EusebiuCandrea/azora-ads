import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const HookSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], { extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [0, 0.5 * fps], [40, 0], { extrapolateRight: "clamp" });

  const line2Opacity = interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], { extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [0.5 * fps, 1 * fps], [40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Gradient overlay over the video from parent */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(26,5,51,0.55) 0%, rgba(13,27,75,0.65) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            color: "#ffffff",
            fontSize: 88,
            fontWeight: 900,
            fontFamily: "sans-serif",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          CORPUL TĂU.
        </div>
        <div
          style={{
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            color: "#a855f7",
            fontSize: 88,
            fontWeight: 900,
            fontFamily: "sans-serif",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            textShadow: "0 4px 30px rgba(168,85,247,0.6)",
          }}
        >
          TRANSFORMAT.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
