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

// === Timing (30 fps, 870 frames = 29s) ====================================
//
//  Cuts every 2.5–3s. Ken Burns 2–6% + drift alternant stânga/dreapta/sus.
//
//  f0   – f75   | 2.5s | engage.mp4              hook, zoom 6%, drift →+12px
//  f75  – f165  | 3s   | gift-handover.mp4       restaurant, drift ←-8px
//  f165 – f255  | 3s   | bear-closeup-1080 @.25x slow-mo reveal, drift ↑-6px
//  f255 – f330  | 2.5s | gift-handover.mp4 t=3   box detail, drift →+8px
//  f330 – f420  | 3s   | cu-lantisor.mp4         colier reveal, drift ←-8px
//  f420 – f510  | 3s   | bear-closeup-1080 @.25x t=1, drift →+6px
//  f510 – f619  | 3.6s | bear-youtube.mp4 t=2    beauty pre-CTA, drift ←-6px
//  f619 – f870  | 8.4s | bear-youtube.mp4 t=7    CTA background, drift →+4px
//
//  Subtitles (PROVIZORII — re-sync cu sync-subtitles.py după audio nou):
//  f5  – f115 | "Cauți cadoul perfect pentru ea?"       | "Unul pe care chiar nu-l va uita."
//  f120– f225 | "Pentru momentul în care vrei să spui…" | '"Vrei să fii a mea?"'
//  f230– f335 | "Cadoul perfect pentru logodnă,"        | "aniversare sau nuntă."
//  f340– f450 | "Există un cadou 2-în-1"                | "care spune totul fără cuvinte."
//  f455– f545 | "Ursuleț cu trandafir etern —"          | "nu se ofilește niciodată."
//  f550– f615 | "Iar în interior…"                      | "un colier cu inimi împletite."
//  f619– f870 | CTA overlay
//  Bridge voce (înainte de CTA): "Un moment pe care nu-l va uita niciodată."
//
// bear-closeup-1080.mp4 este 120fps → playbackRate=0.25 = slow-motion 4x

