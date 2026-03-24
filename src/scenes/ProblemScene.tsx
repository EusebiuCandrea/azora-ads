import { AbsoluteFill } from "remotion";
import { TextOverlay } from "../components/TextOverlay";

// Global: 8–15s | Local frame 0–225
// Transcription:
//   [8.0s]  local ~0  → "Celulita, piele moale... știu exact cum e."
//   [11.2s] local ~96 → "Am căutat ceva care funcționează acasă, fără salon."

export const ProblemScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(74,27,109,0.9) 0%, rgba(74,27,109,0.35) 50%, transparent 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 150,
        }}
      >
        {/* Line 1: appears immediately (8.0s in video) */}
        <TextOverlay
          text="Celulita, piele moale..."
          fontSize={54}
          color="#FFFFFF"
          fontWeight={800}
          delay={8}
          textAlign="center"
          maxWidth={920}
        />
        <div style={{ height: 10 }} />
        <TextOverlay
          text="știu exact cum e. 💜"
          fontSize={54}
          color="#D4AF37"
          fontWeight={800}
          delay={25}
          textAlign="center"
          maxWidth={920}
        />

        <div style={{ height: 48 }} />

        {/* Line 2: appears at 11.2s → local frame ~96 */}
        <TextOverlay
          text="Am căutat ceva care funcționează acasă,"
          fontSize={44}
          color="rgba(255,255,255,0.9)"
          fontWeight={600}
          delay={96}
          textAlign="center"
          maxWidth={920}
        />
        <div style={{ height: 8 }} />
        <TextOverlay
          text="fără salon. ✨"
          fontSize={44}
          color="#D4AF37"
          fontWeight={700}
          delay={112}
          textAlign="center"
          maxWidth={920}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
