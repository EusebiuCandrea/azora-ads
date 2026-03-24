#!/usr/bin/env python3
"""
sync-subtitles.py v2 — Sincronizare robustă cu Whisper segments (nu word matching).

Față de v1, folosește Whisper segments ca ancoră principală.
Elimină false matches pe cuvinte scurte românești și bug-ul line2_delay.

Usage:
  python3 scripts/sync-subtitles.py <audio_file> <subtitle_script_file> [--model=medium]

Exemple:
  python3 scripts/sync-subtitles.py \\
    public/ads/ursulet-trandafir-etern/voce-ursulet-trandafir-etern.mp3 \\
    scripts/ursulet-trandafir-etern.subs.txt

Format fișier subtitle (.subs.txt):
  # Comentariile încep cu #
  # Linii goale separă blocurile (max 2 linii per bloc)
  # CTA_START marchează începutul overlay-ului CTA

  Cauți cadoul perfect pentru ea?
  Unul pe care nu-l uiți niciodată.

  CTA_START
  -28% reducere. Stoc limitat.

Requirements:
  pip install openai-whisper
"""

import sys
import json
import subprocess
import unicodedata
import re
import os

FPS = 30
SEQ_LEAD_FRAMES = 8     # frames de lead-in înainte de speech
SEQ_TRAIL_FRAMES = 10   # frames după speech end
SEGMENT_WINDOW = 8      # câte segmente Whisper căutăm per bloc
MATCH_THRESHOLD = 0.25  # scor minim Jaccard acceptabil

MIN_1LINE = 45   # 1.5s — previne flash-uri prea scurte
MIN_2LINE = 75   # 2.5s — timp suficient pentru 2 linii
MAX_1LINE = 105  # 3.5s — previne pauze fără text


# ---------------------------------------------------------------------------
# Text utils
# ---------------------------------------------------------------------------

def normalize(text):
    """Lowercase, fără diacritice, fără punctuație → lista de tokens."""
    text = text.lower().strip()
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return text.split()


def token_overlap(text_a, text_b):
    """Jaccard pe seturi de tokens. Mai robust decât character similarity pe cuvinte scurte."""
    a = set(normalize(text_a))
    b = set(normalize(text_b))
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def char_similarity(a, b):
    """Similaritate caracter-cu-caracter (pentru word matching în fereastră)."""
    if not a or not b:
        return 0.0
    common = sum(x == y for x, y in zip(a, b))
    return common / max(len(a), len(b))


# ---------------------------------------------------------------------------
# Segment matching (ancora principală)
# ---------------------------------------------------------------------------

def find_block_in_segments(segments, line1, line2, from_seg_idx=0, min_start_frame=0):
    """
    Găsește segmentele Whisper care se potrivesc cel mai bine cu blocul (line1 + line2).

    FIX față de v1: returnează best_start_seg (nu best_end_seg+1) astfel încât
    mai multe blocuri pot fi extrase din același segment Whisper.
    Segmentele deja consumate (end_frame <= min_start_frame) sunt sărite automat.

    Returnează (start_frame, end_frame, next_from_seg_idx, best_score).
    """
    block_text = (line1 + " " + line2).strip()

    # Sări segmentele deja consumate de blocurile anterioare
    actual_from = from_seg_idx
    while actual_from < len(segments) and segments[actual_from]["end_frame"] <= min_start_frame:
        actual_from += 1

    if actual_from >= len(segments):
        last = segments[-1]
        return last["end_frame"], last["end_frame"] + 60, actual_from, 0.0

    best_score = -1
    best_start_seg = actual_from
    best_end_seg = actual_from

    limit = min(actual_from + SEGMENT_WINDOW, len(segments))

    for i in range(actual_from, limit):
        score = token_overlap(segments[i]["text"], block_text)
        if score > best_score:
            best_score = score
            best_start_seg = i
            best_end_seg = i

        if i + 1 < limit:
            combined = segments[i]["text"] + " " + segments[i + 1]["text"]
            score2 = token_overlap(combined, block_text)
            if score2 > best_score:
                best_score = score2
                best_start_seg = i
                best_end_seg = i + 1

    # start_frame clamped la min_start_frame — previne overlap cu blocul anterior
    start_frame = max(segments[best_start_seg]["start_frame"], min_start_frame)
    end_frame = segments[best_end_seg]["end_frame"]

    # Returnăm best_start_seg (nu best_end_seg+1) — permite mai multor blocuri
    # să fie extrase din același segment Whisper
    return start_frame, end_frame, best_start_seg, best_score


