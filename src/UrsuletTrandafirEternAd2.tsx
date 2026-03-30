import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Video } from "@remotion/media";
import { ZoomVideo } from "./components/ZoomVideo";
import { DepthVignette } from "./components/DepthVignette";
import { MidCTAHint } from "./components/MidCTAHint";
import { DynamicWatermark } from "./components/DynamicWatermark";
import { CTAOverlay } from "./components/CTAOverlay";

// === Timing (30 fps, 450 frames = 15s) =====================================
//
//  f0   – f60  | 2.0s | bear-closeup-4k.mp4  120fps @0.25x — PRODUCT FIRST
//  f60  – f135 | 2.5s | gift-handover.mp4    restaurant context
//  f135 – f210 | 2.5s | montova-gift.mp4     product on table
//  f210 – f300 | 3.0s | cu-lantisor.mp4      necklace reveal
//  f300 – f450 | 5.0s | gift-handover.mp4 t=5  CTA background
//
//  Subtitles (sync cu voce-ursulet-trandafir-etern.mp3, primele ~10s):
//  f0  – f69  | "Nu-i mai lua un cadou banal."
//  f69 – f146 | "Florile se ofilesc." / "Cadourile se uită."
//  f146– f148 | (2 frames intentional blank — subtle breath between blocks)
//  f148– f196 | "Acesta nu."
//  f196– f300 | "Ursuleț cu trandafir etern —" / "un colier cu inimi împletite."
//  f300+      | CTA overlay
//

const TOTAL_FRAMES = 450; // 15s
const DIR = "ads/ursulet-trandafir-etern";
const FADE_OUT = 12;
const CTA_START = 300;

// Gradient subtil doar la top — fără gradient greu la bottom (ad-blindness)
const TOP_GRADIENT =
  "linear-gradient(to bottom, rgba(13,5,32,0.55) 0%, transparent 18%)";

const ZOOM_CLOSEUP = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.1)",
};
const ZOOM_GIFT = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.35) translateY(-9%)",
};
const ZOOM_MONTOVA = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  transform: "scale(1.12) translateY(10%)",
};
const ZOOM_STD = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

// --------------------------------------------------------------------------
// PillSubtitleBlock — pill background + spring pop-in (nu gradient greu)
// --------------------------------------------------------------------------
interface PillSubtitleBlockProps {
  line1: string;
  line2?: string;
  totalDuration: number;
  line1Size?: number;
  line2Size?: number;
}

