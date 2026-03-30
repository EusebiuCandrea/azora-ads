# Azora Ads — Remotion Video Campaigns

## Project Purpose

Remotion (React-based) project for rendering social media video ads for **Azora.ro** — a Romanian e-commerce store selling beauty/wellness devices and gift products. Each ad campaign produces 4 format variants rendered as MP4 via `npx remotion render`, published on Facebook, Instagram, and TikTok.

**Tech stack:** Remotion 4.0 · React 19 · TypeScript · Tailwind v4
**Key packages:** `@remotion/media` (Video, trimBefore, playbackRate), `@remotion/transitions` (TransitionSeries, fade, linearTiming)
**Assets:** all in `/public`, referenced with `staticFile('...')`

---

## Format Variants

Every campaign must export these 4 compositions:

| Variant   | Size        | Ratio | Composition suffix | Rendering approach                                          |
|-----------|-------------|-------|--------------------|------------------------------------------------------------|
| **Feed**  | 1080 × 1350 | 4:5   | `-4x5`             | **PRIMARY.** `objectFit: cover` zoom — crop is only ~15% top/bottom, fills frame naturally. |
| Portrait  | 1080 × 1920 | 9:16  | `-9x16`            | Native format — no crop needed. Reels, TikTok, Stories.     |
| Square    | 1080 × 1080 | 1:1   | `-1x1`             | **Blurred backdrop** + centered portrait column — crop would be ~22% top/bottom, too aggressive. |
| Landscape | 1920 × 1080 | 16:9  | `-16x9`            | **Blurred backdrop** + centered portrait column.            |

**Blurred-backdrop pattern** (1:1 and 16:9): blurred + darkened full-bleed video as background, centered sharp portrait video column (`height × 9/16` wide) on top. Reference: `BearGiftAd_16x9`, `BearGiftAd_1x1`.

---

## Creative Strategy — Research-Based Rules (STRICT)

> These rules come from performance data on Meta video ads 2024–2025. They are **mandatory** for all new campaigns. Do not deviate without explicit user instruction.

### Video Duration
- **Gift/emotional products (ursulet, bijuterie, cadou):** 15–20 seconds sweet spot. Use **450 frames (15s)** as default for new short-form campaigns.
- **Products requiring explanation (gadgets, skincare):** 30–35s maximum. Never exceed 60s for conversion campaigns.
- **Reels 9:16:** Target 7–15s. Algorithm rewards loop views — a 12s video watched 3× = 36s engagement signal.
- **Stories 9:16:** 6–10s per card. Drop-off is massive after 8s on a single card.

### Hook — First 3 Seconds (CRITICAL)
- **Text must appear at f0** — never delay the hook. No animated logo intros.
- **Show the product OR a strong emotional trigger in the first 3 seconds.** For impulse-buy products: product first. For emotional products: problem/desire hook first, product reveal at 3–8s.
- **Thumb-stop rate target: >30%.** If the first 3s don't create curiosity or surprise, the algorithm stops distributing.
- Pattern interrupt techniques that work:
  - Large bold centered text on f0 (scale pop-in animation)
  - Extreme close-up of the product in slow-mo as first clip
  - Direct question: "Cauți cadoul perfect pentru ea?"
  - Breaking fourth wall: "Stai, nu da scroll încă..."
  - Shocking number/stat: "87% din cupluri uită să..."

### Subtitle / Caption Style
- **Pill background on text** (`rgba(0,0,0,0.65)`, `borderRadius: 16px`) increases readability ~40% vs text-on-gradient. Preferred for new campaigns.
- **Native caption style** (karaoke word-by-word or block sync with audio) increases watch time 12–28%.
- **Text animation: pop-in** — `scale(0.7→1)` with `Easing.out(Easing.back(1.5))` + simultaneous fade-in (8 frames). NOT slow typewriter or rotation.
- Each subtitle block: minimum 1.5s on screen, maximum 3–4s. Change text in sync with video cuts.
- Safe zone: `height * 0.225` paddingBottom — unchanged.

