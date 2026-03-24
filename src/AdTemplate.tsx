/**
 * TEMPLATE — copiază și redenumește în <NumePascalCase>Ad.tsx
 * Înlocuiește toate aparițiile de TEMPLATE cu numele campaniei.
 *
 * Checklist după copiere:
 *  1. Redenumește fișierul
 *  2. Înlocuiește DIR cu calea corectă
 *  3. Setează TOTAL_FRAMES
 *  4. Completează timing table
 *  5. Adaugă segmentele video în TemplateVideos
 *  6. Adaugă subtitle blocks în TemplateOverlay
 *  7. Înregistrează în Root.tsx
 */

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

// === Timing (30 fps) =========================================================
//
//  Segment 1 | f0   – f???  | ?s  | clip1.mp4 — descriere
//  Segment 2 | f??? – f???  | ?s  | clip2.mp4 — descriere
//  CTA       | f??? – f???  | 6s  | clip_cta.mp4 trimBefore=?
//
//  Subtitles:
//  f5  – f??  | "Linia 1"  | "Linia 2 gold"
//  f?? – f??  | "Linia 1"  | "Linia 2 gold"
//
const TOTAL_FRAMES = 810; // TODO: setează durata în frames (fps × secunde)
const DIR = "ads/TEMPLATE"; // TODO: înlocuiește cu slug-ul campaniei
const FADE_OUT = 12; // 12 frames fade-out subtitluri

// Gradients — ajustează culorile după produsul campaniei
const BOTTOM_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 40%, transparent 72%)";
const TOP_GRADIENT =
  "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 18%)";

// Zoom styles — ajustează scale/translateY pentru a ascunde watermark-uri
const ZOOM_DEFAULT = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.08)",
};

