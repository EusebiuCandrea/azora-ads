# Ghid complet — Campanie Nouă Azora Ads

> Urmează pașii **în ordine**. Fiecare pas depinde de cel anterior.
> Regulile din secțiunea **Creative Strategy** (CLAUDE.md) sunt obligatorii pentru orice campanie nouă.

---

## REFERINȚĂ CREATIVĂ — Meta Video Ads 2024-2025

> Aceasta este referința strictă bazată pe date de performanță. **Nu devia fără motiv explicit.**

### Durata video

| Format | Durata optimă | Note |
|--------|--------------|------|
| Feed 4:5 | **15–20s** pentru produse cadou | Sweet spot conversie |
| Reels 9:16 | **7–15s** | CPM cu 20–35% mai mic; algoritmul recompensează loop-ul |
| Stories 9:16 | **6–10s/card** | Drop-off masiv după 8s pe un singur card |
| Produse complexe | max 30–35s | Gadgeturi, skincare cu claim-uri. Niciodată >60s pentru conversie |

**Default pentru campanii noi: 450 frames (15s).**

### Hook — Primele 3 secunde (CRITIC)

- **Textul apare la f0** — fără delay, fără animație de intro cu logo
- **Thumb-stop rate țintă: >30%** — dacă primele 3s nu creează curiozitate, algoritmul oprește distribuția
- **Produse impulse-buy:** produsul în primul frame. **Produse emoționale:** hook problemă/dorință → reveal produs la 3–8s
- Tehnici pattern interrupt cu performanță ridicată:
  - Text mare bold centrat la f0 cu animație pop-in (scale 0.7→1, back easing, 8 frames)
  - Extreme close-up produs în slow-mo ca primul clip
  - Întrebare directă: *"Cauți cadoul perfect pentru ea?"*
  - Breaking fourth wall: *"Stai, nu da scroll încă..."*
  - Cifră/statistică: *"87% din cupluri uită să..."*

### Text overlays — Stilul care convertește

- **Pill background** (`rgba(0,0,0,0.65)`, `borderRadius: 16px`) în loc de gradient greu — crește lizibilitatea cu ~40%
- **Animație pop-in:** `scale(0.7→1)` + fade simultan (8 frames, `Easing.out(Easing.back(1.5))`)
- Durata unui bloc de text: **minim 1.5s, maxim 3–4s** pe ecran
- Schimbarea textului — sincronizată cu cut-ul video, nu la mijlocul unui clip
- **Native caption style** (karaoke sync cu audio) crește watch time cu 12–28%

### Pacing video

- **Produse cadou/emoționale:** cut la **2–2.5s** (60–75 frames) — NU 3s ca în campaniile vechi
- Niciodată >5s fără schimbare vizuală (cut, zoom, text nou sau mișcare în cadru)
- **Ken Burns:** 6% zoom pe hook, 4% middle, 2–3% pe CTA background — mai agresiv decât anterior
- **Slow-motion:** max 2–3s continuu. Pentru detalii produs (textură, lumina pe bijuterie). NU pe clipuri cu text activ

### Gradiente

- **Evită gradienți grei full-height** (stilul vechi `rgba(...) 0%–70%`) — par corporate, declanșează ad-blindness
- Dacă e necesar gradient: **max 25–30% din înălțimea canvas-ului**, doar sub text
- Preferat: pill background pe text + `DepthVignette` pentru adâncime cinematică

### CTA

- Apare la **70–80% din durată** (pentru 15s: f270–f300)
- Rămâne vizibil **minim 3s** (ultimul frame e cel mai vizionat datorită loop-ului)
- **Text buton cu beneficiu logistic:** *"Comandă acum — livrare în 24h"* (+15–25% CTR față de CTA generic)
- Urgență (*"Stoc limitat"*) funcționează dar nu o folosi dacă nu e reală — deteriorează încrederea

### Triggere emoționale — produse cadou

