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

// === Timing (30 fps, 900 frames = 30s) ====================================
//
//  Segment 1 | f0   – f150  | 5s  | gift-handover.mp4 — hook restaurant
//  Segment 2 | f150 – f360  | 7s  | bear-closeup-4k.mp4 @0.25x — slow-mo 4K
//  Segment 3 | f360 – f540  | 6s  | bear-outdoor.mp4 — outdoor bear
//  Segment 4 | f540 – f720  | 6s  | bear-closeup-4k.mp4 @0.25x trimBefore=1.75 — slow-mo cont.
//  Segment 5 | f720 – f900  | 6s  | gift-handover.mp4 trimBefore=4 — CTA restaurant
//
// Zoom pe fiecare clip ascunde textele originale (TikTok/watermarks)
// bear-closeup-4k.mp4 este 120fps → playbackRate=0.25 = slow-motion 4x

const TOTAL_FRAMES = 810; // 27s
const DIR = "ads/bear-gift";
const FADE_OUT = 12;

// Gradient romantic wine/crimson — matchy cu ursuletul rosu
const BOTTOM_GRADIENT =
  "linear-gradient(to top, rgba(90,5,20,0.93) 0%, rgba(90,5,20,0.28) 40%, transparent 72%)";

// Gradient subtil la top
const TOP_GRADIENT =
  "linear-gradient(to bottom, rgba(10,0,5,0.70) 0%, transparent 18%)";

// Zoom styles — ascund watermark-urile originale
const ZOOM_GIFT = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  // scale(1.5) + translateY(-8%): crop top ~24%, ascunde textul original
  transform: "scale(1.5) translateY(-8%)",
};
const ZOOM_CLOSEUP = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.25)",
};
// YouTube clip (720×1280) — text original in jos: translateY pozitiv = crop bottom
const ZOOM_YOUTUBE = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.5) translateY(15%)",
};
// Engage clip (1920×1080 landscape) — objectFit:cover face crop portrait natural
const ZOOM_ENGAGE = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.08)",
};

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
  const { height } = useVideoConfig();
  // Meta safe zone: bottom 20% is covered by UI (Shop Now + profile row).
  // 22.5% gives: 4x5→304px, 1x1→243px, 9x16→432px — all above Meta unsafe zone.
  const safeBottomPadding = Math.round(height * 0.225);
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
          paddingBottom: safeBottomPadding,
        }}
      >
        <TextOverlay
          text={line1}
          fontSize={line1Size}
          color="#FFFFFF"
          fontWeight={900}
          delay={line1Delay}
          textAlign="center"
          maxWidth={960}
        />
        <div style={{ height: 10 }} />
        <TextOverlay
          text={line2}
          fontSize={line2Size}
          color="#D4AF37"
          fontWeight={900}
          delay={line2Delay}
          textAlign="center"
          maxWidth={960}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------
