import { AbsoluteFill, Series, Sequence, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { HookSection } from "./sections/HookSection";
import { BrandSection } from "./sections/BrandSection";
import { TechSection } from "./sections/TechSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { CTASection } from "./sections/CTASection";

// Timeline (with offsets, total ≈ 620 frames @ 30fps ≈ 20.6s):
// Video bg:  frames 0–150  (continuous, no restart)
// Hook:      frames 0–90
// Brand:     frames 80–140
// Tech:      frames 130–505  (5 × 75 frames)
// Benefits:  frames 495–570
// CTA:       frames 560–620

export const AzoraAd: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Single persistent video background for hook + brand sections */}
      <Sequence from={0} durationInFrames={150}>
        <Video
          src={staticFile("ads/ep-2011/A_woman_with_202603221721.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loop
        />
      </Sequence>

      {/* Sections layered on top */}
      <Series>
        <Series.Sequence durationInFrames={90}>
          <HookSection />
        </Series.Sequence>
        <Series.Sequence durationInFrames={60} offset={-10}>
          <BrandSection />
        </Series.Sequence>
        <Series.Sequence durationInFrames={375} offset={-10}>
          <TechSection />
        </Series.Sequence>
        <Series.Sequence durationInFrames={75} offset={-10}>
          <BenefitsSection />
        </Series.Sequence>
        <Series.Sequence durationInFrames={60} offset={-10}>
          <CTASection />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
