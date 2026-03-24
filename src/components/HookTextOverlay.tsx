import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// HookTextOverlay — pattern interrupt în primele 1.5s (f0–f48).
// Apare centrat pe ecran, înainte ca subtitlurile să preia.
// 70% din impactul unui video e determinat de primele 3s (Meta IQ).
//
// Folosire în overlay:
//   <Sequence from={0} durationInFrames={48}>
//     <HookTextOverlay line1="Nu i-ai mai luat" line2="NICIODATĂ" line3="un cadou ca ăsta." />
//   </Sequence>
//
// line1 — fraza introductivă (gold, 54px)
// line2 — cuvântul-șoc / hook principal (white, 68px, bold)
// line3 — completare (white 92%, 46px) — opțional

interface HookTextOverlayProps {
  line1: string;
  line2: string;
  line3?: string;
  line1Color?: string;
}

export const HookTextOverlay: React.FC<HookTextOverlayProps> = ({
  line1,
  line2,
  line3,
  line1Color = "#D4AF37",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 12 });
  const fadeOut = interpolate(frame, [34, 48], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, fadeOut);
  const translateY = interpolate(enter, [0, 1], [22, 0]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "12%",
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "sans-serif",
          fontWeight: 900,
          lineHeight: 1.2,
        }}
      >
        <div
          style={{
            fontSize: 54,
            color: line1Color,
            textShadow: "0 0 28px rgba(212,175,55,0.7), 0 2px 12px rgba(0,0,0,0.95)",
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontSize: 68,
            color: "#FFFFFF",
            letterSpacing: -1,
            textShadow: "0 2px 16px rgba(0,0,0,0.95)",
          }}
        >
          {line2}
        </div>
        {line3 && (
          <div
            style={{
              fontSize: 46,
              color: "rgba(255,255,255,0.92)",
              marginTop: 6,
              textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            }}
          >
            {line3}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
