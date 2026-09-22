# Aemeath-TTS: 20 Curated Listening Demos

After extracting the full ZIP, open **`index.html`** in a desktop browser. No dependency install, backend, network, or NAS access is required. Keep `audio/`, `assets/`, and `index.html` in the same relative layout. Do not preview only a single HTML file directly from a compressed archive.

## What is included

- **System comparison: 12 examples.** Each includes 11 systems/variants: Aemeath, Everbright, Polestar (position-only / position-feedback), Qwen3-TTS Base, IndexTTS2 (TN off/on), fixed CosyVoice3, VoxCPM2, FireRedTTS3 (WeText), and XTTS-v2.
- **Stage & module comparisons: 8 examples.** Each includes 6 variants: Base, Aemeath, Everbright, acoustic control (step-matched), position-only, and position-feedback.
- **20 unique samples, 180 original WAV files** in total.
- Sample search, previous/next navigation, A→B continuous playback, expandable source text, and expandable ASR transcripts are supported.
- `listening.json` is a standalone manifest with sample IDs, grouping, titles, input, references, and per-variant ASR/WAV paths (no codec tokens).

## Selection policy

These are **curated strength-showcase examples**, not random samples and not a replacement for full benchmark metrics.

- System comparison examples were manually selected from 287 eligible candidates across 12 different text scenarios.
- Ablation examples were selected from 148 eligible candidates.
- The selections come from a previously frozen 9,415-item diagnostic subset, without re-screening or replacing benchmark sources.
- Raw text, references, and ASR entries were cross-checked with cached scoring outputs.
- Copied WAV files were hash-verified against source files.

`CER=0` does **not** guarantee perfect perceptual quality. This package does not claim full human line-by-line listening certification.

## Model/version notes

- **Aemeath:** full E4 SFT, step 92,420.
- **Everbright:** GRPO coverage training, step 8,000.
- **Polestar:** reading-position, step 9,061; both position variants are shown.
- **Acoustic control:** same-budget acoustic continuation training from the same Everbright checkpoint.
- **CosyVoice3:** rerun with a compatibility-fixed full formal pipeline (not legacy invalid branches).
- **IndexTTS2:** TN off and TN on are both kept.
- **FireRedTTS3:** WeText frontend kept.

No regeneration, clipping, denoising, loudness tuning, speed changes, or external model parameter replacement was applied.

## Files

```text
index.html                 Offline demo page
styles.css / app.js        Styling and interaction
data.js                    Sample data required by the page
audio/                     180 WAV files, named as "<sampleID>__<model>.wav"
assets/                    Three provided logos
listening.json             Compact listening manifest
metadata/scores.csv        Per-clip CER, edits, and duration
metadata/provenance.json   Selection rules, source records, and file hashes
metadata/validation.json   File integrity and browser checks
```
