<div align="center">

<img src="assets/Aemeath.png" width="120" alt="Aemeath mascot">

# Aemeath-TTS

**Can One Model Normalize and Speak?**<br>
Normalization-Aware Modeling for End-to-End Speech Synthesis

Jiecheng Liao<sup>1,2</sup>, Jialun Wu<sup>1</sup>, Zhebo Wang<sup>1,3</sup>, Jiawang Liu<sup>1</sup>, Chen Ye<sup>1</sup>, Guanjun Jiang<sup>1</sup>

<sup>1</sup>Qwen Business Unit of Alibaba · <sup>2</sup>HKUST · <sup>3</sup>Zhejiang University

**[🎧 Audio Demo](https://ffftuanxxx.github.io/Aemeath-TTS/)** · **[Results](#results)** · **[Release Status](#release-status)**

English | [简体中文](README_zh.md)

</div>

## Overview

**Aemeath-TTS** builds on Qwen3-TTS-1.7B to synthesize speech directly from raw text, without an external text normalizer. It learns to read numbers, dates, units, Markdown, and mixed Chinese–Latin content while improving reading completeness.

- **Aemeath — Learn the reading.** Jointly adapt Talker and MTP with shared acoustic targets for raw text and normalized-text anchors.
- **Everbright — Complete the reading.** Apply coverage-aware GRPO across all 16 codebooks and EOS, penalizing omissions, repetition, excessive silence, and nontermination.
- **Polestar — Track the reading.** Supervise frame-to-text-unit positions, with optional feedback. The strongest variant uses position supervision only during training.

<p align="center">
  <img src="assets/figures/overview.png" width="100%" alt="Aemeath-TTS framework: anchored acoustic adaptation, coverage-aware policy learning, and reading-position supervision">
</p>

*Framework overview from the paper. ASR, alignment, and loss branches are used only during training.*

## Results

**Reading accuracy on Aemeath-TNBench.** This human-annotated benchmark covers approximately 10k mixed-format inputs and accepts multiple valid readings. CER is measured on non-streaming outputs; scored sample counts vary from 9,424 to 9,465 because unsupported inputs are excluded per model.

| Model | TN frontend | CER (%) ↓ |
| :--- | :--- | ---: |
| TN-LLM → Qwen3-TTS Base | Learned LLM | 1.314 |
| IndexTTS2 | Off | 23.667 |
| IndexTTS2 | Native rules | 10.644 |
| CosyVoice3 | Off | 8.590 |
| VoxCPM2 | Off | 11.266 |
| FireRedTTS3 | WeText | 5.163 |
| XTTS-v2 | Native | 10.552 |
| Qwen3-TTS Base | Off | 6.398 |
| Aemeath | None | 4.293 |
| Aemeath + Everbright | None | 3.379 |
| + Polestar (position-feedback) | None | 3.591 |
| **+ Polestar (position-only)** | **None** | **3.315** |

**Batch inference efficiency.** Inverse RTF and request throughput at batch size 16, normalized to the learned-TN cascade (1×). Higher is better.

<p align="center">
  <img src="assets/figures/efficiency.png" width="320" alt="Batch-16 efficiency relative to the TN cascade: Aemeath reaches 1.34 times inverse RTF and 1.22 times throughput; Everbright reaches 1.38 and 1.19 times">
</p>

## Demo & Release

The [audio demo](https://ffftuanxxx.github.io/Aemeath-TTS/#listening) offers **20 curated examples and 180 audio clips**, with system comparisons and stage ablations. These selected examples complement the benchmark results above. See [listening notes](docs/listening.md) for selection details and local playback.

<a id="release-status"></a>

- [x] Audio demo and listening metadata
- [ ] Training and inference code
- [ ] Model checkpoints and full Aemeath-TNBench release

The full project release is in preparation. This repository currently hosts the listening demo.

<details>
<summary>Citation</summary>

```bibtex
@misc{liao2026aemeathtts,
  title  = {Aemeath-TTS: Can One Model Normalize and Speak? Normalization-Aware Modeling for End-to-End Speech Synthesis},
  author = {Jiecheng Liao and Jialun Wu and Zhebo Wang and Jiawang Liu and Chen Ye and Guanjun Jiang},
  year   = {2026},
  url    = {https://github.com/ffftuanxxx/Aemeath-TTS}
}
```

</details>

Built on [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS).