### Video Pacing
- **Emotional/gift products:** cut every **2–2.5s** (60–75 frames). NOT 3s as in older campaigns.
- **Never more than 5s without a visual change** (cut, zoom, new text, or in-frame motion).
- **Ken Burns:** zoom 6% per clip for hook clips, 4% for middle, 2–3% for CTA background. More aggressive than earlier campaigns.
- **Slow-motion:** max 2–3 continuous seconds. Use for product detail (texture, jewelry catch light, reaction moments). Never on clips with active text overlays.
- **Do not use Ken Burns** on clips that already have strong internal motion — causes motion sickness.

### Gradients
- **Avoid heavy full-height bottom gradients** (old style: `rgba(...) 0%–70%`). They look corporate and trigger ad-blindness.
- If a gradient is needed for text legibility, limit to **25–30% of canvas height** directly under the text area.
- Preferred alternative: pill background on text + `DepthVignette` for cinematic depth.

### CTA Overlay
- **Appear at 70–80% of video duration.** For 15s video: CTA at f270–f300 (9–10s).
- CTA must remain visible for **minimum 3 seconds** (last frame is most-viewed due to loop).
- **Add logistic benefit to CTA button text:** "Comandă acum — livrare în 24h" converts 15–25% better than generic "Comandă acum".
- FOMO/urgency text ("Stoc limitat") works but use only if true — damages brand trust long-term if false.

### Emotional Triggers for Gift Products
- Show the **recipient's reaction** (unboxing, surprise), not just the product — simulates joy for buyer.
- "Frica de a dezamăgi" hook: "Nu știi ce să-i dai?" validates anxiety, positions product as safe choice.
- Nostalgia angle (warm colors, soft lighting) works for plush toys and handmade gifts.
- Social proof text ("X clienți mulțumiți") reduces perceived risk for products >80–100 RON.

### UGC vs Polished
- For **cold audience (prospecting):** "Polished UGC" hybrid — quality production but informal aesthetic (no corporate gradients, native caption style, real voice).
- For **retargeting (warm audience):** testimonial-style overlays ("X mame au ales asta în 2024").
- Pure polished/studio style only for premium products >200 RON or brand awareness.
- Rotate creatives every **7–10 days** — CTR drops 20–40% after that window.

---

## Conventions

### Timing
- All durations in **frames at 30 fps** (1 s = 30 frames).
- Comment every `<Sequence>` with its time range: `{/* f0–f90: hook (0–3 s) */}`.
- Add a global timing table at the top of each ad file.

### Video clips
- `objectFit: "cover"` on every `<Video>` — fills the frame, auto-crops.
- `trimBefore` is in **seconds** (not frames).
- `playbackRate={0.25}` **only** on 120 fps 4K clips for slow-motion; normal 30 fps clips get no playbackRate.
- Use CSS `transform: "scale() translateY()"` to zoom in / hide watermarks at edges.

### Subtitles
- Two-line captions via `<SubtitleBlock>`: white `line1` + gold `line2` (`#D4AF37`).
- Fade-out: 12 frames before `Sequence` end (`FADE_OUT = 12`).
- Font weight 900, system sans-serif.
- **All subtitle text must be in Romanian.**
- **Safe zone padding:** use `height * 0.225` (22.5%) for `paddingBottom` — keeps text above Meta UI overlays (Shop Now button + profile row cover the bottom 20% on Feed placements). Get `height` via `useVideoConfig()`. Never use a fixed pixel value.

| Format | Canvas height | 22.5% padding | Meta unsafe zone |
|--------|--------------|---------------|-----------------|
| 4:5    | 1350 px      | 304 px        | 270 px (20%)    |
| 1:1    | 1080 px      | 243 px        | 216 px (20%)    |
| 9:16   | 1920 px      | 432 px        | 384 px (20%)    |

