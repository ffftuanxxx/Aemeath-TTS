# Aemeath-TTS：20 条精选听测 Demo

解压完整 ZIP 后，用桌面浏览器打开 **`index.html`**。不需要安装依赖、启动后端、联网或访问原始 NAS。请保留 `audio/`、`assets/` 与 HTML 的相对位置；不能只从压缩包里预览一个 HTML 文件。

v2 更新：页面隐藏 Aemeath 系列及 acoustic control 的 CER；系统对比的 Quick A/B 默认选择 IndexTTS2（TN on）。移除顶部选例说明、两项指定的 FAQ 和页脚说明文字。原始样本、音频和归档评分保留。

## 页面内容

- **System comparison：12 条。** 每条 11 个系统/变体，包括 Aemeath、Everbright、Polestar 的 position-only / position-feedback、Qwen3-TTS Base、IndexTTS2 TN 开/关、修复后的 CosyVoice3、VoxCPM2、FireRedTTS3 WeText 和 XTTS-v2。
- **Stage & module comparisons：8 条。** 每条 6 个版本：Base、Aemeath、Everbright、匹配步数的 acoustic control、position-only、position-feedback。
- 共 **20 个不重复样本、180 个原始 WAV**。各模型比较使用同一条 raw input，不把不同文本放在一起比较。
- 支持样本搜索、前后切换、A→B 连续试听、展开原文、展开 ASR 转写。一个播放器开始时，其他播放器自动暂停。
- `listening.json` 是独立的一个大 JSON，每条仅保留 ID、分组、标题、输入、参考文本和各版本的 ASR/WAV；没有 codec token。

## 选例口径

这是按要求挑选的**优势展示案例**，不是随机样本或全量指标的替代。

系统对比从 287 个合格候选中，人工选取 12 个不同文本场景：Aemeath 四个版本的已有 CER 均为 0，每个展示的外部对照 CER 均大于 0。消融从 148 个合格候选中选 8 条：position-only 的已有 CER 为 0，且严格低于同条的其他五个版本。选例来自此前冻结的 9,415 条诊断集合，未重新筛选或变更原始 benchmark。

每个模型的原文、参考文本和 ASR 与缓存评分核对一致；所有复制文件的 SHA-256 与原 WAV 一致。精选 Aemeath 音频通过已有生成触顶/长静音标记检查及有限的 PCM 静音检查。**CER=0 不等于听感完美**，本包没有声称完成人工逐条听审。建议优先试听每条绿色框中的 position-only，再使用 A/B 按钮对比。

## 模型版本

- Aemeath：全量 E4 SFT，step 92,420。
- Everbright：GRPO coverage，step 8,000。
- Polestar：reading-position，step 9,061；两种位置变体分别展示，不使用早期字符 CTC 或后续 10ep 版本。
- Acoustic control：从同一 Everbright 权重进行相同预算的声学续训。
- CosyVoice3 使用兼容修复后的全量正式重跑，未使用失效旧分支。
- IndexTTS2 分别保留 TN on/off；FireRedTTS3 保留 WeText；其他前端配置在页面中标明。

没有重新生成、裁剪、降噪、调音量、变速或更换外部模型参数。不同系统的音色、架构和原生解码配置并未完全控制，试听重点是原始文本的读法与完整性。

## 文件

```text
index.html                 离线页面
styles.css / app.js        样式与交互
data.js                    页面所需的样本数据
audio/                     180 个 WAV，按“样本ID__模型.wav”命名
assets/                    作者提供的三个图标
listening.json             简洁听测清单
metadata/scores.csv        每条原有 CER、编辑数、时长
metadata/provenance.json   选例规则、原始来源、文件哈希
metadata/validation.json   文件完整性与浏览器检查结果
```

如浏览器的本地文件策略限制播放，可在**自己的电脑**上进入解压后的文件夹，运行 `python -m http.server 8000 --bind 127.0.0.1`，再打开 `http://127.0.0.1:8000`。

默认页面为英文科研展示界面，原始中文/中英文本保持原样。参考里的 `[A|B|C]` 表示可选读法，`[X]` 表示可省略内容。输入仅在显示时还原序列化换行，没有额外做 TN。
