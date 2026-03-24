import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { DemoScene } from "./scenes/DemoScene";
import { ProofScene } from "./scenes/ProofScene";
import { CTAScene } from "./scenes/CTAScene";

// 16x9 layout: video on left (9:16 contained), content panel on right
// Video column width = height × (9/16) = 1080 × 0.5625 = 607.5 → 608px
// Content column = 1920 - 608 = 1312px

const VIDEO_COL = 608;

const FADE = fade();
const T = linearTiming({ durationInFrames: 15 });

export const FacebookAd16x9: React.FC = () => {
  const { height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ flexDirection: "row", backgroundColor: "#0d0520" }}>

      {/* LEFT: video at natural 9:16 ratio */}
      <div style={{ width: VIDEO_COL, height, position: "relative", flexShrink: 0, overflow: "hidden" }}>
        <Video
          src={staticFile("ads/ep-2011/A_woman_with_202603221721.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Soft right-edge fade to blend into content panel */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: 80, height: "100%",
          background: "linear-gradient(to right, transparent, #0d0520)",
          pointerEvents: "none",
        }} />
      </div>

      {/* RIGHT: content panel — scenes render here as overlays */}
      <div style={{ flex: 1, height, position: "relative", overflow: "hidden" }}>
        {/* Background gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #1a0533 0%, #0d1b4b 100%)",
        }} />

        {/* Purple glow orb */}
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,27,109,0.6) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Scene overlays positioned in the right panel */}
        <AbsoluteFill>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={255}>
              <HookScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={FADE} timing={T} />
            <TransitionSeries.Sequence durationInFrames={225}>
              <ProblemScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={FADE} timing={T} />
            <TransitionSeries.Sequence durationInFrames={225}>
              <DemoScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={FADE} timing={T} />
            <TransitionSeries.Sequence durationInFrames={225}>
              <ProofScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={FADE} timing={T} />
            <TransitionSeries.Sequence durationInFrames={80}>
              <CTAScene />
            </TransitionSeries.Sequence>
          </TransitionSeries>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
