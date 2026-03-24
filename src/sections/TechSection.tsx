import { AbsoluteFill, interpolate, spring, Sequence, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";

const TECHNOLOGIES = [
  {
    icon: "⚡",
    name: "EMS Microcurrent",
    desc: "Stimulare musculară profundă",
    image: "ads/ep-2011/IMG_1665.jpg",
  },
  {
    icon: "🌊",
    name: "Radiofrecvență RF",
    desc: "Producție de colagen & elastină",
    image: "ads/ep-2011/IMG_1669.jpg",
  },
  {
    icon: "🔥",
    name: "Infraroșu Termic",
    desc: "Arderea grăsimii localizate",
    image: "ads/ep-2011/IMG_1662.jpg",
  },
  {
    icon: "💡",
    name: "Terapie LED",
    desc: "Anti-aging & tratament acnee",
    image: "ads/ep-2011/IMG_1671.jpg",
  },
  {
    icon: "✨",
    name: "Vibrații HF",
    desc: "Drenaj limfatic & anticelulitic",
    image: "ads/ep-2011/IMG_1673.jpg",
  },
];

const FRAMES_PER_TECH = 75;

const TechCard: React.FC<{ tech: typeof TECHNOLOGIES[0]; index: number }> = ({ tech, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideX = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    from: 300,
    to: 0,
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const exitOpacity = interpolate(
    frame,
    [FRAMES_PER_TECH - 15, FRAMES_PER_TECH - 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isLast = index === TECHNOLOGIES.length - 1;
  const finalOpacity = isLast ? opacity : opacity * exitOpacity;

  const imageScale = interpolate(frame, [0, 20], [0.9, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: finalOpacity,
        transform: `translateX(${slideX}px)`,
        padding: "0 48px",
      }}
    >
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        {TECHNOLOGIES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 32 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === index ? "#a855f7" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* Product image */}
      <div
        style={{
          transform: `scale(${imageScale})`,
          marginBottom: 36,
          borderRadius: 24,
          overflow: "hidden",
          width: 300,
          height: 300,
          boxShadow: "0 0 60px rgba(168,85,247,0.4)",
          border: "2px solid rgba(168,85,247,0.5)",
        }}
      >
        <Img
          src={staticFile(tech.image)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Counter */}
      <div
        style={{
          color: "#a855f7",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {String(index + 1).padStart(2, "0")} / 05
      </div>

      {/* Icon + Name */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 48,
          fontWeight: 800,
          fontFamily: "sans-serif",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 14,
        }}
      >
        {tech.icon} {tech.name}
      </div>

      {/* Description */}
      <div
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 28,
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        {tech.desc}
      </div>

      {/* Decoration line */}
      <div
        style={{
          marginTop: 32,
          width: 80,
          height: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #a855f7, #f59e0b)",
        }}
      />
    </AbsoluteFill>
  );
};

export const TechSection: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0533 0%, #0d1b4b 100%)",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {TECHNOLOGIES.map((tech, index) => (
        <Sequence
          key={index}
          from={index * FRAMES_PER_TECH}
          durationInFrames={FRAMES_PER_TECH}
          premountFor={fps}
        >
          <TechCard tech={tech} index={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
