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

### Q9 — Tema emoțională / Hook
> "Care e emoția principală sau mesajul hook pentru primele 3 secunde? (ex: logodnă și surpriză / îngrijire de sine / cadou unic)
>
> Aceasta va deveni textul HookTextOverlay — 3 linii scurte, impact maxim."

Salvează ca: `HOOK_THEME`

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
  Hook tema:    [HOOK_THEME]
```

Întreabă: **"Totul e corect? Pot să încep?"**

Dacă da → treci la EXECUȚIE.
Dacă nu → corectează ce e greșit și arată rezumatul din nou.

---

## EXECUȚIE (după confirmare)

Urmează pașii din `docs/new-campaign.md` în ordine:

### Pas 1 — Script subtitluri
Dacă voiceover-ul NU există încă:
- Scrie `scripts/[SLUG].subs.txt` bazat pe HOOK_THEME și structura PAS (Problem-Agitate-Solution)
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
Creează `src/[NumePascalCase]Ad.tsx` complet cu:
- `TOTAL_FRAMES`, `DIR`, `FADE_OUT`
- `[Name]Videos` cu Ken Burns + drift alternant
- `[Name]AdOverlay` cu subtitluri din sync script + HookTextOverlay + MidCTAHint + DynamicWatermark + CTAOverlay (cu CURRENT_PRICE, ORIGINAL_PRICE, DISCOUNT_LABEL dacă sunt setate)
- Export 9x16 (default), `_4x5` (alias), `_1x1` (blurred backdrop), `_16x9` (blurred backdrop)

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
