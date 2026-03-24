import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";
import { FeatureCallout } from "../components/FeatureCallout";

// Global: 15–22s | Local frame 0–225
// Transcription:
//   [15.0s] local ~0  → "Are 5 tehnologii într-un singur dispozitiv."
//   [17.6s] local ~78 → feature callouts: EMS, LED, Infraroșu, Masaj, Presiune Negativă
//                        spaced 30 frames (1s) apart over 17.6–21.6s window

const FEATURES = [
  "EMS Microcurrent",
  "LED Lifting",
  "Infraroșu Termic",
  "Masaj Profund",
  "Presiune Negativă",
];

// First feature at local frame 78 (17.6s), then every 30 frames
const FEATURE_START = 78;
const FRAMES_PER_FEATURE = 30;

export const DemoScene: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Left gradient for text legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to right, rgba(74,27,109,0.9) 0%, rgba(74,27,109,0.5) 55%, transparent 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(74,27,109,0.7) 0%, transparent 40%)",
        }}
      />

      {/* Title — appears at 15.0s (local frame 0) */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingTop: 120,
          paddingLeft: 52,
        }}
      >
        <TextOverlay
          text="Are 5 tehnologii"
          fontSize={52}
          color="#FFFFFF"
          fontWeight={900}
          delay={8}
          textAlign="left"
          maxWidth={700}
          shadow={false}
        />
        <TextOverlay
          text="într-un singur dispozitiv."
          fontSize={52}
          color="#D4AF37"
          fontWeight={900}
          delay={22}
          textAlign="left"
          maxWidth={700}
          shadow={false}
        />
      </AbsoluteFill>

      {/* Feature callouts — appear starting at local frame 78 (17.6s) */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 52,
          paddingTop: 60,
        }}
      >
        {FEATURES.map((feature, index) => (
          <FeatureCallout
            key={feature}
            text={feature}
            index={index}
            framesPerFeature={FRAMES_PER_FEATURE}
            startFrame={FEATURE_START}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
