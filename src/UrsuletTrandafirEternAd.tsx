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

// === Timing (30 fps, 660 frames = 22s) =====================================
//
//  f0   – f90  | 3.0s | gift-handover.mp4       restaurant hook, zoom 6%, drift →+12
//  f90  – f180 | 3.0s | montova-gift.mp4         package on table, zoom 4%, drift ←-8
//  f180 – f360 | 6.0s | bear-closeup-4k.mp4      120fps @0.25x slow-mo, drift ↑-6
//  f360 – f510 | 5.0s | cu-lantisor.mp4           lănțișor reveal, drift →+8
//  f510 – f660 | 5.0s | gift-handover.mp4  t=5    CTA bg, zoom 2%, drift ←-6
//
//  Subtitles (Whisper sync — 30 fps):
//  f0  – f54  | "Nu-i mai lua un cadou banal."
//  f54 – f149 | "Florile se ofilesc."             | "Cadourile se uită."
//  f149– f268 | "Acesta nu."
//  f377– f450 | "Ursuleț cu trandafir etern —"   | "care nu se ofilește niciodată."
//  f455– f493 | "Și în interior…"                | "un colier cu inimi împletite."
//  f493– f578 | "2 cadouri într-unul singur."    | "Reacția ei? De neuitat."
//  f597+      | CTA overlay
//

const TOTAL_FRAMES = 660; // 22s
const DIR = "ads/ursulet-trandafir-etern";
const FADE_OUT = 12;
const CTA_START = 566;

const BOTTOM_GRADIENT =
  "linear-gradient(to top, rgba(74,27,109,0.90) 0%, rgba(74,27,109,0.20) 40%, transparent 70%)";
const TOP_GRADIENT =
  "linear-gradient(to bottom, rgba(13,5,32,0.65) 0%, transparent 18%)";

const ZOOM_STD = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};
const ZOOM_GIFT = {
  ...ZOOM_STD,
  // scale(1.35): crop ~17% per margine — elimină textul YouTube/TikTok de sus
  // translateY(-9%): shift suplimentar în sus pentru a tăia overlay-ul de sus
  transform: "scale(1.35) translateY(-9%)",
};
const ZOOM_MONTOVA = {
  ...ZOOM_STD,
  // scale(1.6) + translateY(-18%): crop bottom ~28% — elimină textul YouTube original
  transform: "scale(1.12) translateY(10%)",
};
const ZOOM_CLOSEUP = {
  ...ZOOM_STD,
  transform: "scale(1.1)",
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
// Shared overlay
// --------------------------------------------------------------------------
const UrsuletEternAdOverlay: React.FC = () => (
  <>
    <DepthVignette />
    <AbsoluteFill style={{ background: TOP_GRADIENT, pointerEvents: "none" }} />
    <AbsoluteFill style={{ background: BOTTOM_GRADIENT, pointerEvents: "none" }} />

    {/* ── SUBTITLE_BLOCKS_START ── */}
    {/* ── SUBTITLE BLOCKS — sync cu Whisper large-v3 ── */}
    {/* Seg[00] f0–f136: "Nu-i mai lua un cadou banal. Florile se ofilesc, cadourile se uită." */}
    {/* Seg[01] f140–f309: "Acesta nu. Ursuleț cu trandafir etern, care nu se ofilește niciodată." */}
    {/* Seg[02] f325–f425: "Și în interior, un colier cu inimi împletite." */}
    {/* Seg[03] f434–f565: "Două cadouri într-unul singur. Reacția ei? De neuitat." */}

    {/* f0–f69 | 0.00s | Bloc 1 — prima jumătate din Seg[00] */}
    <Sequence from={0} durationInFrames={69}>
      <SubtitleBlock
        line1="Nu-i mai lua un cadou banal."
        line2=""
        totalDuration={69}
        line1Delay={0}
        line2Delay={0}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f69–f146 | 2.30s | Bloc 2 — a doua jumătate din Seg[00] */}
    <Sequence from={69} durationInFrames={77}>
      <SubtitleBlock
        line1="Florile se ofilesc."
        line2="Cadourile se uită."
        totalDuration={77}
        line1Delay={0}
        line2Delay={35}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f148–f196 | 4.93s | Bloc 3 — prima parte din Seg[01] */}
    <Sequence from={148} durationInFrames={48}>
      <SubtitleBlock
        line1="Acesta nu."
        line2=""
        totalDuration={48}
        line1Delay={0}
        line2Delay={0}
        line1Size={58}
        line2Size={50}
      />
    </Sequence>

    {/* f196–f317 | 6.53s | Bloc 4 — a doua parte din Seg[01] */}
    <Sequence from={196} durationInFrames={121}>
      <SubtitleBlock
        line1="Ursuleț cu trandafir etern —"
        line2="care nu se ofilește niciodată."
        totalDuration={121}
        line1Delay={0}
        line2Delay={50}
        line1Size={46}
        line2Size={44}
      />
    </Sequence>

    {/* f317–f435 | 10.57s | Bloc 5 — Seg[02] */}
    <Sequence from={317} durationInFrames={118}>
      <SubtitleBlock
        line1="Și în interior…"
        line2="un colier cu inimi împletite."
        totalDuration={118}
        line1Delay={0}
        line2Delay={40}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* f435–f565 | 14.50s | Bloc 6 — Seg[03] */}
    <Sequence from={435} durationInFrames={130}>
      <SubtitleBlock
        line1="2 cadouri într-unul singur."
        line2="Reacția ei? De neuitat."
        totalDuration={130}
        line1Delay={0}
        line2Delay={65}
        line1Size={50}
        line2Size={50}
      />
    </Sequence>

    {/* ── SUBTITLE_BLOCKS_END ── */}

    {/* f0–f48 | Pattern interrupt — hook text overlay */}
    <Sequence from={0} durationInFrames={48}>
      <HookTextOverlay
        line1="Nu-i mai lua"
        line2="UN CADOU"
        line3="banal."
      />
    </Sequence>

    {/* f300–f360 | Mid-video soft CTA hint */}
    <Sequence from={300} durationInFrames={60}>
      <MidCTAHint />
    </Sequence>

    {/* Watermark dinamic — activ până la CTA */}
    <Sequence from={0} durationInFrames={CTA_START}>
      <DynamicWatermark />
    </Sequence>

    {/* f566–f660 | CTA overlay — Seg[04] f574 "Comandă acum pe Azora.ro" */}
    <Sequence from={CTA_START} durationInFrames={TOTAL_FRAMES - CTA_START}>
      <CTAOverlay
        tagline={"Ursuleț cu trandafir etern +\ncolier cu inimi împletite"}
        discountLabel="-28% AZI"
        originalPrice="209 RON"
        currentPrice="149 RON"
      />
    </Sequence>

    <Audio src={staticFile(`${DIR}/voce-ursulet-trandafir-etern.mp3`)} />
  </>
);

