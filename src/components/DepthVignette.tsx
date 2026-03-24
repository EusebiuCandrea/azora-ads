import { AbsoluteFill } from "remotion";

// DepthVignette — radial vignette pentru efect DoF / adâncime cinematică.
// Primul element în overlay stack, sub gradients și subtitluri.
// Darkens edges 50% → simulated shallow depth of field.

export const DepthVignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 45%, transparent 48%, rgba(0,0,0,0.50) 100%)",
      pointerEvents: "none",
    }}
  />
);
