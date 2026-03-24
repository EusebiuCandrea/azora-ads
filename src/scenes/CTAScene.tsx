import { AbsoluteFill, interpolate, spring, staticFile, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { TextOverlay } from "../components/TextOverlay";

// Global: 29–36s | Local frame 0–210
// Transcription [28.8s]: "Îl găsești pe azora.ro, comandă acum, link în descriere."
// Woman points directly at camera → perfect CTA moment

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing overlay
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.8),
    [-1, 1],
    [0.78, 0.88]
  );

  // Button spring entrance
  const buttonScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 160 },
    from: 0,
    to: 1,
  });

  // Arrow bounce
  const arrowX = interpolate(
    Math.sin((frame / fps) * Math.PI * 3),
    [-1, 1],
    [0, 12]
  );

  // Price fade in
  const priceOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Pulsing purple overlay — woman pointing at camera underneath */}
      <AbsoluteFill
        style={{ background: `rgba(74,27,109,${pulse})` }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 52px",
        }}
      >
        {/* Logo */}
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          marginBottom: 32,
        }}>
          <Img
            src={staticFile("brand/azora-logo-full.png")}
            style={{ width: 280, objectFit: "contain" }}
          />
        </div>

        {/* Matches what she says: "Îl găsești pe azora.ro" */}
        <TextOverlay
          text="Îl găsești pe"
          fontSize={52}
          color="rgba(255,255,255,0.85)"
          fontWeight={600}
          delay={8}
          textAlign="center"
          maxWidth={900}
        />
        <TextOverlay
          text="azora.ro"
          fontSize={80}
          color="#D4AF37"
          fontWeight={900}
          delay={20}
          textAlign="center"
          maxWidth={900}
        />

        <div style={{ height: 32 }} />

        {/* Price */}
        <div
          style={{
            opacity: priceOpacity,
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 34,
              fontFamily: "sans-serif",
              textDecoration: "line-through",
            }}
          >
            599 RON
          </span>
          <span
            style={{
              color: "#D4AF37",
              fontSize: 72,
              fontWeight: 900,
              fontFamily: "sans-serif",
              textShadow: "0 0 30px rgba(212,175,55,0.5)",
            }}
          >
            349 RON
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            transform: `scale(${buttonScale})`,
            background: "linear-gradient(135deg, #D4AF37 0%, #f0c94a 100%)",
            borderRadius: 60,
            padding: "26px 52px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 8px 40px rgba(212,175,55,0.55)",
          }}
        >
          <span
            style={{
              color: "#4A1B6D",
              fontSize: 38,
              fontWeight: 900,
              fontFamily: "sans-serif",
            }}
          >
            Comandă acum
          </span>
          <span style={{ fontSize: 38, transform: `translateX(${arrowX}px)` }}>
            →
          </span>
        </div>

        <div style={{ height: 18 }} />
        <div
          style={{
            opacity: interpolate(frame, [55, 75], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            color: "rgba(255,255,255,0.55)",
            fontSize: 26,
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          Link în descriere • Livrare gratuită
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
