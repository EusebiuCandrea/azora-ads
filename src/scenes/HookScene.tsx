import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";

// Global: 0–8s | Local frame 0–255
// Transcription [0.9s]: "Ăsta e cel mai tare gadget de beauty pe care l-am încercat vreodată!"
// Text appears at local frame 27 (= 0.9s × 30fps)

export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Bottom gradient for legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(74,27,109,0.88) 0%, rgba(74,27,109,0.2) 45%, transparent 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 160,
        }}
      >
        <TextOverlay
          text="Ăsta e cel mai tare gadget de beauty"
          fontSize={56}
          color="#FFFFFF"
          fontWeight={900}
          delay={27}
          textAlign="center"
          maxWidth={920}
        />
        <div style={{ height: 12 }} />
        <TextOverlay
          text="pe care l-am încercat vreodată! 🔥"
          fontSize={56}
          color="#D4AF37"
          fontWeight={900}
          delay={42}
          textAlign="center"
          maxWidth={920}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
