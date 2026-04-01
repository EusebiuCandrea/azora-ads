import { AbsoluteFill, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

// === Timing (30 fps, 356 frames = ~11.87 s) =================================
//  Single clip: "video final aparat celulita.mp4" (1080×1918, 9:16 portrait)
//  No subtitles, no CTA — format wrappers only.

export const TOTAL_FRAMES = 356;
const DIR = "ads/ep-2011-ad-3";
const VIDEO_SRC = staticFile(`${DIR}/video final aparat celulita.mp4`);

// ==========================================================================
// 9x16 — portrait (original)
// ==========================================================================
export const Ep2011Ad3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Video
      src={VIDEO_SRC}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

// ==========================================================================
// 4x5 — Instagram/Facebook feed portrait (1080×1350)
// blurred backdrop + centered sharp portrait column (no zoom/crop)
// ==========================================================================
export const Ep2011Ad3_4x5: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Blurred background fill */}
      <Video
        src={VIDEO_SRC}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(24px) brightness(0.35)",
          transform: "scale(1.1)",
        }}
      />

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
          <Video
            src={VIDEO_SRC}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// 1x1 — square: blurred portrait bg + centered sharp portrait column
// objectFit:cover would cut ~22% top/bottom — blurred backdrop preserves subject
// ==========================================================================
export const Ep2011Ad3_1x1: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Blurred background fill */}
      <Video
        src={VIDEO_SRC}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(24px) brightness(0.35)",
          transform: "scale(1.1)",
        }}
      />

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
          <Video
            src={VIDEO_SRC}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ==========================================================================
// 16x9 — landscape: blurred portrait bg + centered sharp portrait column
// ==========================================================================
export const Ep2011Ad3_16x9: React.FC = () => {
  const { height } = useVideoConfig();
  const portraitWidth = Math.round(height * (9 / 16));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Blurred background fill */}
      <Video
        src={VIDEO_SRC}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(24px) brightness(0.35)",
          transform: "scale(1.1)",
        }}
      />

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
          <Video
            src={VIDEO_SRC}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