const TOTAL_FRAMES = 900; // 30s — voiceover "voce-bear-gift-ad.mp3" (ElevenLabs, ~29.5s)
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
// Shared overlay — gradients + subtitles + CTA
// --------------------------------------------------------------------------
const BearGiftAdOverlay: React.FC = () => (
  <>
    {/* Vignette adâncime cinematică */}
    <DepthVignette />

    {/* Gradient la top */}
    <AbsoluteFill
      style={{ background: TOP_GRADIENT, pointerEvents: "none" }}
    />

    {/* Gradient la bottom */}
    <AbsoluteFill
      style={{ background: BOTTOM_GRADIENT, pointerEvents: "none" }}
    />

    {/* ── SUBTITLE BLOCKS — sincronizate cu Whisper (ElevenLabs, ~29.5s) ────────── */}
    {/* Bloc 3: fix manual (Whisper inversează constant cele 2 linii scurte)      */}

    {/* f0–f139 | Bloc 1 | Hook — Whisper ✅ */}
    {/* line1: "Cauți cadoul perfect pentru ea?"  0.43s = f13 */}
    {/* line2: "Unul pe care chiar nu-l va uita."  2.30s = f69 */}
    <Sequence from={0} durationInFrames={139}>
      <SubtitleBlock
        line1="Cauți cadoul perfect pentru ea?"
        line2="Unul pe care chiar nu-l va uita."
        totalDuration={139}
        line1Delay={0}
        line2Delay={49}
        line1Size={48}
        line2Size={46}
      />
    </Sequence>

    {/* f132–f252 | Bloc 2 | Propunere — extins pe durata ask-for-engafe */}
    {/* line1: "Pentru momentul în care vrei să spui…"  4.90s = f147 */}
    {/* line2: "Vrei să fii a mea?"  5.80s = f174 */}
    <Sequence from={132} durationInFrames={120}>
      <SubtitleBlock
        line1="Pentru momentul în care vrei să spui…"
        line2={`"Vrei să fii a mea?"`}
        totalDuration={120}
        line1Delay={0}
        line2Delay={22}
        line1Size={44}
        line2Size={48}
      />
    </Sequence>

    {/* f255–f349 | Bloc 3 | Tensiune */}
    {/* line1: "E greu să găsești ceva"  ~9.0s = f270 */}
    {/* line2: "care să spună tot ce simți."  ~10.5s = f315 */}
    <Sequence from={255} durationInFrames={94}>
      <SubtitleBlock
        line1="E greu să găsești ceva"
        line2="care să spună tot ce simți."
        totalDuration={94}
        line1Delay={0}
        line2Delay={40}
        line1Size={50}
        line2Size={48}
      />
    </Sequence>

    {/* f354–f556 | Bloc 4 | Produs WOW — Whisper ✅ */}
    {/* line1: "Există un cadou 2-în-1 care face fix asta —"  12.30s = f369 */}
    {/* line2: "trandafir etern care nu se ofilește niciodată."  15.50s = f465 */}
    <Sequence from={354} durationInFrames={202}>
      <SubtitleBlock
        line1="Există un cadou 2-în-1 care face fix asta —"
        line2="trandafir etern care nu se ofilește niciodată."
        totalDuration={202}
        line1Delay={0}
        line2Delay={91}
        line1Size={44}
        line2Size={44}
      />
    </Sequence>

    {/* f532–f669 | Bloc 5 | Colier — Whisper ✅ */}
    {/* line1: "Și în interior, ascuns…"  18.23s = f547 */}
    {/* line2: "un colier cu inimi împletite."  20.53s = f616 */}
    <Sequence from={532} durationInFrames={137}>
      <SubtitleBlock
        line1="Și în interior, ascuns…"
        line2="un colier cu inimi împletite."
        totalDuration={137}
        line1Delay={0}
        line2Delay={64}
        line1Size={50}
        line2Size={48}
      />
    </Sequence>

    {/* f657–f720 | Bloc 6 | Bridge emoțional — Whisper ✅ */}
    {/* line1: "Va plânge când îl deschide."  22.40s = f672 */}
    <Sequence from={657} durationInFrames={63}>
      <SubtitleBlock
        line1="Va plânge când îl deschide."
        line2=""
        totalDuration={63}
        line1Delay={0}
        line2Delay={0}
        line1Size={52}
        line2Size={50}
      />
    </Sequence>

    {/* f0–f48 | Pattern interrupt — hook text overlay */}
    <Sequence from={0} durationInFrames={48}>
      <HookTextOverlay
        line1="Nu i-ai mai luat"
        line2="NICIODATĂ"
        line3="un cadou ca ăsta."
      />
    </Sequence>

    {/* f450–f510 | Mid-video soft CTA hint (+22% CTR vs end-only) */}
    <Sequence from={450} durationInFrames={60}>
      <MidCTAHint />
    </Sequence>

    {/* Watermark dinamic — activ pana la CTA */}
    <Sequence from={0} durationInFrames={717}>
      <DynamicWatermark />
    </Sequence>

    {/* f717–f900 | 23.9–30s | CTA */}
    <Sequence from={717} durationInFrames={TOTAL_FRAMES - 717}>
      <CTAOverlay
        tagline={"Cadoul perfect pentru ea —\ntrandafir etern + colier"}
        discountLabel="-28% AZI"
        overlayColor="70, 3, 15"
      />
    </Sequence>

    {/* Voiceover — "voce-bear-gift-ad.MP3" @ 1.31x speed, 29s */}
    <Audio src={staticFile(`${DIR}/voce-bear-gift-ad.mp3`)} />
  </>
);