# ---------------------------------------------------------------------------
# line2 delay — căutare STRICT în fereastra blocului curent
# ---------------------------------------------------------------------------

def find_line2_frame_in_window(words, line2, window_start_frame, window_end_frame):
    """
    Caută prima apariție a lui line2 în fereastra [window_start_frame, window_end_frame].
    Returnează frame-ul de start, sau None dacă nu găsește nimic cu scor > 0.5.

    Bug-ul v1: căuta de la index 0 în toată lista — FIXED.
    """
    line2_tokens = normalize(line2)
    if not line2_tokens:
        return None

    first_token = line2_tokens[0]

    # Filtrăm doar cuvintele din fereastra de timp a blocului curent
    window_words = [
        w for w in words
        if window_start_frame <= w["start_frame"] <= window_end_frame
    ]

    best_score = -1
    best_frame = None

    for w in window_words:
        for tok in normalize(w["word"]):
            score = char_similarity(first_token, tok)
            if score > best_score:
                best_score = score
                best_frame = w["start_frame"]

    if best_score < 0.5:
        return None
    return best_frame


# ---------------------------------------------------------------------------
# Parsare .subs.txt
# ---------------------------------------------------------------------------

def parse_subtitle_script(script_file):
    with open(script_file) as f:
        raw_lines = [l.rstrip() for l in f.readlines()]

    blocks = []
    current = []
    cta_index = None

    for line in raw_lines:
        if line.startswith("#") or (not line and not current):
            continue
        if line.strip() == "CTA_START":
            if current:
                blocks.append(tuple(current))
                current = []
            cta_index = len(blocks)
            continue
        if not line:
            if current:
                blocks.append(tuple(current))
                current = []
        else:
            current.append(line.strip())

    if current:
        blocks.append(tuple(current))

    return blocks, cta_index


# ---------------------------------------------------------------------------
# Whisper
# ---------------------------------------------------------------------------

def get_whisper_data(audio_file, model="medium"):
    """Rulează Whisper și returnează (segments, words)."""
    print(f"[sync] Transcriere: {audio_file}")
    print(f"[sync] Model: {model} — recomandat 'large-v3' pentru română mai precisă")

    out_dir = os.path.dirname(os.path.abspath(audio_file))
    subprocess.run(
        [
            "whisper", audio_file,
            "--language", "Romanian",
            "--output_format", "json",
            "--word_timestamps", "True",
            "--model", model,
            "--output_dir", out_dir,
        ],
        check=True,
        capture_output=True,
    )
    base = os.path.splitext(os.path.basename(audio_file))[0]
    json_path = os.path.join(out_dir, base + ".json")
    with open(json_path) as f:
        data = json.load(f)
    os.remove(json_path)

    segments = []
    words = []
    for seg in data["segments"]:
        segments.append({
            "text": seg["text"].strip(),
            "start": seg["start"],
            "end": seg["end"],
            "start_frame": round(seg["start"] * FPS),
            "end_frame": round(seg["end"] * FPS),
        })
        for w in seg.get("words", []):
            words.append({
                "word": w["word"].strip(),
                "start": w["start"],
                "end": w["end"],
                "start_frame": round(w["start"] * FPS),
                "end_frame": round(w["end"] * FPS),
            })

    return segments, words


# ---------------------------------------------------------------------------
# Generare cod Remotion
# ---------------------------------------------------------------------------