// ==========================================================================
// Video segments
// ==========================================================================
const UrsuletEternVideos: React.FC = () => (
  <>
    {/* f0–f90 | 3s | restaurant hook — zoom 6%, drift dreapta */}
    <Sequence from={0} durationInFrames={90}>
      <ZoomVideo
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        duration={90}
        zoomAmount={0.06}
        driftX={12}
        style={ZOOM_GIFT}
      />
    </Sequence>

    {/* f90–f180 | 3s | package on table — zoom 4%, drift stânga */}
    <Sequence from={90} durationInFrames={90}>
      <ZoomVideo
        src={staticFile(`${DIR}/montova-gift.mp4`)}
        duration={90}
        zoomAmount={0.04}
        driftX={-8}
        style={ZOOM_MONTOVA}
      />
    </Sequence>

    {/* f180–f360 | 6s | 4K slow-mo 120fps @0.25x — drift sus */}
    <Sequence from={180} durationInFrames={180}>
      <ZoomVideo
        src={staticFile(`${DIR}/bear-closeup-4k.mp4`)}
        duration={180}
        zoomAmount={0.04}
        playbackRate={0.25}
        driftY={-6}
        style={ZOOM_CLOSEUP}
      />
    </Sequence>

    {/* f360–f510 | 5s | lănțișor reveal — drift dreapta */}
    <Sequence from={360} durationInFrames={150}>
      <ZoomVideo
        src={staticFile(`${DIR}/cu-lantisor.mp4`)}
        duration={150}
        zoomAmount={0.04}
        driftX={8}
        style={ZOOM_STD}
      />
    </Sequence>

    {/* f510–f660 | 5s | CTA bg (t=5s) — drift stânga */}
    <Sequence from={510} durationInFrames={150}>
      <ZoomVideo
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        duration={150}
        zoomAmount={0.02}
        trimBefore={5}
        driftX={-6}
        style={ZOOM_GIFT}
      />
    </Sequence>
  </>
);

// ==========================================================================
// 9x16 — portrait
// ==========================================================================
export const UrsuletTrandafirEternAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
    <UrsuletEternVideos />
    <UrsuletEternAdOverlay />
  </AbsoluteFill>
);

// ==========================================================================
// 4x5 — Instagram/Facebook feed (1080×1350) — identical to 9x16
// ==========================================================================
export const UrsuletTrandafirEternAd_4x5 = UrsuletTrandafirEternAd;

// ==========================================================================
// 1x1 — square: blurred backdrop + centered portrait column
// ==========================================================================
export const UrsuletTrandafirEternAd_1x1: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred background — mirrors UrsuletEternVideos timing */}
      <Sequence from={0} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/montova-gift.mp4`)} volume={0}
          style={{ ...ZOOM_MONTOVA, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3) translateY(-4%)" }} />
      </Sequence>
      <Sequence from={180} durationInFrames={180}>
        <Video src={staticFile(`${DIR}/bear-closeup-4k.mp4`)} playbackRate={0.25} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>
      <Sequence from={360} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/cu-lantisor.mp4`)} volume={0}
          style={{ ...ZOOM_STD, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>
      <Sequence from={510} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} trimBefore={5} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>

      {/* Centered sharp portrait column */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: portraitWidth, height: "100%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <UrsuletEternVideos />
          <AbsoluteFill>
            <UrsuletEternAdOverlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// 16x9 — landscape: blurred backdrop + centered portrait column
// ==========================================================================
export const UrsuletTrandafirEternAd_16x9: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0520" }}>
      {/* Blurred background — mirrors UrsuletEternVideos timing */}
      <Sequence from={0} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/montova-gift.mp4`)} volume={0}
          style={{ ...ZOOM_MONTOVA, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3) translateY(-4%)" }} />
      </Sequence>
      <Sequence from={180} durationInFrames={180}>
        <Video src={staticFile(`${DIR}/bear-closeup-4k.mp4`)} playbackRate={0.25} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>
      <Sequence from={360} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/cu-lantisor.mp4`)} volume={0}
          style={{ ...ZOOM_STD, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>
      <Sequence from={510} durationInFrames={150}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} trimBefore={5} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.3)" }} />
      </Sequence>

      {/* Centered sharp portrait column */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: portraitWidth, height: "100%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <UrsuletEternVideos />
          <AbsoluteFill>
            <UrsuletEternAdOverlay />
          </AbsoluteFill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
