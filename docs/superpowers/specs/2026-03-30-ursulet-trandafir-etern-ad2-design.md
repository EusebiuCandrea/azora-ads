---
name: UrsuletTrandafirEternAd2 — Short-Form 15s Template
description: New 15-second Meta ad template for Ursulet Trandafir Etern campaign, research-based design with pill subtitles, product-first hook, no heavy gradient
type: project
---

# UrsuletTrandafirEternAd2 — Design Spec

**Data:** 2026-03-30
**Campanie:** Ursuleț Trandafir Etern
**Fișier:** `src/UrsuletTrandafirEternAd2.tsx`
**Assets:** `public/ads/ursulet-trandafir-etern/` (aceleași ca Ad1)
**Durată:** 450 frames / 15s la 30fps

---

## Motivație

Template-ul existent (`UrsuletTrandafirEternAd`) are 22s, gradient greu la bottom, text care apare cu delay, și cuts la 3s. Conform datelor de performanță Meta 2024-2025:
- **Sweet spot conversie:** 15–20s pentru produse cadou
- **Hook în primele 3s** este determinant pentru distribuția algoritmului (thumb-stop rate target >30%)
- **Gradient corporatist** declanșează ad-blindness
- **Pill background** pe text crește lizibilitatea cu ~40%
- **Pacing 2–2.5s/clip** menține atenția mai bine decât 3s

---

## Structura temporală

```
TOTAL_FRAMES = 450  (15s)
CTA_START    = 300  (10s)
FADE_OUT     = 12
```

### Video segments

| Frame     | Durată | Clip                    | Notă                                    |
|-----------|--------|-------------------------|-----------------------------------------|
| f0–f60    | 2s     | `bear-closeup-4k.mp4`   | 120fps @0.25x slow-mo — PRODUS PRIMUL  |
| f60–f135  | 2.5s   | `gift-handover.mp4`     | Context emoțional restaurant            |
| f135–f210 | 2.5s   | `montova-gift.mp4`      | Produs pe masă                          |
| f210–f300 | 3s     | `cu-lantisor.mp4`       | Reveal lănțișor — cel mai impactant    |
| f300–f450 | 5s     | `gift-handover.mp4` t=5 | Background CTA, trimBefore=5 (10.87s clip, 5.87s disponibil) |

**Ken Burns:**
- Hook (f0–f60): `zoomAmount=0.06`, `driftY=-6` (slow-mo → driftY nu driftX)
- Middle clips: `zoomAmount=0.04`, `driftX` alternant ±8
- CTA bg: `zoomAmount=0.02`, `driftX=-4`

### Subtitle blocks (sync cu `voce-ursulet-trandafir-etern.mp3`)

Voiceover-ul existent durează ~18s — folosim primele ~10s (conținut) + audio se oprește natural înainte de CTA sau se suprapune subtil.

| Frame      | Durată | line1                            | line2                              |
|------------|--------|----------------------------------|------------------------------------|
| f0–f69     | 2.3s   | "Nu-i mai lua un cadou banal."   | —                                  |
| f69–f146   | 2.6s   | "Florile se ofilesc."            | "Cadourile se uită."               |
| f148–f196  | 1.6s   | "Acesta nu."                     | —                                  |
| f196–f300  | 3.5s   | "Ursuleț cu trandafir etern —"   | "un colier cu inimi împletite."    |

---

## Componente noi

### `PillSubtitleBlock` (definit local în Ad2.tsx)

Înlocuiește `SubtitleBlock` din Ad1. Diferențe cheie:

```
Background: rgba(0,0,0,0.65), borderRadius: 16px, padding: 12px 28px
Animație intrare: spring({ damping: 12, stiffness: 200, mass: 0.5 }) → scale 0.7→1
Opacity intrare: interpolate(frame, [0, 8], [0, 1])
Fade-out: ultimele FADE_OUT=12 frames
Poziție: bottom, paddingBottom = height * 0.225 (safe zone Meta)
line1: alb #FFFFFF, fontWeight 900
line2: auriu #D4AF37, fontWeight 900
```