// ==========================================================================
// Video segments — refolosit in fiecare format
// Cuts every 2.5–3s. Ken Burns 2–8% + drift alternant stânga/dreapta.
// ==========================================================================
//
//  f0   – f75   | 2.5s | engage.mp4              hook, zoom 6%, drift →+12px
//  f75  – f165  | 3s   | gift-handover.mp4       restaurant, drift ←-8px
//  f165 – f255  | 3s   | bear-closeup-1080 @.25x slow-mo reveal, drift ↑-6px
//  f255 – f330  | 2.5s | gift-handover.mp4 t=3   box detail, drift →+8px
//  f330 – f420  | 3s   | cu-lantisor.mp4         colier reveal, drift ←-8px
//  f420 – f510  | 3s   | bear-closeup-1080 @.25x t=1, drift →+6px
//  f510 – f619  | 3.6s | bear-youtube.mp4 t=2    beauty pre-CTA, drift ←-6px
//  f619 – f870  | 8.4s | bear-youtube.mp4 t=7    CTA background, drift →+4px
//
const BearGiftVideos: React.FC = () => (
  <>
    {/* f0–f75 | 2.5s | hook — zoom agresiv 6%, drift dreapta */}
    <Sequence from={0} durationInFrames={75}>
      <ZoomVideo
        src={staticFile(`${DIR}/engage.mp4`)}
        duration={75}
        zoomAmount={0.06}
        driftX={12}
        style={ZOOM_ENGAGE}
      />
    </Sequence>

    {/* f75–f165 | 3s | cadou restaurant — drift stânga */}
    <Sequence from={75} durationInFrames={90}>
      <ZoomVideo
        src={staticFile(`${DIR}/gift-handover.mp4`)}
        duration={90}
        driftX={-8}
        style={ZOOM_GIFT}
      />
    </Sequence>

    {/* f165–f269 | 3.5s | cerere în căsătorie — "Vrei să fii a mea?" — drift sus */}
    <Sequence from={165} durationInFrames={104}>
      <ZoomVideo
        src={staticFile(`${DIR}/ask-for-engafe.mp4`)}
        duration={104}
        driftY={-6}
        style={ZOOM_GIFT}
      />
    </Sequence>

    {/* f269–f344 | 2.5s | hands-bear — scoate ursuletul din pungă — drift dreapta */}
    <Sequence from={269} durationInFrames={75}>
      <ZoomVideo
        src={staticFile(`${DIR}/hands-bear.mov`)}
        duration={75}
        driftX={8}
        style={ZOOM_GIFT}
      />
    </Sequence>

    {/* f344–f434 | 3s | colier reveal — drift stânga */}
    <Sequence from={344} durationInFrames={90}>
      <ZoomVideo
        src={staticFile(`${DIR}/cu-lantisor.mp4`)}
        duration={90}
        driftX={-8}
        style={ZOOM_CLOSEUP}
      />
    </Sequence>

    {/* f434–f524 | 3s | bear slow-mo detail (t=1s) — drift dreapta */}
    <Sequence from={434} durationInFrames={90}>
      <ZoomVideo
        src={staticFile(`${DIR}/bear-closeup-1080.mp4`)}
        duration={90}
        playbackRate={0.25}
        trimBefore={1}
        driftX={6}
        style={ZOOM_CLOSEUP}
      />
    </Sequence>

    {/* f524–f717 | 6.4s | beauty pre-CTA (t=2s) — drift stânga */}
    <Sequence from={524} durationInFrames={193}>
      <ZoomVideo
        src={staticFile(`${DIR}/bear-youtube.mp4`)}
        duration={193}
        zoomAmount={0.03}
        trimBefore={2}
        driftX={-6}
        style={ZOOM_YOUTUBE}
      />
    </Sequence>

    {/* f717–f900 | 6.1s | CTA background (t=7s) — drift subtil */}
    <Sequence from={717} durationInFrames={TOTAL_FRAMES - 717}>
      <ZoomVideo
        src={staticFile(`${DIR}/bear-youtube.mp4`)}
        duration={TOTAL_FRAMES - 717}
        zoomAmount={0.02}
        trimBefore={7}
        driftX={4}
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
      {/* Blurred background fill — mirrors BearGiftVideos timing */}
      <Sequence from={0} durationInFrames={75}>
        <Video src={staticFile(`${DIR}/engage.mp4`)} volume={0}
          style={{ ...ZOOM_ENGAGE, filter: "blur(22px) brightness(0.35)", transform: "scale(1.2)" }} />
      </Sequence>
      <Sequence from={75} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={165} durationInFrames={104}>
        <Video src={staticFile(`${DIR}/ask-for-engafe.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={269} durationInFrames={75}>
        <Video src={staticFile(`${DIR}/hands-bear.mov`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={344} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/cu-lantisor.mp4`)} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={434} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/bear-closeup-1080.mp4`)} playbackRate={0.25} trimBefore={1} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={524} durationInFrames={TOTAL_FRAMES - 524}>
        <Video src={staticFile(`${DIR}/bear-youtube.mp4`)} trimBefore={2} volume={0}
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
      {/* Blurred background fill — mirrors BearGiftVideos timing */}
      <Sequence from={0} durationInFrames={75}>
        <Video src={staticFile(`${DIR}/engage.mp4`)} volume={0}
          style={{ ...ZOOM_ENGAGE, filter: "blur(22px) brightness(0.35)", transform: "scale(1.2)" }} />
      </Sequence>
      <Sequence from={75} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/gift-handover.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={165} durationInFrames={104}>
        <Video src={staticFile(`${DIR}/ask-for-engafe.mp4`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={269} durationInFrames={75}>
        <Video src={staticFile(`${DIR}/hands-bear.mov`)} volume={0}
          style={{ ...ZOOM_GIFT, filter: "blur(22px) brightness(0.35)", transform: "scale(1.7) translateY(-8%)" }} />
      </Sequence>
      <Sequence from={344} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/cu-lantisor.mp4`)} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={434} durationInFrames={90}>
        <Video src={staticFile(`${DIR}/bear-closeup-1080.mp4`)} playbackRate={0.25} trimBefore={1} volume={0}
          style={{ ...ZOOM_CLOSEUP, filter: "blur(22px) brightness(0.35)", transform: "scale(1.4)" }} />
      </Sequence>
      <Sequence from={524} durationInFrames={TOTAL_FRAMES - 524}>
        <Video src={staticFile(`${DIR}/bear-youtube.mp4`)} trimBefore={2} volume={0}
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
