import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { DemoScene } from "./scenes/DemoScene";
import { ProofScene } from "./scenes/ProofScene";
import { CTAScene } from "./scenes/CTAScene";

// Transcription-synced scene boundaries (30fps):
//   Hook:    0–8s   (global   0– 240)
//   Problem: 8–15s  (global 240– 450) — 15 frame fade overlap
//   Demo:   15–22s  (global 450– 660)
//   Proof:  22–29s  (global 660– 870)
//   CTA:    29–36s  (global 870–1080)
//
// Raw scene durations (+ 15f per transition to compensate overlap):
//   Hook:    255f   Problem: 225f   Demo: 225f   Proof: 225f   CTA: 225f
//   Sum: 1155 − 4×15 = 1155 − 60 = 1095 ≈ 1080 (close enough, CTA trimmed to 210)

const FADE = fade();
const T = linearTiming({ durationInFrames: 15 });

export const FacebookAd: React.FC = () => {
  return (
    <AbsoluteFill>
      <Video
        src={staticFile("ads/ep-2011/A_woman_with_202603221721.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <TransitionSeries>
        {/* 0–8s: prezintă dispozitivul cu LED */}
        <TransitionSeries.Sequence durationInFrames={255}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE} timing={T} />

        {/* 8–15s: problema + căutarea soluției */}
        <TransitionSeries.Sequence durationInFrames={225}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE} timing={T} />

        {/* 15–22s: cele 5 tehnologii */}
        <TransitionSeries.Sequence durationInFrames={225}>
          <DemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE} timing={T} />

        {/* 22–29s: rezultate după 3 săptămâni */}
        <TransitionSeries.Sequence durationInFrames={225}>
          <ProofScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={FADE} timing={T} />

        {/* 29–32s: arată cu degetul → CTA */}
        <TransitionSeries.Sequence durationInFrames={80}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
