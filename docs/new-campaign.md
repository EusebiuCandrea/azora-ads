# Procedura — Campanie Nouă Azora Ads

## START RAPID — copiază asta și adaptează

```
Campanie nouă Azora Ads.
Produs: Dispozitiv facial cu ultrasunete
Folder: public/ads/ultrasonic-face/
Descriere: [paste din Shopify]
Clipuri:
- demo-utilizare.mp4 — femeie folosind dispozitivul, 30fps
- produs-closeup.mp4 — closeup dispozitiv, 120fps 4K
Public țintă: femei 30-50 beauty enthusiasts
Durata: ~30s
Urmează procedura din docs/new-campaign.md.
```

---

## Ce trimite Admin-ul (input minim)

```
Produs nou: [Nume produs în română]
Folder: [slug-kebab-case]
Link produs: [URL Shopify] SAU descriere copiată din Shopify

Clipuri disponibile în public/ads/[folder]/:
  - fisier1.mp4 — [ce arată: persoană, produs, demo, etc.]
  - fisier2.mp4 — [fps dacă e 4K/120fps, altfel 30fps implicit]
  - audio-voice.mp3 — [dacă există voiceover generat]

Public țintă: [ex: femei 25-45 / bărbați care caută cadou / etc.]
Durata dorită: [ex: ~27s / ~30s] (opțional, implicit ~27-35s)
```

---

## Naming Convention

| Element | Regulă | Exemplu |
|---------|--------|---------|
| Folder assets | `ads/<slug>` în `/public` | `ads/bear-gift` |
| Fișier component | `src/<NumePascalCase>Ad.tsx` | `BearGiftAd.tsx` |
| Export default | `<NumePascalCase>Ad` | `BearGiftAd` |
| Composition IDs | `<NumePascalCase>Ad-9x16` etc. | `BearGiftAd-9x16` |
| Al doilea ad pe același produs | `<Slug>-ad-2`, `<NumePascalCase>Ad2` | `ep-2011-ad-2`, `FacebookAd2` |

**Slug rules:** kebab-case, max 3 cuvinte, fără "azora" prefix.
`bear-gift` ✅ `ep-2011` ✅ `azora-bear-gift` ❌ `bearGift` ❌

---

## Ce face Claude automat (fără să fie cerut)

1. **Citește** CLAUDE.md + fișierul component existent cel mai recent ca referință
2. **Generează** timing table (segmente video + subtitluri) bazat pe clipuri și durata dorită
3. **Scrie** scriptul voiceover sincronizat cu frame-urile
4. **Creează** `src/<Nume>Ad.tsx` complet cu toate 4 formatele
5. **Înregistrează** toate 4 `<Composition>` în `Root.tsx`
6. **Actualizează** CLAUDE.md secțiunea Active Campaigns

---

## Reguli fixe (nu se negociază)

- `paddingBottom: Math.round(height * 0.225)` — safe zone Meta, via `useVideoConfig()`
- 4:5 → `objectFit: cover` zoom direct
- 1:1 și 16:9 → blurred backdrop + portrait centrat (`height * 9/16` lățime)
- Subtitluri în **română cu diacritice corecte** (ș ț ă î â)
- `<Video>` mereu cu `objectFit: "cover"`
- `trimBefore` în **secunde**, durate în **frames la 30fps**
- `playbackRate={0.25}` doar pe clipuri 120fps 4K
- CTA overlay ultimele ~6s, watermark de la f0 până la CTA

---

## Template prompt de lipit în sesiune nouă

### Exemplu completat (copiază și adaptează)

```
Campanie nouă Azora Ads.
Produs: Dispozitiv facial cu ultrasunete
Folder: public/ads/ultrasonic-face/
Descriere: [paste din Shopify]
Clipuri:
- demo-utilizare.mp4 — femeie folosind dispozitivul, 30fps
- produs-closeup.mp4 — closeup dispozitiv, 120fps 4K
Public țintă: femei 30-50 beauty enthusiasts
Durata: ~30s
Urmează procedura din docs/new-campaign.md.
```

