import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
} from "remotion";
import { Video } from "@remotion/media";
import { TextOverlay } from "./components/TextOverlay";

// === Timing (30 fps, Whisper-synced) =====================================
//  f0   – f192  |  0.00–6.48 s  | Intro
//  f194 – f388  |  6.48–12.96 s | Are cinci moduri
//  f388 – f621  | 12.96–20.72 s | Lumina albastră
//  f621 – f844  | 20.72–28.16 s | Lumina roșie
//  f856 – f972  | 28.56–32.40 s | În 3-4 săptămâni
//  f920 – f1055 | 30.67–35.17 s | CTA overlay

const TOTAL_FRAMES = 1055;
const DIR = "ads/ep-2011-ad-2";
const BOTTOM_GRADIENT =
  "linear-gradient(to top, rgba(74,27,109,0.90) 0%, rgba(74,27,109,0.30) 38%, transparent 70%)";
const FADE_OUT = 12;

// --------------------------------------------------------------------------
// Subtitle block
// --------------------------------------------------------------------------
interface SubtitleBlockProps {
  line1: string;
  line2: string;
  totalDuration: number;
  line1Delay?: number;
  line2Delay?: number;
  line1Size?: number;
  line2Size?: number;
}

const SubtitleBlock: React.FC<SubtitleBlockProps> = ({
  line1,
  line2,
  totalDuration,
  line1Delay = 5,
  line2Delay = 22,
  line1Size = 50,
  line2Size = 50,
}) => {
  const frame = useCurrentFrame();
  const blockOpacity = interpolate(
    frame,
    [totalDuration - FADE_OUT, totalDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill style={{ opacity: blockOpacity }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 140,
        }}
      >
        <TextOverlay text={line1} fontSize={line1Size} color="#FFFFFF"
          fontWeight={900} delay={line1Delay} textAlign="center" maxWidth={960} />
        <div style={{ height: 10 }} />
        <TextOverlay text={line2} fontSize={line2Size} color="#D4AF37"
          fontWeight={900} delay={line2Delay} textAlign="center" maxWidth={960} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------
// CTA overlay
// --------------------------------------------------------------------------
const CTAOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 0.82], { extrapolateRight: "clamp" });
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textProgress = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 20 });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [30, 0]);
  const buttonScale = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 160 }, from: 0, to: 1 });
  const arrowX = interpolate(Math.sin((frame / fps) * Math.PI * 3), [-1, 1], [0, 10]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(74,27,109,${bgOpacity})` }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 52px" }}>
        <div style={{ opacity: logoOpacity }}>
          <Img src={staticFile("brand/azora-logo-full.png")} style={{ width: 260, objectFit: "contain" }} />
        </div>
        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)`, color: "rgba(255,255,255,0.88)", fontSize: 44, fontWeight: 600, fontFamily: "sans-serif", textAlign: "center" }}>
          Îl găsești pe
        </div>
        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)`, color: "#D4AF37", fontSize: 72, fontWeight: 900, fontFamily: "sans-serif", textAlign: "center", textShadow: "0 0 30px rgba(212,175,55,0.5)", marginTop: -12 }}>
          Azora.ro
        </div>
        <div style={{ transform: `scale(${buttonScale})`, marginTop: 8 }}>
          <div style={{ background: "linear-gradient(135deg, #D4AF37 0%, #f0c94a 100%)", borderRadius: 56, padding: "22px 48px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 36px rgba(212,175,55,0.6)" }}>
            <span style={{ color: "#4A1B6D", fontSize: 34, fontWeight: 900, fontFamily: "sans-serif" }}>
              Comandă acum pe Azora.ro!
            </span>
            <span style={{ fontSize: 34, transform: `translateX(${arrowX}px)` }}>→</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------
// Shared overlay — gradient + subtitles + CTA (format-agnostic)
// --------------------------------------------------------------------------
const FacebookAd2Overlay: React.FC = () => (
  <>
    {/* Persistent brand gradient */}
    <AbsoluteFill style={{ background: BOTTOM_GRADIENT, pointerEvents: "none" }} />

    {/* 0.00–6.48 s */}
    <Sequence from={0} durationInFrames={192}>
      <SubtitleBlock
        line1="Bună! Azi îți arăt aparatul pe care îl recomand clientelor mele,"
        line2="rezultate vizibile în doar patru săptămâni!"
        totalDuration={192} line1Delay={3} line2Delay={90} line1Size={44} line2Size={50}
      />
    </Sequence>

    {/* 6.48–12.96 s */}
    <Sequence from={194} durationInFrames={194}>
      <SubtitleBlock
        line1="Are cinci moduri diferite de utilizare,"
        line2="perfect pentru îngrijire completă acasă, între vizitele la salon."
        totalDuration={194} line1Size={50} line2Size={44}
      />
    </Sequence>

    {/* 12.96–20.72 s */}
    <Sequence from={388} durationInFrames={233}>
      <SubtitleBlock
        line1="Lumina albastră o folosesc pentru pielea lăsată,"
        line2="stimulează și îngrijește pielea în profunzime, rezultate vizibile rapid."
        totalDuration={233} line1Size={46} line2Size={40}
      />
    </Sequence>

    {/* 20.72–28.16 s */}
    <Sequence from={621} durationInFrames={223}>
      <SubtitleBlock
        line1="Lumina roșie cu ventuză creează un efect de masaj profesional,"
        line2="iar celulita și pielea lăsată nu au nicio șansă!"
        totalDuration={223} line1Size={42} line2Size={48}
      />
    </Sequence>

    {/* 28.56–32.40 s */}
    <Sequence from={856} durationInFrames={116}>
      <SubtitleBlock
        line1="În 3-4 săptămâni"
        line2="vezi pielea mai fermă și mai netedă."
        totalDuration={116} line1Size={56} line2Size={52} line1Delay={3} line2Delay={18}
      />
    </Sequence>

    {/* CTA 30.67–35.17 s */}
    <Sequence from={920} durationInFrames={TOTAL_FRAMES - 920}>
      <CTAOverlay />
    </Sequence>
  </>
);

// ==========================================================================
// 9x16 — portrait (original)
// ==========================================================================
export const FacebookAd2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Video
      src={staticFile(`${DIR}/final.mp4`)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <FacebookAd2Overlay />
  </AbsoluteFill>
);

// ==========================================================================
// 1x1 — square (same component, Remotion crops portrait video to square)
// ==========================================================================
export const FacebookAd2_1x1 = FacebookAd2;

// ==========================================================================
// 16x9 — landscape: blurred portrait bg + centered sharp portrait video
// ==========================================================================
export const FacebookAd2_16x9: React.FC = () => {
  const { height } = useVideoConfig();
  // Portrait video at 9:16 ratio fits inside landscape frame by height
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Blurred background fill */}
      <Video
        src={staticFile(`${DIR}/final.mp4`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(24px) brightness(0.35)",
          transform: "scale(1.1)",
        }}
      />

      {/* Centered sharp portrait video */}
      <AbsoluteFill
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            width: portraitWidth,
            height: "100%",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Video
            src={staticFile(`${DIR}/final.mp4`)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Overlay scoped to the portrait column */}
          <AbsoluteFill>
            <FacebookAd2Overlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
