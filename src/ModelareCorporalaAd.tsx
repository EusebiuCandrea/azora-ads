import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Video } from "@remotion/media";
import { TextOverlay } from "./components/TextOverlay";
import { ZoomVideo } from "./components/ZoomVideo";
import { DepthVignette } from "./components/DepthVignette";
import { HookTextOverlay } from "./components/HookTextOverlay";
import { MidCTAHint } from "./components/MidCTAHint";
import { DynamicWatermark } from "./components/DynamicWatermark";
import { CTAOverlay } from "./components/CTAOverlay";

// === Timing (30 fps, 720 frames = 24s) ====================================
//
//  f0   – f100  | 3.3s  | begin.mp4    hook — femeie după sarcină, zoom 6%, drift →+12
//  f100 – f661  | 18.7s | mid.mp4      demonstrație aparat, zoom 4%, drift ←-8
//  f661 – f720  | 2.0s  | final.mp4    fată spre cameră + CTA background, zoom 3%, drift →+6
//
//  CTA_START: f663 (22.1s)
//  TOTAL_FRAMES: 720 (24s)
//
//  Subtitluri (sync-subtitles.py, voce-modelare-corporala-lifting.mp3):
//  f0–f105    "Corpul tău nu mai e la fel după sarcină?"
//  f105–f180  "Este normal." / "Dar nu trebuie să rămână așa."
//  f180–f233  "Acum poți avea grijă de tine chiar de acasă."
//  f233–f423  "Dispozitiv 5-în-1…" / "cu EMS, LED și masaj anticelulitic."
//  f423–f545  "Stimulează mușchii, tonifică pielea" / "și îmbunătățește aspectul zonelor afectate."
//  f545–f636  "Fără durere. Fără programări." / "Fără timp pierdut."
//  f636–f681  "Doar câteva minute pe zi."
//  f663–f720  CTA overlay

const TOTAL_FRAMES = 720;
const DIR = "ads/modelare-corporala-lifting";
const FADE_OUT = 12;
const CTA_START = 663;

const BOTTOM_GRADIENT =
  "linear-gradient(to top, rgba(74,27,109,0.90) 0%, rgba(74,27,109,0.25) 40%, transparent 72%)";

const TOP_GRADIENT =
  "linear-gradient(to bottom, rgba(13,5,32,0.70) 0%, transparent 18%)";

const ZOOM_STYLE = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
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
// Shared overlay — gradients + subtitles + CTA
// --------------------------------------------------------------------------
const ModelareCorporalaAdOverlay: React.FC = () => (
  <>
    <DepthVignette />

    <AbsoluteFill
      style={{ background: TOP_GRADIENT, pointerEvents: "none" }}
    />

    <AbsoluteFill
      style={{ background: BOTTOM_GRADIENT, pointerEvents: "none" }}
    />

    {/* ── SUBTITLE_BLOCKS_START ── */}
    {/* ── SUBTITLE BLOCKS — sync-subtitles.py v2 (segment-based) ── */}
    {/* Whisper: 7 segmente, 69 cuvinte */}

    {/* f0–f63 | 0.00s | Bloc 1 */}
    <Sequence from={0} durationInFrames={63}>
      <SubtitleBlock
        line1="Corpul tău nu mai e la fel după sarcină?"
        line2=""
        totalDuration={63}
        line1Delay={0}
        line2Delay={0}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f63–f180 | 2.10s | Bloc 2 */}
    <Sequence from={63} durationInFrames={117}>
      <SubtitleBlock
        line1="Este normal."
        line2="Dar nu trebuie să rămână așa."
        totalDuration={117}
        line1Delay={0}
        line2Delay={21}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f180–f233 | 6.00s | Bloc 3 */}
    <Sequence from={180} durationInFrames={53}>
      <SubtitleBlock
        line1="Acum poți avea grijă de tine chiar de acasă."
        line2=""
        totalDuration={53}
        line1Delay={0}
        line2Delay={0}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f233–f423 | 7.77s | Bloc 4 */}
    <Sequence from={233} durationInFrames={190}>
      <SubtitleBlock
        line1="Dispozitiv 5-în-1 pentru modelare corporală și lifting facial —"
        line2="cu EMS, LED și masaj anticelulitic."
        totalDuration={190}
        line1Delay={0}
        line2Delay={92}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f423–f545 | 14.20s | Bloc 5 */}
    <Sequence from={423} durationInFrames={122}>
      <SubtitleBlock
        line1="Stimulează mușchii, tonifică pielea"
        line2="și îmbunătățește aspectul zonelor afectate."
        totalDuration={122}
        line1Delay={0}
        line2Delay={48}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f545–f636 | 18.17s | Bloc 6 */}
    <Sequence from={545} durationInFrames={91}>
      <SubtitleBlock
        line1="Fără durere. Fără programări."
        line2="Fără timp pierdut."
        totalDuration={91}
        line1Delay={0}
        line2Delay={24}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f636–f681 | 21.20s | Bloc 7 */}
    <Sequence from={636} durationInFrames={45}>
      <SubtitleBlock
        line1="Doar câteva minute pe zi."
        line2=""
        totalDuration={45}
        line1Delay={0}
        line2Delay={0}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* ── SUBTITLE_BLOCKS_END ── */}

    {/* f0–f48 | Pattern interrupt — hook text */}
    <Sequence from={0} durationInFrames={48}>
      <HookTextOverlay
        line1="Redă-ți"
        line2="SILUETA"
        line3="de dinainte"
      />
    </Sequence>

    {/* f360–f420 | Mid-video soft CTA hint */}
    <Sequence from={360} durationInFrames={60}>
      <MidCTAHint />
    </Sequence>

    {/* Watermark până la CTA */}
    <Sequence from={0} durationInFrames={CTA_START}>
      <DynamicWatermark />
    </Sequence>

    {/* f663–f720 | CTA overlay */}
    <Sequence from={CTA_START} durationInFrames={TOTAL_FRAMES - CTA_START}>
      <CTAOverlay
        tagline={"Modelare corporală și\nlifting facial 5-în-1"}
        discountLabel="-41% AZI"
      />
    </Sequence>

    <Audio src={staticFile(`${DIR}/voce-modelare-corporala-lifting.mp3`)} />
  </>
);