- Arată **reacția primitorului** (unboxing, surpriză) — nu doar produsul. Cumpărătorul simulează bucuria celuilalt.
- Hook *"frica de a dezamăgi"*: *"Nu știi ce să-i dai?"* → validează anxietatea, produsul = soluția sigură
- Nostalgie (culori calde, lumină moale) — eficient pentru plusuri și cadouri handmade
- Proof social (*"X clienți mulțumiți"*) — esențial pentru produse >80–100 RON

### UGC vs Polished

| Audiență | Abordare recomandată | CTR mediu |
|----------|---------------------|-----------|
| Cold (prospecting) | Polished UGC — calitate medie, estetica informală, voce reală | 1.4–2.2% |
| Warm (retargeting) | Testimonial style + CTA urgent | 1.8–2.8% |
| Premium (>200 RON) | Polished production | 0.9–1.5% |

**"Polished UGC":** calitate tehnică bună, dar fără gradienți corporatiști, cu subtitrare nativă și voce reală.
Rotează creativele la **7–10 zile** — CTR scade 20–40% după această fereastră.

### Benchmark-uri de performanță (referință)

| Metrică | Valoare bună | Valoare excelentă |
|---------|-------------|-------------------|
| Thumb-stop rate (>3s) | >30% | >40% |
| CTR Feed | >1.2% | >1.8% |
| CTR Reels | >1.5% | >2.5% |
| CVR (click→cumpărare) | >2% | >3.5% |
| View-through 75%+ | >8% | >15% |

---

---

## PASUL 1 — Scrie scriptul de subtitluri

**Fișier:** `scripts/<slug>.subs.txt`

Scrie perechile de linii în română. Fiecare pereche = un bloc de subtitle.
Linie goală = separator între blocuri. `CTA_START` marchează unde apare overlay-ul CTA.

```
Hook — prima frază care captează atenția?

Linie de tensiune sau problemă.
Linie de agravare sau context.

Beneficiu principal al produsului —
ce îl face unic.

Al doilea beneficiu.
Detaliu suplimentar.

Concluzie emoțională scurtă.

CTA_START
Acum cu reducere, stoc limitat.
Comandă acum pe Azora.ro!
```

**Reguli script:**
- Maxim 2 linii per bloc (line1 alb, line2 auriu `#D4AF37`)
- Linie unică → lasă line2 goală
- Textul de după `CTA_START` e citit de Whisper doar pentru a detecta frame-ul de start CTA
- Română cu diacritice corecte: ș ț ă î â
- **Durata voiceover:** pentru campanii 15s, voiceover-ul de conținut trebuie să fie maxim 9–10s (CTA acoperă ultimele 5–6s fără voce)
- **Primul bloc = hook puternic** — problemă, întrebare directă, sau pattern interrupt. Textul apare la f0.

---

## PASUL 2 — Generează voiceover în ElevenLabs

Copiază **doar textul** din subs.txt (fără `CTA_START`, fără comentarii `#`) în ElevenLabs.

**Setări recomandate:**
- Voce: bărbat, cald/conversational, română nativă
- Stability: 0.5, Similarity: 0.75, Style: 0.3
- Salvează ca: `public/ads/<slug>/voce-<slug>.mp3`

**Verifică durata:** audio-ul trebuie să fie cu câteva secunde mai scurt decât durata video dorită (CTA overlay acoperă ultimele ~6s fără voiceover principal).

---

## PASUL 3 — Sincronizează subtitlurile cu audio (Whisper)

```bash
python3 scripts/sync-subtitles.py \
  public/ads/<slug>/voce-<slug>.mp3 \
  scripts/<slug>.subs.txt
```

**Re-sync direct în fișierul TSX (opțional):**

Adaugă markerii în componenta `.tsx`, în jurul blocurilor de subtitluri:
```tsx
{/* ── SUBTITLE_BLOCKS_START ── */}
... (toate <Sequence> de subtitluri) ...
{/* ── SUBTITLE_BLOCKS_END ── */}
```