### Template gol (de completat)

```
Campanie nouă Azora Ads.

Produs: [NUME]
Folder: public/ads/[SLUG]/
Descriere produs (Shopify): """
[PASTE DESCRIERE]
"""

Clipuri:
- [fisier.mp4] — [descriere, ex: "femeie demonstrând dispozitivul, 30fps"]
- [fisier2.mp4] — [descriere, ex: "closeup produs, 120fps 4K"]
- [audio-voice.mp3] — voiceover generat ElevenLabs (dacă există)

Public țintă: [EX: femei 25-45 interesate de beauty]
Durata: ~[X]s

Urmează procedura din docs/new-campaign.md.
Creează componentul complet + înregistrează în Root.tsx.
```

---

## Checklist complet campanie

### Pregătire assets
- [ ] Folder `public/ads/<slug>/` creat cu toate clipurile
- [ ] Clipuri verificate: rezoluție, fps (important pentru playbackRate)
- [ ] Audio voiceover generat în ElevenLabs și salvat ca `audio-voice.mp3`
- [ ] Logo/watermark brand deja în `public/brand/` (nu se copiază din nou)

### Component
- [ ] `src/<Nume>Ad.tsx` creat cu `const DIR = "ads/<slug>"`
- [ ] Timing table comentat la top (segmente + subtitluri în frames)
- [ ] `TOTAL_FRAMES` definit
- [ ] Toate clipurile au `objectFit: "cover"`
- [ ] `paddingBottom: Math.round(height * 0.225)` în SubtitleBlock
- [ ] Subtitluri în română cu diacritice
- [ ] CTA overlay ultimele ~6s
- [ ] Watermark activ de la f0 la start CTA
- [ ] Export: default (9:16) + `_4x5` + `_1x1` (blurred backdrop) + `_16x9` (blurred backdrop)

### Root.tsx
- [ ] Import adăugat
- [ ] 4 `<Composition>` înregistrate cu dimensiunile corecte:
  - `9x16` → 1080 × 1920
  - `4x5` → 1080 × 1350
  - `1x1` → 1080 × 1080
  - `16x9` → 1920 × 1080

### Preview & render
- [ ] `npm run dev` — verificat vizual toate 4 formatele
- [ ] Subtitluri nu sunt acoperite de UI Meta în preview
- [ ] `npx remotion render <Nume>Ad-4x5 out/<slug>-4x5.mp4` — format primar
- [ ] Celelalte 3 formate randate

### Documentație
- [ ] CLAUDE.md secțiunea Active Campaigns actualizată cu timing table + subtitluri

---

## Timing table format standard

```
//  Segment 1 | f0   – f90   | 3s  | clip1.mp4 — descriere
//  Segment 2 | f90  – f270  | 6s  | clip2.mp4 @0.25x — slow-mo 4K
//  Segment 3 | f270 – f450  | 6s  | clip3.mp4 trimBefore=2
//  CTA       | f[X] – f[Y]  | 6s  | clip_cta.mp4 trimBefore=7
```

```
//  Subtitles:
//  f5  – f88  | "Linia 1 hook"           | "Linia 2 gold"
//  f93 – f180 | "Linia 1"                | "Linia 2"
```

---

## Structura voiceover (pentru ElevenLabs)

- **Voce:** bărbat, cald/conversational, 30-40 ani, română nativă
- **Stil:** nu comercial/formal — prieten care dă sfat
- **Sincronizare:** fiecare pereche de linii = un subtitle block din cod
- **Gap înainte de CTA:** adaugă linie bridge dacă gap > 2s (ex: "Un produs pe care nu-l uiți.")
- **SSML pause:** `<break time="1s"/>` între blocuri dacă ElevenLabs suportă

Structura script:
```
[Linia hook 1]
[Linia hook 2]

[Bloc 2 linia 1]
[Bloc 2 linia 2]

...

[Linia bridge opțională înainte de CTA]

[CTA tagline]
[CTA call to action]
```