// ==========================================================================
// Video segments — refolosit în fiecare format
// ==========================================================================
const ModelareCorporalaVideos: React.FC = () => (
  <>
    {/* f0–f100 | 3.3s | hook — femeie după sarcină, zoom 6%, drift → */}
    <Sequence from={0} durationInFrames={100}>
      <ZoomVideo
        src={staticFile(`${DIR}/begin.mp4`)}
        duration={100}
        zoomAmount={0.06}
        driftX={12}
        style={ZOOM_STYLE}
      />
    </Sequence>

    {/* f100–f661 | 18.7s | demonstrație aparat, zoom 4%, drift ← */}
    <Sequence from={100} durationInFrames={561}>
      <ZoomVideo
        src={staticFile(`${DIR}/mid.mp4`)}
        duration={561}
        zoomAmount={0.04}
        driftX={-8}
        style={ZOOM_STYLE}
      />
    </Sequence>

    {/* f661–f720 | 2s | fată spre cameră / CTA background, zoom 3%, drift → */}
    <Sequence from={661} durationInFrames={59}>
      <ZoomVideo
        src={staticFile(`${DIR}/final.mp4`)}
        duration={59}
        zoomAmount={0.03}
        driftX={6}
        style={ZOOM_STYLE}
      />
    </Sequence>
  </>
);

// ==========================================================================
// 9x16 — portrait
// ==========================================================================
export const ModelareCorporalaAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
    <ModelareCorporalaVideos />
    <ModelareCorporalaAdOverlay />
  </AbsoluteFill>
);

// ==========================================================================
// 4x5 — identic cu 9x16 (objectFit:cover face crop automat)
// ==========================================================================
export const ModelareCorporalaAd_4x5 = ModelareCorporalaAd;

// ==========================================================================
// 1x1 — square: blurred backdrop + centered sharp portrait
// ==========================================================================
export const ModelareCorporalaAd_1x1: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred background — oglindește ModelareCorporalaVideos */}
      <Sequence from={0} durationInFrames={100}>
        <Video
          src={staticFile(`${DIR}/begin.mp4`)}
          volume={0}
          style={{ ...ZOOM_STYLE, filter: "blur(22px) brightness(0.35)" }}
        />
      </Sequence>
      <Sequence from={100} durationInFrames={561}>
        <Video
          src={staticFile(`${DIR}/mid.mp4`)}
          volume={0}
          style={{ ...ZOOM_STYLE, filter: "blur(22px) brightness(0.35)" }}
        />
      </Sequence>
      <Sequence from={661} durationInFrames={59}>
        <Video
          src={staticFile(`${DIR}/final.mp4`)}
          volume={0}
          style={{ ...ZOOM_STYLE, filter: "blur(22px) brightness(0.35)" }}
        />
      </Sequence>

      {/* Centered sharp portrait */}
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
          <ModelareCorporalaVideos />
          <AbsoluteFill>
            <ModelareCorporalaAdOverlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// 16x9 — landscape: blurred backdrop + centered sharp portrait
// ==========================================================================
export const ModelareCorporalaAd_16x9: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred background — oglindește ModelareCorporalaVideos */}
      <Sequence from={0} durationInFrames={100}>
        <Video
          src={staticFile(`${DIR}/begin.mp4`)}
          volume={0}
          style={{ ...ZOOM_STYLE, filter: "blur(22px) brightness(0.35)" }}
        />
      </Sequence>
      <Sequence from={100} durationInFrames={561}>
        <Video
          src={staticFile(`${DIR}/mid.mp4`)}
          volume={0}
          style={{ ...ZOOM_STYLE, filter: "blur(22px) brightness(0.35)" }}
        />
      </Sequence>
      <Sequence from={661} durationInFrames={59}>
        <Video
          src={staticFile(`${DIR}/final.mp4`)}
          volume={0}
          style={{ ...ZOOM_STYLE, filter: "blur(22px) brightness(0.35)" }}
        />
      </Sequence>

      {/* Centered sharp portrait */}
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
          <ModelareCorporalaVideos />
          <AbsoluteFill>
            <ModelareCorporalaAdOverlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