Apoi rulează cu `--write`:
```bash
python3 scripts/sync-subtitles.py \
  public/ads/<slug>/voce-<slug>.mp3 \
  scripts/<slug>.subs.txt \
  --write=src/<NumePascalCase>Ad.tsx
```

Scriptul înlocuiește automat tot ce e între markeri. Fără angle brackets `<>` — treci calea directă.

**Ce face scriptul:**
- Rulează Whisper pentru word-level timestamps
- Generează `<Sequence>/<SubtitleBlock>` blocks gata de copiat în cod
- **Auto-detectează** când Whisper inversează 2 linii și le swap-uiește automat
- **Previne suprapunerea** blocurilor consecutive

**Output important:**
- `TOTAL_FRAMES sugerat: 894` → rotunjește la multiplu de 30 (ex: 900)
- `[AUTO-SWAP] Bloc X` → script-ul a corectat automat ordinea liniilor
- `[WARN] Potrivire slabă` → verifică manual acel bloc
- `[ERROR] durată invalidă` → fix manual necesar (vezi Probleme Comune mai jos)

---

## PASUL 4 — Creează componenta video

**Fișier nou:** `src/<NumePascalCase>Ad.tsx`

Structura obligatorie (citește un ad existent pentru pattern-ul de cod, nu pentru conținut specific):

```tsx
const TOTAL_FRAMES = 900; // din TOTAL_FRAMES sugerat de script
const DIR = "ads/<slug>";
const FADE_OUT = 12;
```

### 4a — Verifică durata clipurilor înainte de trimBefore

```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 public/ads/<slug>/clip.mp4
```

⚠️ **Nu folosi `trimBefore` mai mare decât durata clipului** — va produce un ecran negru.

### 4b — Structura video segments

```tsx
const <Name>Videos: React.FC = () => (
  <>
    {/* f0–f90 | hook — zoom 6%, drift dreapta */}
    <Sequence from={0} durationInFrames={90}>
      <ZoomVideo src={staticFile(`${DIR}/clip1.mp4`)} duration={90} zoomAmount={0.06} driftX={12} style={ZOOM_STYLE} />
    </Sequence>
    {/* f90–f... | ... */}
    ...
  </>
);
```

**Reguli segmente video:**
- Cuts la fiecare **2–2.5s** (60–75 frames) — NU 3s. Pacing mai rapid = mai mult engagement
- `zoomAmount`: 0.06 hook, 0.04 middle, 0.02–0.03 CTA bg
- `driftX` alternant: +12, -8, +8, -8, +6, -6, +4
- `driftY={-6}` pe slow-mo în loc de driftX
- `playbackRate={0.25}` **doar** pe clipuri 120fps 4K
- **Primul clip = produsul** (close-up sau slow-mo reveal) pentru campanii short-form 15s
- **Slow-mo:** max 2–3s continuu; NU pe clipuri cu text activ pe ecran
- **Dacă folosești același clip de 2 ori:** asigură-te că `trimBefore` al doilea e valid (verifică cu ffprobe)

### 4c — Copiază codul de subtitluri din scriptul de sync

Copiază outputul din Pasul 3 în funcția `<Name>AdOverlay`, între markerii `SUBTITLE_BLOCKS_START` și `SUBTITLE_BLOCKS_END`.

**Verifică după copiere:**
1. Niciun `durationInFrames` negativ sau zero
2. `from` al Bloc N >= `from + durationInFrames` al Bloc N-1 (fără overlap)
3. `totalDuration` în SubtitleBlock = `durationInFrames` din Sequence

### 4d — Overlay standard (același pe toate campaniile)

