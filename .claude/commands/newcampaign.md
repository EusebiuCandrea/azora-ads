---
name: newcampaign
description: Ghidează pas cu pas crearea unei campanii noi Azora Ads — pune întrebări despre produs, clipuri, voiceover, preț, reducere, și creează automat toate fișierele necesare.
---

# Skill: /newcampaign — Campanie Nouă Azora Ads

Când utilizatorul invocă `/newcampaign`, urmezi acest proces **strict în ordine**. Pune **o singură întrebare pe mesaj**. Așteaptă răspunsul înainte să treci la următoarea.

---

## ÎNAINTE de a pune întrebări

Citește `docs/new-campaign.md` pentru context complet și reguli.

---

## ÎNTREBĂRI (în ordine)

### Q1 — Numele produsului
> "Cum se numește produsul? (ex: Urs de pluș cu trandafir, Dispozitiv facial EP-2011)"

Salvează ca: `PRODUCT_NAME`

---

### Slug — auto-generat (nu pune întrebare)

Din `PRODUCT_NAME`, generează automat `SLUG` astfel:
1. Lowercase, înlocuiește diacriticele (ș→s, ț→t, ă→a, î→i, â→a)
2. Înlocuiește spațiile cu `-`, elimină caracterele speciale
3. Păstrează primele 3 cuvinte semnificative (ignoră "cu", "si", "și", "de", "al", "a")
4. Verifică dacă `public/ads/<slug>/` există deja (cu `ls public/ads/`) — dacă da, adaugă un sufix de 4 caractere random alfanumerice: `<slug>-<xxxx>`

Exemplu: "Ursulet cu Trandafir Etern si Colier" → `ursulet-trandafir-etern`

Salvează ca: `SLUG` (fără să întrebi utilizatorul)

---

### Pas pregătire — Creează folderul și adaugă clipurile

Înainte de a întreba despre clipuri, **creează folderul** cu `mkdir -p public/ads/<SLUG>/` și spune utilizatorului:

> "Am creat folderul `public/ads/<SLUG>/`. Acum adaugă acolo toate clipurile video pe care vrei să le folosești în ad (mp4-urile brute de pe telefon/cameră).
>
> Când ai terminat, scrie-mi lista lor cu o scurtă descriere și fps-ul dacă știi:
> - `demo.mp4` — femeie demonstrând dispozitivul
> - `closeup-4k.mp4` — closeup produs, 120fps 4K
>
> (implicit 30fps dacă nu știi; 120fps doar dacă e 4K slow-mo)"

**Așteaptă confirmarea** că utilizatorul a adăugat clipurile.

### Q3 — Clipuri disponibile

După ce utilizatorul confirmă că a adăugat clipurile, listează ce există în folder cu `ls public/ads/<SLUG>/` și afișează lista fișierelor găsite. Întreabă:

> "Am găsit aceste fișiere în folder: [lista]. Adaugă o scurtă descriere pentru fiecare și fps-ul dacă știi (120fps doar dacă e 4K slow-mo, altfel implicit 30fps)."

Salvează ca: `CLIPS`

---

### Q4 — Voiceover
> "Ai deja fișierul audio voiceover (`voce-<slug>.mp3` în folder)? (da / nu — dacă nu, îl generăm după ce scriem scriptul)"

Dacă **da** → salvează calea, treci la Q5.
Dacă **nu** → notează că scriptul de subtitluri trebuie scris primul, voiceover generat după.

---

### Q5 — Preț
> "Vrei să afișezi prețul în CTA overlay? (da / nu)"

Dacă **da** → întreabă:
> "Care e prețul? (ex: `249 RON`) Și ai un preț vechi tăiat? (ex: `399 RON`, sau lasă gol dacă nu)"

Salvează ca: `CURRENT_PRICE`, `ORIGINAL_PRICE` (poate fi gol)

---

### Q6 — Reducere badge
> "Vrei badge-ul de reducere roșu în CTA? (ex: `-28% AZI`, sau nu)"

Salvează ca: `DISCOUNT_LABEL` (poate fi gol/absent)

---

### Q7 — Public țintă
> "Cine e publicul țintă? (ex: femei 25-45 cadouri romantice / bărbați care caută cadou de logodnă)"

Salvează ca: `TARGET_AUDIENCE`

---

### Q8 — Durata
> "Durata dorită pentru video? (implicit ~30s, sau specifică altceva)"

Salvează ca: `DURATION` (implicit 900 frames = 30s)

---

### Q9 — Textul de start (HookTextOverlay)
> "Care sunt cele 3 linii scurte care apar în primele 1.5s pe ecran — textul mare, de impact?
>
> **Important:** trebuie să fie **diferit** de voiceover — un mesaj vizual complementar, nu repetarea a ceea ce se aude.
> Max 3–4 cuvinte per linie. (ex: 'Redă-ți / SILUETA / de dinainte' sau 'Cel mai bun / CADOU / pentru ea')"

Salvează ca: `HOOK_TEXT` (3 linii: `line1`, `line2`, `line3`)

---

### Q10 — Scriptul voiceover
> "Ai deja un script pentru voiceover, sau să te ajut eu să scriu unul?"