const PillSubtitleBlock: React.FC<PillSubtitleBlockProps> = ({
  line1,
  line2 = "",
  totalDuration,
  line1Size = 48,
  line2Size = 46,
}) => {
  const frame = useCurrentFrame();
  const { height, fps } = useVideoConfig();
  const safeBottomPadding = Math.round(height * 0.225);

  // Spring pop-in cu overshoot — scale 0.7 → 1
  const popIn = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
    durationInFrames: 12,
  });
  const scale = interpolate(popIn, [0, 1], [0.7, 1]);
  const enterOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade-out la finalul sequence-ului
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
        <div
          style={{
            transform: `scale(${scale})`,
            opacity: enterOpacity,
            backgroundColor: "rgba(0,0,0,0.65)",
            borderRadius: 16,
            padding: "12px 28px",
            textAlign: "center",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              color: "#FFFFFF",
              fontSize: line1Size,
              fontWeight: 900,
              fontFamily: "sans-serif",
              lineHeight: 1.3,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {line1}
          </div>
          {line2 && (
            <div
              style={{
                color: "#D4AF37",
                fontSize: line2Size,
                fontWeight: 900,
                fontFamily: "sans-serif",
                lineHeight: 1.3,
                marginTop: 8,
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              {line2}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// Video segments — 2–2.5s cuts, product first (research: pacing 60–75f)
// ==========================================================================
const Ad2Videos: React.FC = () => (
  <>
    {/* f0–f60 | 2s | bear slow-mo 4K — PRODUCT FIRST, hook */}
    <Sequence from={0} durationInFrames={60}>
      <ZoomVideo
        src={staticFile(`${DIR}/bear-closeup-4k.mp4`)}
        duration={60}
        zoomAmount={0.06}
        playbackRate={0.25}
        driftY={-6}
        style={ZOOM_CLOSEUP}
      />
    </Sequence>

    {/* f60–f135 | 2.5s | restaurant gift — context emoțional */}
    <Sequence from={60} durationInFrames={75}>
      <ZoomVideo
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        duration={75}
        zoomAmount={0.04}
        driftX={8}
        style={ZOOM_GIFT}
      />
    </Sequence>

    {/* f135–f210 | 2.5s | produs pe masă */}
    <Sequence from={135} durationInFrames={75}>
      <ZoomVideo
        src={staticFile(`${DIR}/montova-gift.mp4`)}
        duration={75}
        zoomAmount={0.04}
        driftX={-8}
        style={ZOOM_MONTOVA}
      />
    </Sequence>

    {/* f210–f300 | 3s | lănțișor reveal */}
    <Sequence from={210} durationInFrames={90}>
      <ZoomVideo
        src={staticFile(`${DIR}/cu-lantisor.mp4`)}
        duration={90}
        zoomAmount={0.04}
        driftX={8}
        style={ZOOM_STD}
      />
    </Sequence>

    {/* f300–f450 | 5s | CTA background — gift-handover t=5 (5.87s disponibil) */}
    <Sequence from={300} durationInFrames={150}>
      <ZoomVideo
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        duration={150}
        zoomAmount={0.02}
        trimBefore={5}
        driftX={-4}
        style={ZOOM_GIFT}
      />
    </Sequence>
  </>
);

// ==========================================================================
// Overlay — pill subtitles, fără BOTTOM_GRADIENT, top gradient subtil
// ==========================================================================
const Ad2Overlay: React.FC = () => (
  <>
    {/* Adâncime cinematică */}
    <DepthVignette />

    {/* Gradient subtil doar la top */}
    <AbsoluteFill style={{ background: TOP_GRADIENT, pointerEvents: "none" }} />

    {/* ── SUBTITLE BLOCKS — sync cu voce-ursulet-trandafir-etern.mp3 (primele ~10s) ── */}

    {/* f0–f69 | 2.3s | Hook — text apare la f0, produs în slow-mo în spate */}
    <Sequence from={0} durationInFrames={69}>
      <PillSubtitleBlock
        line1="Nu-i mai lua un cadou banal."
        totalDuration={69}
        line1Size={50}
      />
    </Sequence>

    {/* f69–f146 | 2.6s | Tensiune emoțională */}
    <Sequence from={69} durationInFrames={77}>
      <PillSubtitleBlock
        line1="Florile se ofilesc."
        line2="Cadourile se uită."
        totalDuration={77}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f148–f196 | 1.6s | Pattern interrupt scurt */}
    <Sequence from={148} durationInFrames={48}>
      <PillSubtitleBlock
        line1="Acesta nu."
        totalDuration={48}
        line1Size={58}
      />
    </Sequence>

    {/* f196–f300 | 3.5s | Produs reveal — 2 linii */}
    <Sequence from={196} durationInFrames={104}>
      <PillSubtitleBlock
        line1="Ursuleț cu trandafir etern —"
        line2="un colier cu inimi împletite."
        totalDuration={104}
        line1Size={46}
        line2Size={44}
      />
    </Sequence>

    {/* f225 | Mid-CTA hint la 50% din durată (225/450) */}
    <Sequence from={225} durationInFrames={60}>
      <MidCTAHint />
    </Sequence>

    {/* Watermark dinamic f0 → CTA_START */}
    <Sequence from={0} durationInFrames={CTA_START}>
      <DynamicWatermark />
    </Sequence>

    {/* f300–f450 | CTA overlay — cu beneficiu logistic (+15-25% CTR) */}
    <Sequence from={CTA_START} durationInFrames={TOTAL_FRAMES - CTA_START}>
      <CTAOverlay
        tagline={"Ursuleț cu trandafir etern +\ncolier cu inimi împletite"}
        discountLabel="-28% AZI"
        originalPrice="209 RON"
        currentPrice="149 RON"
        ctaText="Comandă acum — livrare în 24h"
      />
    </Sequence>

    <Audio src={staticFile(`${DIR}/voce-ursulet-trandafir-etern.mp3`)} />
  </>
);

// ==========================================================================
// 9x16 — portrait (default)
// ==========================================================================
export const UrsuletTrandafirEternAd2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
    <Ad2Videos />
    <Ad2Overlay />
  </AbsoluteFill>
);

// ==========================================================================
// 4x5 — Instagram/Facebook Feed (1080×1350) — identic cu 9x16
// objectFit:cover face crop automat centrat
// ==========================================================================
export const UrsuletTrandafirEternAd2_4x5 = UrsuletTrandafirEternAd2;

// ==========================================================================
// Blurred backdrop — mirrors Ad2Videos timing exactly
// Used by both 1x1 and 16x9 formats
// ==========================================================================
const Ad2BlurredBackdrop: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={60}>
      <Video
        src={staticFile(`${DIR}/bear-closeup-4k.mp4`)}
        playbackRate={0.25}
        volume={0}
        style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }}
      />
    </Sequence>
    <Sequence from={60} durationInFrames={75}>
      <Video
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        volume={0}
        style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3) translateY(-9%)" }}
      />
    </Sequence>
    <Sequence from={135} durationInFrames={75}>
      <Video
        src={staticFile(`${DIR}/montova-gift.mp4`)}
        volume={0}
        style={{ ...ZOOM_MONTOVA, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3) translateY(10%)" }}
      />
    </Sequence>
    <Sequence from={210} durationInFrames={90}>
      <Video
        src={staticFile(`${DIR}/cu-lantisor.mp4`)}
        volume={0}
        style={{ ...ZOOM_STD, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }}
      />
    </Sequence>
    <Sequence from={300} durationInFrames={150}>
      <Video
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        trimBefore={5}
        volume={0}
        style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3) translateY(-9%)" }}
      />
    </Sequence>
  </>
);

// ==========================================================================
// 1x1 — square: blurred backdrop + centered sharp portrait column
// ==========================================================================
export const UrsuletTrandafirEternAd2_1x1: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred backdrop — oglindește exact Ad2Videos timing */}
      <Ad2BlurredBackdrop />

      {/* Centered sharp portrait column */}
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
          <Ad2Videos />
          <AbsoluteFill>
            <Ad2Overlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// 16x9 — landscape: blurred backdrop + centered sharp portrait column
// ==========================================================================
export const UrsuletTrandafirEternAd2_16x9: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred backdrop — oglindește exact Ad2Videos timing */}
      <Ad2BlurredBackdrop />

      {/* Centered sharp portrait column */}
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
          <Ad2Videos />
          <AbsoluteFill>
            <Ad2Overlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