// --------------------------------------------------------------------------
// SubtitleBlock — NU modifica, folosește height * 0.225 pentru safe zone Meta
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
  // Meta safe zone: bottom 20% acoperit de UI (Shop Now + profil).
  // 22.5% → 4x5: 304px | 1x1: 243px | 9x16: 432px
  const safeBottomPadding = Math.round(height * 0.225);
  const blockOpacity = interpolate(
    frame,
    [totalDuration - FADE_OUT, totalDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const line1Opacity = interpolate(frame, [line1Delay, line1Delay + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const line2Opacity = interpolate(frame, [line2Delay, line2Delay + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: blockOpacity }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: safeBottomPadding,
          padding: `0 60px ${safeBottomPadding}px 60px`,
        }}
      >
        <div
          style={{
            opacity: line1Opacity,
            color: "#FFFFFF",
            fontSize: line1Size,
            fontWeight: 900,
            fontFamily: "sans-serif",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
          }}
        >
          {line1}
        </div>
        <div style={{ height: 10 }} />
        <div
          style={{
            opacity: line2Opacity,
            color: "#D4AF37",
            fontSize: line2Size,
            fontWeight: 900,
            fontFamily: "sans-serif",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)",
          }}
        >
          {line2}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------
// CTA Overlay — NU modifica structura, doar textele
// --------------------------------------------------------------------------
const CTAOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 0.85], { extrapolateRight: "clamp" });
  const logoOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textProgress = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 20 });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [30, 0]);
  const buttonScale = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 160 }, from: 0, to: 1 });
  const arrowX = interpolate(Math.sin((frame / fps) * Math.PI * 3), [-1, 1], [0, 10]);
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 1.5), [-1, 1], [0.97, 1.03]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(74,27,109,${bgOpacity})` }} />
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
        <div style={{ opacity: logoOpacity }}>
          <Img src={staticFile("brand/azora-logo-full.png")} style={{ width: 240, objectFit: "contain" }} />
        </div>

        {/* TODO: înlocuiește cu tagline-ul produsului */}
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
          Tagline produs aici
        </div>

        <div
          style={{
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            color: "#D4AF37",
            fontSize: 34,
            fontWeight: 700,
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          {/* TODO: beneficiu secundar sau preț/livrare */}
          Livrare rapidă în toată România
        </div>

        <div style={{ transform: `scale(${buttonScale * pulse})`, marginTop: 8 }}>
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
            <span style={{ color: "#4A1B6D", fontSize: 34, fontWeight: 900, fontFamily: "sans-serif" }}>
              Comandă acum pe Azora.ro
            </span>
            <span style={{ fontSize: 34, transform: `translateX(${arrowX}px)`, color: "#4A1B6D" }}>→</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------
// Dynamic Watermark — NU modifica
// --------------------------------------------------------------------------
const WATERMARK_POSITIONS = [
  { top: "8%",  left: "6%"  },
  { top: "8%",  right: "6%" },
  { top: "38%", left: "6%"  },
  { top: "38%", right: "6%" },
  { top: "68%", left: "6%"  },
  { top: "68%", right: "6%" },
];
const SWITCH_EVERY_FRAMES = 120;

const DynamicWatermark: React.FC = () => {
  const frame = useCurrentFrame();
  const posIndex = Math.floor(frame / SWITCH_EVERY_FRAMES) % WATERMARK_POSITIONS.length;
  const nextIndex = (posIndex + 1) % WATERMARK_POSITIONS.length;
  const frameInSlot = frame % SWITCH_EVERY_FRAMES;
  const fadeFrames = 15;
  const fadeOut = interpolate(frameInSlot, [SWITCH_EVERY_FRAMES - fadeFrames, SWITCH_EVERY_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeIn = interpolate(frameInSlot, [SWITCH_EVERY_FRAMES - fadeFrames, SWITCH_EVERY_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div style={{ position: "absolute", pointerEvents: "none", ...WATERMARK_POSITIONS[posIndex], opacity: 0.38 * fadeOut }}>
        <Img src={staticFile("brand/logo-copywrite.png")} style={{ width: 130, objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", pointerEvents: "none", ...WATERMARK_POSITIONS[nextIndex], opacity: 0.38 * fadeIn }}>
        <Img src={staticFile("brand/logo-copywrite.png")} style={{ width: 130, objectFit: "contain" }} />
      </div>
    </>
  );
};

// --------------------------------------------------------------------------
// Video segments — adaugă/șterge segmente după clipurile disponibile
// --------------------------------------------------------------------------
const CTA_START = 630; // TODO: ajustează după timing

const TemplateVideos: React.FC = () => (
  <>
    {/* TODO: adaugă segmentele video */}
    {/* Segment 1 — f0–f??? */}
    <Sequence from={0} durationInFrames={150}>
      <Video
        src={staticFile(`${DIR}/clip1.mp4`)}
        volume={0}
        style={ZOOM_DEFAULT}
      />
    </Sequence>

    {/* Segment 2 — f150–f??? */}
    {/* <Sequence from={150} durationInFrames={180}>
      <Video src={staticFile(`${DIR}/clip2.mp4`)} volume={0} style={ZOOM_DEFAULT} />
    </Sequence> */}
  </>
);

// --------------------------------------------------------------------------
// Overlay — gradients + subtitluri + watermark + CTA
// --------------------------------------------------------------------------
const TemplateOverlay: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: TOP_GRADIENT, pointerEvents: "none" }} />
    <AbsoluteFill style={{ background: BOTTOM_GRADIENT, pointerEvents: "none" }} />

    {/* TODO: adaugă subtitle blocks — un <Sequence> per bloc */}

    {/* Exemplu subtitle block: */}
    {/* <Sequence from={5} durationInFrames={85}>
      <SubtitleBlock
        line1="Linia 1 — alb, întrebare/hook"
        line2="Linia 2 — auriu, beneficiu."
        totalDuration={85}
        line1Delay={3}
        line2Delay={20}
        line1Size={48}
        line2Size={46}
      />
    </Sequence> */}

    {/* Watermark — activ pana la CTA */}
    <Sequence from={0} durationInFrames={CTA_START}>
      <DynamicWatermark />
    </Sequence>

    {/* CTA — ultimele ~6s */}
    <Sequence from={CTA_START} durationInFrames={TOTAL_FRAMES - CTA_START}>
      <CTAOverlay />
    </Sequence>
  </>
);

// ==========================================================================
// 9:16 — format nativ (sursă)
// ==========================================================================
export const TemplateAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
    <TemplateVideos />
    <TemplateOverlay />
  </AbsoluteFill>
);

// ==========================================================================
// 4:5 — objectFit:cover zoom (crop ~15% sus/jos, acceptabil)
// ==========================================================================
export const TemplateAd_4x5 = TemplateAd;

// ==========================================================================
// 1:1 — blurred backdrop + portrait centrat (crop ar fi 22% sus/jos, prea mult)
// ==========================================================================
export const TemplateAd_1x1: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred background — duplică segmentele din TemplateVideos cu filter */}
      {/* TODO: copiază segmentele din TemplateVideos și adaugă:
          style={{ ...ZOOM_DEFAULT, filter: "blur(22px) brightness(0.35)" }} */}

      {/* Centered sharp portrait */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: portraitWidth, height: "100%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <TemplateVideos />
          <AbsoluteFill><TemplateOverlay /></AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// 16:9 — blurred backdrop + portrait centrat
// ==========================================================================
export const TemplateAd_16x9: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred background — duplică segmentele din TemplateVideos cu filter */}
      {/* TODO: copiază segmentele din TemplateVideos și adaugă:
          style={{ ...ZOOM_DEFAULT, filter: "blur(22px) brightness(0.35)" }} */}

      {/* Centered sharp portrait */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: portraitWidth, height: "100%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <TemplateVideos />
          <AbsoluteFill><TemplateOverlay /></AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// Root.tsx — adaugă aceste 4 Composition entries:
// ==========================================================================
//
// import { TemplateAd, TemplateAd_4x5, TemplateAd_1x1, TemplateAd_16x9 } from "./TemplateAd";
//
// <Composition id="TemplateAd-9x16"  component={TemplateAd}      durationInFrames={TOTAL_FRAMES} fps={30} width={1080}  height={1920} />
// <Composition id="TemplateAd-4x5"   component={TemplateAd_4x5}  durationInFrames={TOTAL_FRAMES} fps={30} width={1080}  height={1350} />
// <Composition id="TemplateAd-1x1"   component={TemplateAd_1x1}  durationInFrames={TOTAL_FRAMES} fps={30} width={1080}  height={1080} />
// <Composition id="TemplateAd-16x9"  component={TemplateAd_16x9} durationInFrames={TOTAL_FRAMES} fps={30} width={1920}  height={1080} />
