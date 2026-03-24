import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const BENEFITS = [
  "Reduce celulita vizibil",
  "Lifting facial acasă",
  "Tonifiere & fermitate",
];

export const BenefitsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0533 0%, #0d1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        gap: 0,
      }}
    >
      <div
        style={{
          color: "#a855f7",
          fontSize: 24,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: "5px",
          textTransform: "uppercase",
          marginBottom: 48,
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        REZULTATE REALE
      </div>

      {BENEFITS.map((benefit, index) => {
        const delay = index * 0.35 * fps;
        const opacity = interpolate(frame, [delay, delay + 0.4 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateX = interpolate(frame, [delay, delay + 0.4 * fps], [-60, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 36,
              opacity,
              transform: `translateX(${translateX}px)`,
              width: "100%",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 26,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "sans-serif",
              }}
            >
              ✓
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 38,
                fontWeight: 700,
                fontFamily: "sans-serif",
                lineHeight: 1.2,
              }}
            >
              {benefit}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