// CTA overlay — logo Azora + titlu + buton auriu
// --------------------------------------------------------------------------
const CTAOverlay: React.FC = () => {
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
  const arrowX = interpolate(
    Math.sin((frame / fps) * Math.PI * 3),
    [-1, 1],
    [0, 10]
  );
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.5),
    [-1, 1],
    [0.97, 1.03]
  );

  return (
    <AbsoluteFill>
      {/* Dark brand overlay */}
      <AbsoluteFill style={{ background: `rgba(70,3,15,${bgOpacity})` }} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "0 52px",
        }}
      >
        {/* Logo */}
        <div style={{ opacity: logoOpacity }}>
          <Img
            src={staticFile("brand/azora-logo-full.png")}
            style={{ width: 240, objectFit: "contain" }}
          />
        </div>

        {/* Tagline */}
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
          }}
        >
          Cadoul perfect pentru ea —{"\n"}trandafir etern + colier
        </div>

        {/* Price hint */}
        <div
          style={{
            opacity: interpolate(frame, [40, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            color: "#D4AF37",
            fontSize: 34,
            fontWeight: 700,
            fontFamily: "sans-serif",
            textAlign: "center",
            textShadow: "0 0 20px rgba(212,175,55,0.4)",
          }}
        >
          Livrare rapida in toata Romania
        </div>

        {/* CTA button */}
        <div
          style={{
            transform: `scale(${buttonScale * pulse})`,
            marginTop: 8,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #f0c94a 100%)",
              borderRadius: 56,
              padding: "22px 44px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 8px 36px rgba(212,175,55,0.65)",
            }}
          >
            <span
              style={{
                color: "#5a0010",
                fontSize: 34,
                fontWeight: 900,
                fontFamily: "sans-serif",
              }}
            >
              Comanda acum pe Azora.ro
            </span>
            <span
              style={{
                fontSize: 34,
                transform: `translateX(${arrowX}px)`,
                color: "#5a0010",
              }}
            >
              →
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------
// Dynamic watermark — logo Azora se muta in pozitii diferite ca la TikTok
// --------------------------------------------------------------------------
const WATERMARK_POSITIONS = [
  { top: "8%",  left: "6%"  },  // top-left
  { top: "8%",  right: "6%" },  // top-right
  { top: "38%", left: "6%"  },  // middle-left
  { top: "38%", right: "6%" },  // middle-right
  { top: "68%", left: "6%"  },  // lower-left
  { top: "68%", right: "6%" },  // lower-right
];
const SWITCH_EVERY_FRAMES = 120; // 4s

const DynamicWatermark: React.FC = () => {
  const frame = useCurrentFrame();
  const posIndex = Math.floor(frame / SWITCH_EVERY_FRAMES) % WATERMARK_POSITIONS.length;
  const nextIndex = (posIndex + 1) % WATERMARK_POSITIONS.length;
  const frameInSlot = frame % SWITCH_EVERY_FRAMES;
  const fadeFrames = 15;

  // Cross-fade între pozitia curenta si urmatoarea
  const fadeOut = interpolate(frameInSlot, [SWITCH_EVERY_FRAMES - fadeFrames, SWITCH_EVERY_FRAMES], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frameInSlot, [SWITCH_EVERY_FRAMES - fadeFrames, SWITCH_EVERY_FRAMES], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const wStyle: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };

  return (
    <>
      <div style={{ ...wStyle, ...WATERMARK_POSITIONS[posIndex], opacity: 0.38 * fadeOut }}>
        <Img src={staticFile("brand/logo-copywrite.png")} style={{ width: 130, objectFit: "contain" }} />
      </div>
      <div style={{ ...wStyle, ...WATERMARK_POSITIONS[nextIndex], opacity: 0.38 * fadeIn }}>
        <Img src={staticFile("brand/logo-copywrite.png")} style={{ width: 130, objectFit: "contain" }} />
      </div>
    </>
  );
};

// --------------------------------------------------------------------------
// Shared overlay — gradients + subtitles + CTA
// --------------------------------------------------------------------------
const BearGiftAdOverlay: React.FC = () => (
  <>
    {/* Gradient la top */}
    <AbsoluteFill
      style={{ background: TOP_GRADIENT, pointerEvents: "none" }}
    />

    {/* Gradient la bottom */}
    <AbsoluteFill
      style={{ background: BOTTOM_GRADIENT, pointerEvents: "none" }}
    />

    {/* ── SUBTITLE BLOCKS ──────────────────────────────────────── */}

    {/* 0–3s | Hook */}
    <Sequence from={5} durationInFrames={83}>
      <SubtitleBlock
        line1="Cauti cadoul perfect pentru ea?"
        line2="Unul pe care nu-l uita niciodata."
        totalDuration={83}
        line1Delay={3}
        line2Delay={20}
        line1Size={48}
        line2Size={46}
      />
    </Sequence>

    {/* 3–6s | Situatii 1 */}
    <Sequence from={93} durationInFrames={87}>
      <SubtitleBlock
        line1="Cadoul perfect de logodna,"
        line2="aniversare sau nunta."
        totalDuration={87}
        line1Delay={3}
        line2Delay={20}
        line1Size={48}
        line2Size={48}
      />
    </Sequence>

    {/* 6–9s | Situatii 2 */}
    <Sequence from={183} durationInFrames={84}>
      <SubtitleBlock
        line1="Exista un cadou 2-in-1"
        line2="care spune totul fara cuvinte."
        totalDuration={84}
        line1Size={52}
        line2Size={48}
      />
    </Sequence>

    {/* 9–13s | Hero produs — trandafir (se termina cand incepe cu-lantisor) */}
    <Sequence from={273} durationInFrames={117}>
      <SubtitleBlock
        line1="Ursulet cu trandafir etern in piept —"
        line2="nu se ofileste niciodata."
        totalDuration={117}
        line1Delay={5}
        line2Delay={25}
        line1Size={46}
        line2Size={50}
      />
    </Sequence>

    {/* 13–18s | Hero produs — colier (porneste odata cu segmentul cu-lantisor) */}
    <Sequence from={393} durationInFrames={140}>
      <SubtitleBlock
        line1="Colier inimi impletite"
        line2="inclus in cutie."
        totalDuration={82}
        line1Size={54}
        line2Size={50}
      />
    </Sequence>

    {/* 17.8–20.8s | Bridge — inchide inelul narativ inainte de CTA */}
    <Sequence from={535} durationInFrames={90}>
      <SubtitleBlock
        line1="Un cadou pe care nu-l uiți"
        line2="niciodată."
        totalDuration={90}
        line1Delay={3}
        line2Delay={18}
        line1Size={50}
        line2Size={54}
      />
    </Sequence>

    {/* Watermark dinamic — activ pana la CTA */}
    <Sequence from={0} durationInFrames={630}>
      <DynamicWatermark />
    </Sequence>

    {/* 21–27s | CTA */}
    <Sequence from={630} durationInFrames={TOTAL_FRAMES - 630}>
      <CTAOverlay />
    </Sequence>
  </>
);

// ==========================================================================
// Video segments — refolosit in fiecare format
// ==========================================================================
//
//  Seg 1 | f0   – f150  | 5s  | engage.mp4           (cerere in casatorie hook)
//  Seg 2 | f150 – f300  | 5s  | gift-handover.mp4    (cadou restaurant)
//  Seg 3 | f300 – f510  | 7s  | bear-closeup-4k @0.25x (slow-mo 4K)
//  Seg 4 | f510 – f660  | 5s  | bear-youtube.mp4 t=2 (bear + colier reveal)
//  Seg 5 | f660 – f720  | 2s  | engage.mp4 t=50      (cuplu fericit, inel pus)
//  Seg 6 | f720 – f900  | 6s  | bear-youtube.mp4 t=7 (beauty shot / CTA bg)
//
const BearGiftVideos: React.FC = () => (
  <>
    {/* Segment 1 — Cerere in casatorie hook (0–3s) */}
    <Sequence from={0} durationInFrames={90}>
      <Video
        src={staticFile(`${DIR}/engage.mp4`)}
        volume={0}
        style={ZOOM_ENGAGE}
      />
    </Sequence>

    {/* Segment 2 — Cadou restaurant (3–8s) */}
    <Sequence from={90} durationInFrames={150}>
      <Video
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        volume={0}
        style={ZOOM_GIFT}
      />
    </Sequence>

    {/* Segment 3 — 4K slow-mo bear (8–13s) */}
    <Sequence from={240} durationInFrames={150}>
      <Video
        src={staticFile(`${DIR}/bear-closeup-4k.mp4`)}
        playbackRate={0.25}
        volume={0}
        style={ZOOM_CLOSEUP}
      />
    </Sequence>

    {/* Segment 4 — cu-lantisor (13–18s, clip decupat de user, 30fps normal) */}
    <Sequence from={390} durationInFrames={150}>
      <Video
        src={staticFile(`${DIR}/cu-lantisor.mp4`)}
        volume={0}
        style={ZOOM_CLOSEUP}
      />
    </Sequence>

    {/* Segment 5 — CTA background (18–27s, de la 7s in clip) */}
    <Sequence from={540} durationInFrames={270}>
      <Video
        src={staticFile(`${DIR}/bear-youtube.mp4`)}
        trimBefore={7}
        volume={0}
        style={ZOOM_YOUTUBE}
      />
    </Sequence>
  </>
);

// ==========================================================================
// 9x16 — portrait
// ==========================================================================
export const BearGiftAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1a000a" }}>
    <BearGiftVideos />
    <BearGiftAdOverlay />
  </AbsoluteFill>
);

// ==========================================================================
// 4x5 — Instagram/Facebook feed portrait (1080×1350)
// Remotion cropează centrat din 9:16 → 4:5, ursuletul ramane in cadru
// ==========================================================================
export const BearGiftAd_4x5 = BearGiftAd;

// ==========================================================================
// 1x1 — square: blurred portrait bg + centered sharp portrait video
// objectFit:cover would cut ~22% top/bottom — blurred backdrop preserves subject
// ==========================================================================
export const BearGiftAd_1x1: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a000a" }}>
      {/* Blurred background fill */}
      <Sequence from={0} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/engage.mp4`)} volume={0}
          style={{ ...ZOOM_ENGAGE, filter: "blur(22px) brightness(0.35)", transform: "scale(1.2)" }} />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={240} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/bear-closeup-4k.mp4`)} playbackRate={0.25} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={390} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/cu-lantisor.mp4`)} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={540} durationInFrames={270}>
        <Video src={staticFile(`${DIR}/bear-youtube.mp4`)} trimBefore={7} volume={0}
          style={{ ...ZOOM_YOUTUBE, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(15%)" }} />
      </Sequence>

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
          <BearGiftVideos />
          <AbsoluteFill>
            <BearGiftAdOverlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// 16x9 — landscape: blurred portrait bg + centered sharp portrait video
// ==========================================================================
export const BearGiftAd_16x9: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a000a" }}>
      {/* Blurred background fill — mirrors BearGiftVideos */}
      <Sequence from={0} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/engage.mp4`)} volume={0}
          style={{ ...ZOOM_ENGAGE, filter: "blur(22px) brightness(0.35)", transform: "scale(1.2)" }} />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={240} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/bear-closeup-4k.mp4`)} playbackRate={0.25} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={390} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/cu-lantisor.mp4`)} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={540} durationInFrames={270}>
        <Video src={staticFile(`${DIR}/bear-youtube.mp4`)} trimBefore={7} volume={0}
          style={{ ...ZOOM_YOUTUBE, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(15%)" }} />
      </Sequence>

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
          <BearGiftVideos />
          <AbsoluteFill>
            <BearGiftAdOverlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
