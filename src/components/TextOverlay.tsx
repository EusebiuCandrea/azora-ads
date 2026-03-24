import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TextOverlayProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  delay?: number; // frames
  textAlign?: React.CSSProperties["textAlign"];
  maxWidth?: number;
  shadow?: boolean;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  fontSize = 60,
  color = "#FFFFFF",
  fontWeight = 800,
  delay = 0,
  textAlign = "center",
  maxWidth = 900,
  shadow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 }, // smooth, no bounce
    durationInFrames: 20,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        color,
        fontSize,
        fontWeight,
        fontFamily: "sans-serif",
        textAlign,
        lineHeight: 1.2,
        maxWidth,
        padding: "0 40px",
        textShadow: shadow
          ? "0 2px 16px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.4)"
          : undefined,
      }}
    >
      {text}
    </div>
  );
};