### Watermark (anti-copy)
- `<DynamicWatermark>` cycles through 6 positions every 4 s with cross-fade.
- Logo: `staticFile("brand/logo-copywrite.png")`, opacity 0.38, width 130 px.
- Visible from `f0` until CTA start (CTA covers full screen).

### CTA Overlay
- Last ~6 s of every video.
- Content: Azora logo → "Îl găsești pe" → "Azora.ro" → gold "Comandă acum" button.
- Background: `rgba(74, 27, 109, 0.82)` (brand purple).
- Logo: `staticFile("brand/azora-logo-full.png")`.

### Brand colors
| Token        | Hex         | Usage                              |
|--------------|-------------|-------------------------------------|
| Purple       | `#4A1B6D`   | Backgrounds, CTA overlay            |
| Gold         | `#D4AF37`   | Accents, CTA button, subtitle line2 |
| Dark purple  | `#0d0520`   | Dark gradient stops                 |
| Mid purple   | `#1a0533`   | Dark gradient stops                 |
| Dark navy    | `#0d1b4b`   | Dark gradient stops                 |

---

## Recommended File Structure

```
azora-ads/                          ← project root
├── public/
│   ├── brand/                      ← shared brand assets (logos, watermark)
│   │   ├── azora-logo-full.png
│   │   └── logo-copywrite.png
│   └── ads/                        ← one subfolder per campaign
│       ├── bear-gift/              ← clips + images for BearGiftAd
│       ├── ep-2011/                ← clips + images for FacebookAd
│       └── ep-2011-ad-2/           ← clips + audio for FacebookAd2
├── src/
│   ├── Root.tsx                    # All <Composition> registrations
│   ├── components/                 # Shared UI components
│   ├── scenes/                     # Reusable scene blocks (FacebookAd)
│   ├── sections/                   # Section blocks (AzoraAd)
│   ├── BearGiftAd.tsx
│   ├── FacebookAd.tsx
│   ├── FacebookAd16x9.tsx
│   └── FacebookAd2.tsx
├── CLAUDE.md
├── package.json
└── tsconfig.json
```

**Asset path convention:**
- Brand logos/watermark → `staticFile("brand/...")`
- Campaign clips → `staticFile("ads/<campaign>/...")` via `const DIR = "ads/<campaign>"` at the top of each ad file

---

## Active Campaigns

### BearGiftAd — Bear + Necklace Gift (810 frames / 27 s)

**File:** `src/BearGiftAd.tsx`
**Assets:** `public/ads/bear-gift/`
**Compositions:** `BearGiftAd-9x16`, `BearGiftAd-4x5`, `BearGiftAd-1x1`, `BearGiftAd-16x9`

| Frames    | Clip                  | Notes                                           |
|-----------|-----------------------|-------------------------------------------------|
| f0–f90    | engage.mp4            | Landscape proposal hook, objectFit cover, zoom   |
| f90–f240  | gift-handover.mp4     | Restaurant gift bag                              |
| f240–f390 | bear-closeup-4k.mp4   | 4K 120 fps @ 0.25× slow-mo                      |
| f390–f540 | cu-lantisor.mp4       | Necklace reveal, 30 fps, no playbackRate         |
| f540–f810 | bear-youtube.mp4      | CTA background, trimBefore = 7                   |

**Subtitles (Romanian):**

| Frames   | line1                                     | line2                                  |
|----------|-------------------------------------------|----------------------------------------|
| f5–f88   | Cauți cadoul perfect pentru ea?            | Unul pe care nu-l uita niciodată.      |
| f93–f180 | Cadoul perfect de logodna,                | aniversare sau nuntă.                  |
| f183–f267| Există un cadou 2-în-1                    | care spune totul fără cuvinte.         |
| f273–f390| Ursulet cu trandafir etern în piept —     | nu se ofileste niciodată.              |
| f393–f533| Colier inimi împletite                    | inclus în cutie.                       |
| f630+    | *(CTA overlay)*                           |                                        |

---

