import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// CTAOverlay — overlay CTA standard Azora, ultimele ~6s din orice video.
//
// Folosire:
//   <Sequence from={ctaStart} durationInFrames={TOTAL_FRAMES - ctaStart}>
//     <CTAOverlay tagline="Cadoul perfect pentru ea —\ntrandafir etern + colier" />
//   </Sequence>
//
// Props:
//   tagline        — text sub logo (produs-specific, obligatoriu)
//   discountLabel  — badge roșu stânga, e.g. "-28% AZI" (opțional)
//   deliveryLabel  — badge auriu dreapta, e.g. "✓ Livrare 24h" (opțional)
//   urgencyText    — text urgență mic, e.g. "⚡ Stoc limitat" (opțional)
//   ctaText        — text buton gold (opțional)
//   overlayColor   — culoarea dark overlay RGB, default brand purple (opțional)
//   originalPrice  — preț vechi tăiat, e.g. "599 RON" (opțional)
//   currentPrice   — preț nou mare, e.g. "349 RON" (opțional)

interface CTAOverlayProps {
  tagline: string;
  discountLabel?: string;
  deliveryLabel?: string;
  urgencyText?: string;
  ctaText?: string;
  overlayColor?: string;
  originalPrice?: string;
  currentPrice?: string;
}

export const CTAOverlay: React.FC<CTAOverlayProps> = ({
  tagline,
  discountLabel,
  deliveryLabel = "✓ Livrare 24h",
  urgencyText = "⚡ Stoc limitat — comandă acum",
  ctaText = "Comandă acum pe Azora.ro",
  overlayColor = "74, 27, 109",
  originalPrice,
  currentPrice,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 0.85], {
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [30, 0]);
  const buttonScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 160 },
    from: 0,
    to: 1,
  });
  const arrowX = interpolate(Math.sin((frame / fps) * Math.PI * 3), [-1, 1], [0, 10]);
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 1.5), [-1, 1], [0.97, 1.03]);

  const badgeOpacity = interpolate(frame, [25, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeScale = interpolate(frame, [25, 42], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const priceOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const priceScale = interpolate(frame, [35, 50], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark brand overlay */}
      <AbsoluteFill style={{ background: `rgba(${overlayColor},${bgOpacity})` }} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: "0 52px",
        }}
      >
        {/* Logo Azora */}
        <div style={{ opacity: logoOpacity }}>
          <Img
            src={staticFile("brand/azora-logo-full.png")}
            style={{ width: 240, objectFit: "contain" }}
          />
        </div>

        {/* Tagline produs */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            color: "rgba(255,255,255,0.90)",
            fontSize: 40,
            fontWeight: 700,
            fontFamily: "sans-serif",
            textAlign: "center",
            lineHeight: 1.35,
            textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            whiteSpace: "pre-line",
          }}
        >
          {tagline}
        </div>

        {/* Badges row: discount + livrare */}
        {(discountLabel || deliveryLabel) && (
          <div
            style={{
              opacity: badgeOpacity,
              transform: `scale(${badgeScale})`,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            {discountLabel && (
              <div
                style={{
                  background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                  borderRadius: 36,
                  padding: "9px 22px",
                  boxShadow: "0 4px 18px rgba(231,76,60,0.55)",
                }}
              >
                <span style={{ fontSize: 30, fontWeight: 900, fontFamily: "sans-serif", color: "#fff" }}>
                  🏷 {discountLabel}
                </span>
              </div>
            )}
            {deliveryLabel && (
              <div
                style={{
                  background: "rgba(212,175,55,0.18)",
                  border: "1.5px solid rgba(212,175,55,0.6)",
                  borderRadius: 36,
                  padding: "9px 22px",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "sans-serif", color: "#D4AF37" }}>
                  {deliveryLabel}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Preț: original tăiat + preț curent — opțional */}
        {currentPrice && (
          <div
            style={{
              opacity: priceOpacity,
              transform: `scale(${priceScale})`,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            {originalPrice && (
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 600,
                  fontFamily: "sans-serif",
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "line-through",
                  textDecorationThickness: 2,
                }}
              >
                {originalPrice}
              </span>
            )}
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                fontFamily: "sans-serif",
                color: "#FFFFFF",
                textShadow: "0 2px 16px rgba(0,0,0,0.6)",
              }}
            >
              {currentPrice}
            </span>
          </div>
        )}

        {/* Urgency */}
        {urgencyText && (
          <div
            style={{
              opacity: interpolate(frame, [40, 58], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
              fontFamily: "sans-serif",
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            {urgencyText}
          </div>
        )}

        {/* Brand gold button — principal */}
        <div style={{ transform: `scale(${buttonScale * pulse})` }}>
          <div
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #f0c94a 100%)",
              borderRadius: 56,
              padding: "20px 44px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 8px 36px rgba(212,175,55,0.65)",
            }}
          >
            <span style={{ color: "#5a0010", fontSize: 34, fontWeight: 900, fontFamily: "sans-serif" }}>
              {ctaText}
            </span>
            <span style={{ fontSize: 34, transform: `translateX(${arrowX}px)`, color: "#5a0010" }}>
              →
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