def generate_remotion_code(blocks, segments, words, cta_index, fps=FPS):
    output = []
    output.append("    {/* ── SUBTITLE BLOCKS — sync-subtitles.py v2 (segment-based) ── */}")
    output.append(f"    {{/* Whisper: {len(segments)} segmente, {len(words)} cuvinte */}}\n")

    from_seg_idx = 0
    prev_seq_end = 0

    for i, block in enumerate(blocks):
        if cta_index is not None and i == cta_index:
            break

        line1 = block[0] if len(block) > 0 else ""
        line2 = block[1] if len(block) > 1 else ""
        is_2line = bool(line2)

        speech_start, speech_end, from_seg_idx, score = find_block_in_segments(
            segments, line1, line2, from_seg_idx, min_start_frame=prev_seq_end
        )

        warn = ""
        if score < MATCH_THRESHOLD:
            warn = f" [WARN] scor slab {score:.2f} — verifică manual"
            print(f"  [WARN] Bloc {i+1} scor {score:.2f}: '{line1}'")
        else:
            print(f"  [OK]   Bloc {i+1} scor {score:.2f}: '{line1[:40]}' → f{speech_start}–f{speech_end}")

        # seq_from: lead-in, dar nu înainte de blocul anterior
        seq_from = max(prev_seq_end, max(0, speech_start - SEQ_LEAD_FRAMES))
        seq_end_raw = speech_end + SEQ_TRAIL_FRAMES

        # Durate minime
        min_dur = MIN_2LINE if is_2line else MIN_1LINE
        seq_end = max(seq_end_raw, seq_from + min_dur)

        # Durată maximă pentru 1 linie
        if not is_2line:
            seq_end = min(seq_end, seq_from + MAX_1LINE)

        seq_duration = seq_end - seq_from

        if seq_duration <= 0:
            print(f"  [ERROR] Bloc {i+1} durată invalidă ({seq_duration}f). Setat la 60f.")
            seq_duration = 60

        # line2_delay: caută în fereastra [speech_start, speech_end] — FIXED față de v1
        line2_delay = 0
        if is_2line:
            l2_frame = find_line2_frame_in_window(words, line2, speech_start, speech_end)
            if l2_frame is not None:
                line2_delay = max(0, l2_frame - seq_from)
                print(f"         line2_delay={line2_delay}f (f{l2_frame}): '{line2[:40]}'")
            else:
                # Fallback: jumătatea blocului de speech
                line2_delay = max(0, (speech_end - speech_start) // 2)
                print(f"         line2_delay estimat={line2_delay}f (fallback): '{line2[:40]}'")

        prev_seq_end = seq_end

        t_s = speech_start / fps
        output.append(f"    {{/* f{seq_from}–f{seq_end} | {t_s:.2f}s | Bloc {i+1}{warn} */}}")
        output.append(f"    <Sequence from={{{seq_from}}} durationInFrames={{{seq_duration}}}>")
        output.append(f"      <SubtitleBlock")
        output.append(f'        line1="{line1}"')
        output.append(f'        line2="{line2}"')
        output.append(f"        totalDuration={{{seq_duration}}}")
        output.append(f"        line1Delay={{0}}")
        output.append(f"        line2Delay={{{line2_delay}}}")
        output.append(f"        line1Size={{50}}")
        output.append(f"        line2Size={{50}}")
        output.append(f"      />")
        output.append(f"    </Sequence>\n")

    # CTA start
    if cta_index is not None and cta_index < len(blocks):
        cta_block = blocks[cta_index]
        cta_line = cta_block[0] if cta_block else ""
        cta_start_frame, _, _, _ = find_block_in_segments(segments, cta_line, "", from_seg_idx)
        cta_start_frame = max(0, cta_start_frame - 5)
        output.append(f"    {{/* Watermark activ până la CTA */}}")
        output.append(f"    <Sequence from={{0}} durationInFrames={{{cta_start_frame}}}>")
        output.append(f"      <DynamicWatermark />")
        output.append(f"    </Sequence>\n")
        output.append(f"    {{/* f{cta_start_frame}+ | CTA overlay */}}")
        output.append(f"    <Sequence from={{{cta_start_frame}}} durationInFrames={{TOTAL_FRAMES - {cta_start_frame}}}>")
        output.append(f"      <CTAOverlay />")
        output.append(f"    </Sequence>")
    else:
        output.append(f"    <Sequence from={{0}} durationInFrames={{TOTAL_FRAMES}}>")
        output.append(f"      <DynamicWatermark />")
        output.append(f"    </Sequence>")

    return "\n".join(output)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def write_to_tsx(tsx_file, code):
    """
    Înlocuiește blocul dintre SUBTITLE_BLOCKS_START și SUBTITLE_BLOCKS_END în fișierul TSX.
    Dacă markerii lipsesc, afișează un warning și nu modifică fișierul.
    """
    START_MARKER = "{/* ── SUBTITLE_BLOCKS_START ── */}"
    END_MARKER = "{/* ── SUBTITLE_BLOCKS_END ── */}"

    with open(tsx_file, "r") as f:
        content = f.read()

    if START_MARKER not in content or END_MARKER not in content:
        print(f"[WARN] Markerii SUBTITLE_BLOCKS_START/END lipsesc din {tsx_file}.")
        print("[WARN] Adaugă manual în fișier:")
        print(f"  {START_MARKER}   ← înainte de primul <Sequence> de subtitlu")
        print(f"  {END_MARKER}     ← după ultimul </Sequence> de subtitlu")
        return False

    start_idx = content.index(START_MARKER)
    end_idx = content.index(END_MARKER) + len(END_MARKER)

    # Indentare: preluăm spațiile de dinainte de marker
    line_start = content.rfind("\n", 0, start_idx) + 1
    indent = ""
    for ch in content[line_start:start_idx]:
        if ch in (" ", "\t"):
            indent += ch
        else:
            break

    new_block = f"{START_MARKER}\n{code}\n\n    {END_MARKER}"
    new_content = content[:start_idx] + new_block + content[end_idx:]

    with open(tsx_file, "w") as f:
        f.write(new_content)

    print(f"[sync] Scris direct în: {tsx_file}")
    return True


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    audio_file = sys.argv[1]
    script_file = sys.argv[2]
    model = "medium"
    tsx_file = None
    for arg in sys.argv[3:]:
        if arg.startswith("--model="):
            model = arg.split("=")[1]
        elif arg.startswith("--write="):
            tsx_file = arg.split("=", 1)[1]

    if not os.path.exists(audio_file):
        print(f"[ERROR] Audio nu există: {audio_file}")
        sys.exit(1)
    if not os.path.exists(script_file):
        print(f"[ERROR] Script nu există: {script_file}")
        sys.exit(1)

    blocks, cta_index = parse_subtitle_script(script_file)
    print(f"[sync] {len(blocks)} blocuri găsite, CTA la indexul {cta_index}")

    segments, words = get_whisper_data(audio_file, model)
    print(f"[sync] {len(segments)} segmente Whisper, {len(words)} cuvinte\n")

    # Afișează segmentele detectate — util pentru a verifica calitatea transcrierii
    print("[sync] Segmente Whisper detectate:")
    for idx, seg in enumerate(segments):
        print(f"  [{idx:02d}] {seg['start']:.2f}s–{seg['end']:.2f}s | f{seg['start_frame']}–f{seg['end_frame']} | \"{seg['text']}\"")

    print("\n[sync] Potrivire blocuri:")
    print("="*60)
    code = generate_remotion_code(blocks, segments, words, cta_index)

    if tsx_file:
        if not os.path.exists(tsx_file):
            print(f"[ERROR] TSX nu există: {tsx_file}")
            sys.exit(1)
        write_to_tsx(tsx_file, code)
    else:
        print("\n" + "="*60)
        print("REMOTION CODE — copiază în overlay-ul tău (sau folosește --write=<fișier.tsx>):")
        print("="*60 + "\n")
        print(code)

    print("\n" + "="*60)
    total_frames_suggestion = segments[-1]["end_frame"] + 10
    print(f"TOTAL_FRAMES sugerat: {total_frames_suggestion} ({segments[-1]['end']:.1f}s + buffer)")
    print(f"Sfat: rulează cu --model=large-v3 pentru timestamps mai precise pe română.")
    print("="*60)


if __name__ == "__main__":
    main()