### FacebookAd — EP-2011 LED Device Ad 1 (950 frames / ~32 s)

**File:** `src/FacebookAd.tsx` + `src/FacebookAd16x9.tsx`
**Assets:** `public/ads/ep-2011/`
**Compositions:** `FacebookAd-9x16`, `FacebookAd-4x5`, `FacebookAd-1x1`, `FacebookAd-16x9`

Uses `<TransitionSeries>` with 15-frame fade transitions between 5 scenes (HookScene → ProblemScene → DemoScene → ProofScene → CTAScene).

---

### FacebookAd2 — EP-2011 LED Device Ad 2 (1055 frames / ~35 s)

**File:** `src/FacebookAd2.tsx`
**Assets:** `public/ads/ep-2011-ad-2/`
**Compositions:** `FacebookAd2-9x16`, `FacebookAd2-4x5` *(missing — add)*, `FacebookAd2-1x1`, `FacebookAd2-16x9`

Single video `final.mp4` with subtitle overlay synced to voiceover (`audio-voice.mp3`).

---

## Render Commands

```bash
# Preview
npm run dev

# Render one variant
npx remotion render BearGiftAd-4x5  out/bear-gift-4x5.mp4
npx remotion render BearGiftAd-9x16 out/bear-gift-9x16.mp4
npx remotion render BearGiftAd-1x1  out/bear-gift-1x1.mp4
npx remotion render BearGiftAd-16x9 out/bear-gift-16x9.mp4

npx remotion render FacebookAd-4x5  out/facebook-ad-4x5.mp4
npx remotion render FacebookAd-16x9 out/facebook-ad-16x9.mp4

npx remotion render FacebookAd2-9x16 out/facebook-ad2-9x16.mp4
npx remotion render FacebookAd2-16x9 out/facebook-ad2-16x9.mp4

# Render everything registered in Root.tsx
npx remotion render --all
```

---

## Adding a New Campaign — Checklist

1. **Assets** — create `public/ads/<campaign-name>/` and drop raw clips + audio there.
2. **Component** — create `src/<CampaignName>Ad.tsx`:
   - Define `const DIR = "ads/<campaign-name>"` at the top.
   - Define `TOTAL_FRAMES`, video segments with trimBefore/playbackRate, subtitle blocks.
3. **4 variants** — export default (9:16) + `_4x5`, `_1x1`, `_16x9`. Use `BearGiftAd.tsx` as the full pattern.
4. **Root.tsx** — register all 4 `<Composition>` entries with correct width/height.
5. **Preview** — `npm run dev`, adjust frame timings.
6. **Render** — `npx remotion render <id> out/<filename>.mp4`.
7. **Update this file** — add the campaign under *Active Campaigns* with segments + subtitle tables.

---

## Claude Code Prompt — paste at session start

```
I'm working on "azora-ads", a Remotion project for Azora.ro video ad campaigns.
Project path: /Users/Eusebiu1/Desktop/azora-ads
Read CLAUDE.md first for full context, then read the relevant .tsx file before any edits.

Key rules:
- All timing in frames at 30 fps. 1 second = 30 frames.
- trimBefore is in SECONDS, not frames.
- Subtitles in Romanian — two lines: white line1 + gold (#D4AF37) line2.
- objectFit: "cover" on all <Video> components.
- 4:5 (1080 × 1350) is the primary Meta format — make it look perfect.
- Every campaign exports 4 formats: 9x16, 4x5, 1x1, 16x9.
- 16:9 = blurred portrait backdrop + centered sharp portrait column (see BearGiftAd_16x9).
- DynamicWatermark from f0 → CTA start. CTA overlay covers last ~6 s.
- Brand: purple #4A1B6D, gold #D4AF37.
- Brand assets (logos, watermark) in public/brand/. Campaign clips in public/ads/<campaign>/.
- Each ad file has const DIR = "ads/<campaign>" at the top.
- After edits, verify Root.tsx compositions are registered with correct dimensions.
```
