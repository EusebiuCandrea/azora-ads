import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FeatureCalloutProps {
  text: string;
  index: number;
  framesPerFeature?: number;
  startFrame?: number; // global offset within the scene before first feature
}

export const FeatureCallout: React.FC<FeatureCalloutProps> = ({
  text,
  index,
  framesPerFeature = 30,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = startFrame + index * framesPerFeature;

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 200 },
    durationInFrames: 18,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-60, 0]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  if (frame < delay) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          backgroundColor: "#D4AF37",
          borderRadius: 50,
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 900,
          color: "#4A1B6D",
          flexShrink: 0,
          boxShadow: "0 4px 16px rgba(212,175,55,0.5)",
        }}
      >
        ✓
      </div>
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 38,
          fontWeight: 700,
          fontFamily: "sans-serif",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
