import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";

export const BrandSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = interpolate(frame, [0, 0.5 * fps], [0.8, 1], { extrapolateRight: "clamp" });

  const taglineOpacity = interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Gradient overlay — slightly darker than hook for brand focus */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(26,5,51,0.72) 0%, rgba(13,27,75,0.82) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile("brand/azora-logo-full.png")}
            style={{ width: 320, objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            opacity: taglineOpacity,
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 400,
            fontFamily: "sans-serif",
            textAlign: "center",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          Tehnologie profesională. Acasă.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
