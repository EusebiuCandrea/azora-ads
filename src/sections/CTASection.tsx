import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";

export const CTASection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateRight: "clamp" });

  const priceScale = spring({
    frame: Math.max(0, frame - 0.3 * fps),
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.7 },
    from: 0.5,
    to: 1,
  });

  const badgeOpacity = interpolate(frame, [0.5 * fps, 0.8 * fps], [0, 1], { extrapolateRight: "clamp" });

  const ctaOpacity = interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], { extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [0.8 * fps, 1.2 * fps], [20, 0], { extrapolateRight: "clamp" });

  // Pulse animation for CTA button
  const pulse = interpolate(
    frame % (1 * fps),
    [0, 0.5 * fps, 1 * fps],
    [1, 1.03, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0533 0%, #0d1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        opacity: containerOpacity,
      }}
    >
      {/* Logo */}
      <Img
        src={staticFile("brand/azora-logo-full.png")}
        style={{ width: 200, objectFit: "contain", marginBottom: 48 }}
      />

      {/* Discount badge */}
      <div
        style={{
          opacity: badgeOpacity,
          backgroundColor: "#a855f7",
          borderRadius: 50,
          padding: "10px 32px",
          marginBottom: 24,
          fontSize: 26,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "2px",
        }}
      >
        -41% REDUCERE
      </div>

      {/* Old price */}
      <div
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 36,
          fontFamily: "sans-serif",
          fontWeight: 500,
          textDecoration: "line-through",
          marginBottom: 8,
        }}
      >
        599 RON
      </div>

      {/* New price */}
      <div
        style={{
          transform: `scale(${priceScale})`,
          color: "#f59e0b",
          fontSize: 96,
          fontWeight: 900,
          fontFamily: "sans-serif",
          lineHeight: 1,
          marginBottom: 48,
          textShadow: "0 0 40px rgba(245,158,11,0.5)",
        }}
      >
        349 RON
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px) scale(${pulse})`,
          background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
          borderRadius: 60,
          padding: "28px 60px",
          fontSize: 34,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "sans-serif",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(168,85,247,0.5)",
          letterSpacing: "0.5px",
        }}
      >
        Comandă pe azora.ro
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: ctaOpacity,
          color: "rgba(255,255,255,0.5)",
          fontSize: 24,
          fontFamily: "sans-serif",
          marginTop: 24,
          textAlign: "center",
        }}
      >
        Livrare gratuită • Garanție 2 ani
      </div>
    </AbsoluteFill>
  );
};