**Primul bloc apare la f0** (hook imediat, line1Delay=0) — nu la f5 ca în Ad1.

### Overlay stack (față de Ad1)

| Element           | Ad1                           | Ad2 (nou)                     |
|-------------------|-------------------------------|-------------------------------|
| Bottom gradient   | ✅ 70% height, greu           | ❌ Eliminat                   |
| Top gradient      | ✅ 18% height                 | ✅ Păstrat, subtil (18%)      |
| DepthVignette     | ✅                            | ✅ Păstrat                    |
| SubtitleBlock     | ✅ text cu shadow pe gradient | ❌ Înlocuit cu PillSubtitleBlock |
| HookTextOverlay   | ✅ 3 linii top-of-screen      | ❌ Eliminat — primul Pill IS hook-ul |
| MidCTAHint        | ✅ la f300                    | ✅ la f225 (50% din 450f)     |
| DynamicWatermark  | ✅ f0→CTA_START               | ✅ f0→CTA_START (f300)        |
| CTAOverlay        | ✅ generic                    | ✅ + `ctaText="Comandă acum — livrare în 24h"` |

---

## CTA Overlay

- **Start:** f300 (10s) — 70% din durată
- **Durată:** 150 frames (5s) — minim 3s vizibil garantat
- **Text buton:** `"Comandă acum — livrare în 24h"` (+15–25% CTR față de generic)
- **Tagline:** `"Ursuleț cu trandafir etern +\ncolier cu inimi împletite"`
- **discountLabel:** `"-28% AZI"`
- **prețuri:** originalPrice `"209 RON"`, currentPrice `"149 RON"`

---

## 4 Formate

| Export                          | Dimensiune  | Abordare               |
|---------------------------------|-------------|------------------------|
| `UrsuletTrandafirEternAd2`      | 1080×1920   | 9:16 default           |
| `UrsuletTrandafirEternAd2_4x5`  | 1080×1350   | Identic cu 9:16        |
| `UrsuletTrandafirEternAd2_1x1`  | 1080×1080   | Blurred backdrop       |
| `UrsuletTrandafirEternAd2_16x9` | 1920×1080   | Blurred backdrop       |

Blurred backdrop: `filter: "blur(22px) brightness(0.35)"`, oglindit exact după Ad2Videos timing.

---

## Zoom styles

```tsx
const ZOOM_CLOSEUP = { width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.1)" }
const ZOOM_GIFT    = { width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.35) translateY(-9%)" }
const ZOOM_MONTOVA = { width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12) translateY(10%)" }
const ZOOM_STD     = { width: "100%", height: "100%", objectFit: "cover" }
```

---

## Root.tsx — Înregistrare

```tsx
<Composition id="UrsuletTrandafirEternAd2-4x5"  component={UrsuletTrandafirEternAd2_4x5}  durationInFrames={450} fps={30} width={1080} height={1350} />
<Composition id="UrsuletTrandafirEternAd2-9x16" component={UrsuletTrandafirEternAd2}       durationInFrames={450} fps={30} width={1080} height={1920} />
<Composition id="UrsuletTrandafirEternAd2-1x1"  component={UrsuletTrandafirEternAd2_1x1}   durationInFrames={450} fps={30} width={1080} height={1080} />
<Composition id="UrsuletTrandafirEternAd2-16x9" component={UrsuletTrandafirEternAd2_16x9}  durationInFrames={450} fps={30} width={1920} height={1080} />
```

---

## Criterii de succes

- [ ] Thumb-stop rate >30% (hook f0–f3s: produs în slow-mo + pill text imediat)
- [ ] Niciun gradient greu la bottom
- [ ] Text apare la f0 fără delay
- [ ] Cuts la 2–2.5s (nu 3s)
- [ ] CTA cu "livrare în 24h"
- [ ] Toate 4 formatele redau corect
