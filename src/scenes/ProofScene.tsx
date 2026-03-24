import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TextOverlay } from "../components/TextOverlay";

// Global: 22–29s | Local frame 0–225
// Transcription:
//   [22.0s] local ~0  → "Îl folosesc de 3 săptămâni și diferența e vizibilă."
//   [25.5s] local ~105 → "Pielea e mai fermă, celulita s-a redus clar."

export const ProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge pops at local frame 15
  const badgeScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 180 },
    from: 0,
    to: 1,
  });

  // Stars appear at local frame 8
  const starsOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(74,27,109,0.95) 0%, rgba(74,27,109,0.45) 55%, transparent 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 120,
        }}
      >
        {/* Stars */}
        <div style={{ opacity: starsOpacity, fontSize: 40, marginBottom: 16, letterSpacing: 4 }}>
          ⭐⭐⭐⭐⭐
        </div>

        {/* "3 săptămâni" badge */}
        <div
          style={{
            transform: `scale(${badgeScale})`,
            backgroundColor: "#D4AF37",
            borderRadius: 20,
            padding: "14px 36px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              color: "#4A1B6D",
              fontSize: 36,
              fontWeight: 900,
              fontFamily: "sans-serif",
            }}
          >
            3 săptămâni de utilizare
          </span>
        </div>

        {/* [22.0s] local 0 */}
        <TextOverlay
          text="Îl folosesc de 3 săptămâni"
          fontSize={50}
          color="#FFFFFF"
          fontWeight={800}
          delay={8}
          textAlign="center"
          maxWidth={900}
        />
        <div style={{ height: 8 }} />
        <TextOverlay
          text="și diferența e vizibilă. ✨"
          fontSize={50}
          color="#D4AF37"
          fontWeight={800}
          delay={24}
          textAlign="center"
          maxWidth={900}
        />

        <div style={{ height: 36 }} />

        {/* [25.5s] local ~105 */}
        <TextOverlay
          text="Pielea e mai fermă,"
          fontSize={44}
          color="rgba(255,255,255,0.9)"
          fontWeight={700}
          delay={105}
          textAlign="center"
          maxWidth={900}
        />
        <div style={{ height: 8 }} />
        <TextOverlay
          text="celulita s-a redus clar. 💪"
          fontSize={44}
          color="#D4AF37"
          fontWeight={700}
          delay={120}
          textAlign="center"
          maxWidth={900}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