- Dacă **are script** → îl salvează ca `VOICEOVER_SCRIPT`, trece mai departe.
- Dacă **vrea ajutor** → pune întrebarea:

> "Trimite-mi descrierea produsului — poți lipi textul direct sau un link către pagina de produs (Shopify, site, etc.)."

  - Dacă trimite **link** → folosește WebFetch pentru a extrage descrierea, beneficiile și specificațiile.
  - Dacă trimite **text** → folosește direct.
  - Pe baza descrierii + `TARGET_AUDIENCE` + `DURATION`, scrie scriptul structurat PAS (Problem–Agitate–Solution), cu `CTA_START` marcat.
  - Afișează scriptul și întreabă: "Îți place sau vrei să ajustez ceva?"
  - **Așteaptă confirmarea/ajustările** înainte să treacă mai departe.

Salvează ca: `VOICEOVER_SCRIPT`, `PRODUCT_DESCRIPTION`

---

## DUPĂ toate răspunsurile — REZUMAT

Afișează un rezumat compact:

```
📋 Campanie nouă:
  Produs:       [PRODUCT_NAME]
  Folder:       public/ads/[SLUG]/
  Clipuri:      [lista]
  Voiceover:    [da/nu — calea sau "de generat"]
  Preț:         [CURRENT_PRICE] (vechi: [ORIGINAL_PRICE])
  Reducere:     [DISCOUNT_LABEL]
  Public:       [TARGET_AUDIENCE]
  Durata:       [DURATION]
  Hook text:    [HOOK_TEXT line1 / line2 / line3]
  Script:       [primele 10 cuvinte din VOICEOVER_SCRIPT...]
```

Întreabă: **"Totul e corect? Pot să încep?"**

Dacă da → treci la EXECUȚIE.
Dacă nu → corectează ce e greșit și arată rezumatul din nou.

---

## EXECUȚIE (după confirmare)

Urmează pașii din `docs/new-campaign.md` în ordine:

### Pas 1 — Script subtitluri
Dacă voiceover-ul NU există încă:
- Scrie `scripts/[SLUG].subs.txt` din `VOICEOVER_SCRIPT` confirmat, formatat cu blocuri de 2 linii + `CTA_START`
- Spune utilizatorului: "Generează voiceover-ul în ElevenLabs din textul de mai jos, salvează-l ca `public/ads/[SLUG]/voce-[SLUG].mp3`, apoi spune-mi când e gata."
- **Așteaptă confirmarea** că fișierul audio e salvat.

Dacă voiceover-ul EXISTĂ:
- Rulează: `python3 scripts/sync-subtitles.py public/ads/[SLUG]/voce-[SLUG].mp3 scripts/[SLUG].subs.txt`

### Pas 2 — Verifică duratele clipurilor
```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 public/ads/[SLUG]/clip.mp4
```
Rulează pentru fiecare clip cu `trimBefore` planificat.

### Pas 3 — Creează componenta
Citește `docs/new-campaign.md` secțiunea **Pasul 4** și **Referință rapidă — Componente reutilizabile** pentru structura de cod. Dacă ai nevoie de un exemplu concret de sintaxă, citește cel mai recent fișier `src/*Ad.tsx` din proiect (folosește `ls -t src/*Ad.tsx | head -1` pentru a-l găsi) — **doar pentru structura de cod**: imports, SubtitleBlock, ZoomVideo, blurred backdrop pattern. **Nu copia clipuri, subtitluri, timing-uri sau conținut specific** — acestea sunt ale campaniei noi.

Creează `src/[NumePascalCase]Ad.tsx` complet cu:
- `TOTAL_FRAMES`, `DIR`, `FADE_OUT`
- `[Name]Videos` cu Ken Burns + drift alternant — segmente bazate pe clipurile și duratele REALE ale campaniei noi
- `[Name]AdOverlay` cu subtitluri din sync script + HookTextOverlay + MidCTAHint + DynamicWatermark + CTAOverlay (cu CURRENT_PRICE, ORIGINAL_PRICE, DISCOUNT_LABEL dacă sunt setate)
- Export 9x16 (default), `_4x5` (alias), `_1x1` (blurred backdrop), `_16x9` (blurred backdrop)
- **Blurred backdrop** trebuie să oglindească exact segmentele din `[Name]Videos` — dacă schimbi un clip, actualizează și în `_1x1` și `_16x9`

### Pas 4 — Înregistrează în Root.tsx
Adaugă import + 4 `<Composition>` cu dimensiunile corecte.

### Pas 5 — Confirmă
Spune utilizatorului:
> "Gata! Rulează `npm run dev` și verifică în preview toate 4 formatele. Când ești mulțumit, rulează render-ul."

Afișează comenzile de render gata de copiat:
```bash
npx remotion render [Name]Ad-4x5  out/[slug]-4x5.mp4
npx remotion render [Name]Ad-9x16 out/[slug]-9x16.mp4
npx remotion render [Name]Ad-1x1  out/[slug]-1x1.mp4
npx remotion render [Name]Ad-16x9 out/[slug]-16x9.mp4
```
