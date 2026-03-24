import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// MidCTAHint — soft CTA la ~15s în video.
// +22% CTR față de CTA doar la final (Facebook IQ, 2021).
//
// Folosire în overlay (la ~f450 pentru un video de 29s):
//   <Sequence from={450} durationInFrames={60}>
//     <MidCTAHint />
//   </Sequence>
//
// Pentru alte durate: plasează la ~50–55% din totalul video-ului.
// text — customizabil per campanie

interface MidCTAHintProps {
  text?: string;
}

export const MidCTAHint: React.FC<MidCTAHintProps> = ({
  text = "azora.ro • Comandă acum →",
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const opacity = interpolate(frame, [0, 8, 50, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: Math.round(height * 0.225) + 12,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "rgba(212,175,55,0.18)",
          border: "1.5px solid rgba(212,175,55,0.55)",
          borderRadius: 28,
          padding: "7px 22px",
          color: "#D4AF37",
          fontSize: 24,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: 0.5,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