```tsx
{/* f0–f48: hook text pattern interrupt */}
<Sequence from={0} durationInFrames={48}>
  <HookTextOverlay line1="..." line2="..." line3="..." />
</Sequence>

{/* Mid-video soft CTA — la ~50% din durată, NU fix la f450 pentru campanii scurte */}
{/* Ex: campanie 15s (450f) → MidCTAHint la f225; campanie 22s (660f) → f330 */}
<Sequence from={Math.round(TOTAL_FRAMES * 0.5)} durationInFrames={60}>
  <MidCTAHint />
</Sequence>

{/* Watermark până la CTA start */}
<Sequence from={0} durationInFrames={CTA_START}>
  <DynamicWatermark />
</Sequence>

{/* CTA overlay ultimele 5–6s */}
{/* Text buton: "Comandă acum — livrare în 24h" (+15-25% CTR față de CTA generic) */}
<Sequence from={CTA_START} durationInFrames={TOTAL_FRAMES - CTA_START}>
  <CTAOverlay
    tagline={"Numele produsului —\nbeneficiu principal"}
    discountLabel="-X% AZI"   {/* opțional, elimină dacă nu e discount */}
    ctaText="Comandă acum — livrare în 24h"
  />
</Sequence>

<Audio src={staticFile(`${DIR}/voce-<slug>.mp3`)} />
```

### 4e — Exportă 4 formate

```tsx
// 9x16 — default
export const MyAd: React.FC = () => ( ... );

// 4x5 — identic cu 9x16 (objectFit:cover face crop automat)
export const MyAd_4x5 = MyAd;

// 1x1 și 16x9 — blurred backdrop + portrait centrat
export const MyAd_1x1: React.FC = () => {
  // Blurred backdrop: aceleași clipuri ca MyVideos, cu:
  //   filter: "blur(22px) brightness(0.35)"
  // Centered sharp portrait: <MyVideos /> + <MyAdOverlay />
};
export const MyAd_16x9: React.FC = () => { /* identic cu _1x1 */ };
```

⚠️ **Blurred backdrop trebuie să oglindească exact segmentele din MyVideos** — dacă adaugi/schimbi un clip în MyVideos, actualizează și în \_1x1 și \_16x9.

---

## PASUL 5 — Înregistrează în Root.tsx

```tsx
import { MyAd, MyAd_4x5, MyAd_1x1, MyAd_16x9 } from "./MyAd";

// În RemotionRoot:
<Composition id="MyAd-4x5"  component={MyAd_4x5}  durationInFrames={900} fps={30} width={1080} height={1350} />
<Composition id="MyAd-9x16" component={MyAd}       durationInFrames={900} fps={30} width={1080} height={1920} />
<Composition id="MyAd-1x1"  component={MyAd_1x1}   durationInFrames={900} fps={30} width={1080} height={1080} />
<Composition id="MyAd-16x9" component={MyAd_16x9}  durationInFrames={900} fps={30} width={1920} height={1080} />
```

---

## PASUL 6 — Preview și ajustări

```bash
npm run dev
```

**Ce verifici:**
- [ ] **Hook f0–f3s: oprește scroll-ul?** Text sau produs apare imediat, fără delay
- [ ] Subtitlurile apar **în același timp** cu vocea (nu înainte, nu după)
- [ ] Niciun clip negru sau freeze (trimBefore depășit)
- [ ] Clipurile apar la momentul narativ corect față de voiceover
- [ ] Textul nu e acoperit de UI Meta (safe zone 22.5% bottom)
- [ ] **Pacing:** niciun clip nu durează >5s fără schimbare vizuală
- [ ] **Gradienți:** nu există bottom gradient mai înalt de 30% din canvas
- [ ] CTA overlay apare când vocea tace (după ultimul subtitle)
- [ ] **CTA text include beneficiu logistic** ("livrare în 24h")
- [ ] Toate 4 formatele arată bine

**Ajustare timing subtitluri:**
- Textul apare prea devreme → mărește `from` cu 15–30 frames
- Textul apare prea târziu → micșorează `from` cu 15–30 frames
- Textul dispare prea repede → mărește `durationInFrames` (și `totalDuration`)

