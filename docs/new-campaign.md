# Ghid complet — Campanie Nouă Azora Ads

> Urmează pașii **în ordine**. Fiecare pas depinde de cel anterior.

---

## PASUL 1 — Scrie scriptul de subtitluri

**Fișier:** `scripts/<slug>.subs.txt`

Scrie perechile de linii în română. Fiecare pereche = un bloc de subtitle.
Linie goală = separator între blocuri. `CTA_START` marchează unde apare overlay-ul CTA.

```
Cauți cadoul perfect pentru ea?
Unul pe care chiar nu-l va uita.

Pentru momentul în care vrei să spui…
"Vrei să fii a mea?"

E greu să găsești ceva
care să spună tot ce simți.

Există un cadou 2-în-1 care face fix asta —
trandafir etern care nu se ofilește niciodată.

Și în interior, ascuns…
un colier cu inimi împletite.

Va plânge când îl deschide.

CTA_START
Acum cu -28% reducere, stoc limitat.
Comandă acum pe Azora.ro!
```

**Reguli script:**
- Maxim 2 linii per bloc (line1 alb, line2 auriu `#D4AF37`)
- Linie unică → lasă line2 goală
- Textul de după `CTA_START` e citit de Whisper doar pentru a detecta frame-ul de start CTA
- Română cu diacritice corecte: ș ț ă î â

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

Folosește `BearGiftAd.tsx` ca referință completă. Structura obligatorie:

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
const BearGiftVideos: React.FC = () => (
  <>
    {/* f0–f75 | hook — zoom 6%, drift dreapta */}
    <Sequence from={0} durationInFrames={75}>
      <ZoomVideo src={staticFile(`${DIR}/clip1.mp4`)} duration={75} zoomAmount={0.06} driftX={12} style={ZOOM_STYLE} />
    </Sequence>
    {/* f75–f165 | ... */}
    ...
  </>
);
```

**Reguli segmente video:**
- Cuts la fiecare **2.5–3s** (75–90 frames)
- `zoomAmount`: 0.06 hook, 0.04 middle, 0.02–0.03 CTA bg
- `driftX` alternant: +12, -8, +8, -8, +6, -6, +4
- `driftY={-6}` pe slow-mo în loc de driftX
- `playbackRate={0.25}` **doar** pe clipuri 120fps 4K
- **Dacă folosești același clip de 2 ori:** asigură-te că `trimBefore` al doilea e valid (verifică cu ffprobe)

### 4c — Copiază codul de subtitluri din scriptul de sync

Copiază outputul din Pasul 3 în funcția `BearGiftAdOverlay`.

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

{/* ~f450: mid-video soft CTA */}
<Sequence from={450} durationInFrames={60}>
  <MidCTAHint />
</Sequence>

{/* Watermark până la CTA start */}
<Sequence from={0} durationInFrames={CTA_START}>
  <DynamicWatermark />
</Sequence>

{/* CTA overlay ultimele ~6s */}
<Sequence from={CTA_START} durationInFrames={TOTAL_FRAMES - CTA_START}>
  <CTAOverlay
    tagline={"Cadoul perfect —\nprodus + beneficiu"}
    discountLabel="-28% AZI"   {/* opțional, elimină dacă nu e discount */}
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
- [ ] Subtitlurile apar **în același timp** cu vocea (nu înainte, nu după)
- [ ] Niciun clip negru sau freeze (trimBefore depășit)
- [ ] ask-for-engage sau clipuri speciale apar la momentul narativ corect
- [ ] Textul nu e acoperit de UI Meta (safe zone 22.5% bottom)
- [ ] CTA overlay apare când vocea tace (după ultimul subtitle)
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

### ❌ Subtitlul "Vrei să fii a mea?" dispare prea repede
Extinde `durationInFrames` al blocului să acopere durata clipului video asociat (nu durata din audio).

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
- voce-[slug].mp3 — voiceover generat ElevenLabs

Scriptul subtitluri: scripts/[slug].subs.txt (deja creat)

Public țintă: [ex: femei 25-45 interesate de cadouri romantice]
Durata: ~30s

Citește docs/new-campaign.md și urmează pașii în ordine.
```