---

## PASUL 7 — Render final

```bash
npx remotion render MyAd-4x5  out/<slug>-4x5.mp4
npx remotion render MyAd-9x16 out/<slug>-9x16.mp4
npx remotion render MyAd-1x1  out/<slug>-1x1.mp4
npx remotion render MyAd-16x9 out/<slug>-16x9.mp4
```

---

## Probleme comune

### ❌ `durationInFrames` negativ în output script
Whisper a inversat liniile. **Scriptul nou face swap automat** (`[AUTO-SWAP]`). Dacă totuși apare `[ERROR]`, fix manual: calculează `from` = `max(prev_bloc_end, linia_mai_devreme - 15)`.

### ❌ Textul se suprapune cu blocul anterior
Setează `from` al blocului curent >= `from + durationInFrames` al blocului anterior.

### ❌ `totalDuration` și `durationInFrames` diferite
`totalDuration` din `<SubtitleBlock>` trebuie să fie **identic** cu `durationInFrames` din `<Sequence>`. Scriptul le setează automat identic.

### ❌ Ecran negru pe un segment video
`trimBefore` depășește durata clipului. Verifică durata cu `ffprobe` și reduce `trimBefore`.

### ❌ Clipul 1x1 sau 16x9 e dezsinronizat față de 9x16
Blurred backdrop din `_1x1`/`_16x9` nu reflectă segmentele din MyVideos. Actualizează ambele.

### ❌ Un subtitlu dispare prea repede
Extinde `durationInFrames` al blocului să acopere durata clipului video asociat (nu doar durata din audio).

---

## Referință rapidă — Formate

| Format | ID suffix | Width | Height | Notă |
|--------|-----------|-------|--------|------|
| Feed principal | `-4x5` | 1080 | 1350 | Cel mai important — face cover automat |
| Reels/TikTok | `-9x16` | 1080 | 1920 | Native portrait |
| Square | `-1x1` | 1080 | 1080 | Blurred backdrop obligatoriu |
| Landscape | `-16x9` | 1920 | 1080 | Blurred backdrop obligatoriu |

## Referință rapidă — Componente reutilizabile

| Componentă | Import | Folosire |
|------------|--------|---------|
| `ZoomVideo` | `./components/ZoomVideo` | Ken Burns + drift pe orice clip |
| `DepthVignette` | `./components/DepthVignette` | Prim element în overlay stack |
| `HookTextOverlay` | `./components/HookTextOverlay` | f0–f48, text pattern interrupt |
| `MidCTAHint` | `./components/MidCTAHint` | ~f450, pill auriu subtil |
| `DynamicWatermark` | `./components/DynamicWatermark` | f0 → CTA start |
| `CTAOverlay` | `./components/CTAOverlay` | Ultimele ~6s |
| `SubtitleBlock` | definit local în Ad.tsx | 2 linii sincronizate cu audio |
| `TextOverlay` | `./components/TextOverlay` | Text cu spring animation |

---

## Template prompt pentru sesiune nouă

```
Campanie nouă Azora Ads.

Produs: [NUME PRODUS]
Folder: public/ads/[slug-kebab]/
Descriere (Shopify): """
[PASTE DESCRIERE]
"""

Clipuri disponibile:
- clip1.mp4 — [ce arată, 30fps sau 120fps 4K]
- clip2.mp4 — [ce arată]
- voce-[slug].mp3 — voiceover generat ElevenLabs (~9-10s pentru campanie 15s)

Scriptul subtitluri: scripts/[slug].subs.txt (deja creat)

Public țintă: [ex: femei 25-45 interesate de cadouri romantice]
Audiență: [cold/prospecting sau warm/retargeting]
Durata: 15s (450 frames) — default pentru campanii noi

Citește docs/new-campaign.md (secțiunea REFERINȚĂ CREATIVĂ + pașii în ordine).
Respectă strict regulile din Creative Strategy din CLAUDE.md.
```
