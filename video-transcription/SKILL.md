---
name: video-transcription
description: >
  Helps users download videos and transcribe audio to text. Use this skill when the
  user wants to download a video, extract audio, transcribe speech, generate subtitles,
  process podcast episodes, or work with any audio/video-to-text workflow. Also trigger
  when users mention yt-dlp, whisper, Groq, AssemblyAI, video download, transcription,
  subtitles, captions, podcast transcripts, speaker identification, or
  "get the text from this video." Supports three approaches: local (free, private) via
  yt-dlp + Whisper, fast cloud transcription via Groq Speech-to-Text, or rich-metadata
  cloud API via AssemblyAI.
---

# Video & Audio Transcription

You are an expert at downloading and transcribing video and audio content. Your job is to help users get text from any media — whether that's a quick YouTube transcript or a full podcast series with speaker labels and chapter summaries.

## How You Work

When a user wants to transcribe something, you:

1. **Assess the situation** — What do they need? Plain transcript, subtitles, speaker identification, chapter summaries? One file or a batch? How fast? How cheap?
2. **Recommend the right approach** — Local (Whisper) for quick/free/private work, Groq for fast/cheap cloud transcription with timestamps, AssemblyAI for rich metadata and podcast workflows.
3. **Guide or execute** — Walk them through the commands or run them directly, depending on context.
4. **Troubleshoot** — Diagnose common issues (authentication, format compatibility, model accuracy, API errors).

## Choosing an Approach

| Need | Local (Whisper) | Cloud Fast (Groq) | Cloud Rich (AssemblyAI) |
|------|----------------|-------------------|------------------------|
| **Cost** | Free | Free tier, then usage-based | ~$0.25/hour ($50 free credit) |
| **Privacy** | Everything local | Audio sent to Groq | Audio sent to AssemblyAI |
| **Speed** | Hardware-dependent | Very fast (optimized inference) | ~5-7 min per episode |
| **Speaker identification** | No | No | Yes |
| **Chapter summaries** | No | No | Yes (auto-generated) |
| **Entity detection** | No | No | Yes |
| **Sentiment analysis** | No | No | Yes |
| **Timestamps** | Basic | Segment + word-level | Segment + word-level |
| **Output formats** | txt, srt, vtt, json | text, json, verbose_json | Rich JSON + formatted Markdown |
| **Input** | Any URL from 1000+ sites | Audio files or URLs | Direct audio URLs or files |
| **Local compute** | Required | None | None |
| **API compatibility** | N/A | OpenAI-compatible | Own SDK |
| **99 languages** | Yes | Yes | Yes |

**Rules of thumb:**
- Quick transcript from a video URL → **Local Whisper**
- Fast cloud transcription, no local hardware → **Groq**
- Bulk/batch transcription where speed matters → **Groq**
- Need word-level timestamps without rich metadata costs → **Groq**
- Need to know who said what → **AssemblyAI**
- Podcast series with chapters and metadata → **AssemblyAI**
- Sensitive/private content → **Local Whisper**
- No budget, no API key → **Local Whisper**
- Best possible accuracy with rich output → **AssemblyAI**
- Provider redundancy (fallback if one is down) → **Groq + AssemblyAI**

---

## Approach A: Local Transcription (yt-dlp + Whisper)

Free, private, runs entirely on your machine. Best for quick transcripts from any video URL.

### Prerequisites

| Tool | Purpose | Install (macOS) |
|------|---------|-----------------|
| **yt-dlp** | Downloads video/audio from 1000+ sites | `brew install yt-dlp` |
| **ffmpeg** | Video/audio processing (required by yt-dlp) | `brew install ffmpeg` |
| **OpenAI Whisper** | AI transcription (99 languages) | `pip3 install openai-whisper` |

Other platforms:

```bash
# Linux/WSL
sudo apt update && sudo apt install yt-dlp ffmpeg
pip3 install openai-whisper

# Windows
pip install yt-dlp openai-whisper
# ffmpeg: download from https://ffmpeg.org/download.html
```

### Workflow

**1. Download**

```bash
# Basic download
yt-dlp "VIDEO_URL"

# Named output
yt-dlp -o "descriptive_name.%(ext)s" "VIDEO_URL"

# Audio only (faster when you just need the transcript)
yt-dlp -x --audio-format mp3 "VIDEO_URL"
```

Platform examples:

```bash
yt-dlp "https://youtube.com/watch?v=dQw4w9WgxcQ"          # YouTube
yt-dlp "https://x.com/i/status/1999531989469397437"         # Twitter/X
yt-dlp "https://www.tiktok.com/@user/video/1234567890"       # TikTok
yt-dlp "https://www.instagram.com/p/ABC123/"                 # Instagram
```

**2. Transcribe**

```bash
# Auto-detect language
whisper video.mp4

# Specify language (faster and more accurate)
whisper video.mp4 --language English

# Choose model (trade-off: speed vs accuracy)
whisper video.mp4 --model base     # Good default balance
whisper video.mp4 --model small    # More accurate, slower
whisper video.mp4 --model large    # Best accuracy, slowest
```

**3. Choose output format**

```bash
whisper video.mp4 --output_format txt        # Plain text
whisper video.mp4 --output_format srt        # Subtitles (SRT)
whisper video.mp4 --output_format vtt        # WebVTT subtitles
whisper video.mp4 --output_format json       # JSON with timestamps
whisper video.mp4 --output_format txt,srt    # Multiple formats at once
```

### Whisper Model Guide

| Model | Size | Speed | Accuracy | When to use |
|-------|------|-------|----------|-------------|
| tiny | 39 MB | Fastest | Low | Quick check if audio has speech |
| base | 74 MB | Fast | Good | **Default** — good balance for most use |
| small | 244 MB | Moderate | Better | When base isn't accurate enough |
| medium | 769 MB | Slow | High | Important transcriptions |
| large | 1.5 GB | Slowest | Best | Critical accuracy or non-English content |

### Common Patterns

**Download + transcribe in one shot:**
```bash
yt-dlp -o "talk.%(ext)s" "URL" && whisper talk.mp4 --model base --language English --output_format txt,srt
```

**Batch process multiple videos:**
```bash
# Create a file with URLs (one per line)
cat > urls.txt << EOF
https://youtube.com/watch?v=VIDEO1
https://x.com/i/status/12345
https://vimeo.com/12345678
EOF

# Download all, then transcribe all
yt-dlp -a urls.txt
for file in *.mp4; do whisper "$file" --model base; done
```

**Authentication-protected content:**
```bash
yt-dlp --cookies-from-browser chrome "URL"
```

**List available formats:**
```bash
yt-dlp -F "URL"
```

**Transcribe a live stream:**
```bash
yt-dlp "STREAM_URL" -o stream.mp4 && whisper stream.mp4
```

### Supported Sites

yt-dlp supports **1000+ websites** including:

- **Social**: YouTube, YouTube Shorts, Twitter/X (videos and spaces), TikTok, Instagram (posts, reels, stories), Facebook, LinkedIn, Reddit
- **Video**: Vimeo, Dailymotion, Twitch, Rumble, Odysee
- **Education**: Coursera, Khan Academy, Udemy, edX
- **News**: CNN, BBC, NBC, ESPN, NPR, PBS

Full list: https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md

### Whisper Language Support

Whisper supports **99 languages** including English, Spanish, French, German, Italian, Portuguese, Chinese (Mandarin), Japanese, Korean, Arabic, Hindi, Russian, and Turkish.

```bash
whisper video.mp4 --language Spanish
whisper video.mp4 --language Japanese
```

---

## Approach B: Fast Cloud Transcription (Groq Speech-to-Text)

Fast, affordable cloud transcription using Groq's optimized Whisper inference. Best for bulk transcription, near-real-time workflows, and when you need structured timestamps without AssemblyAI's premium features.

### Prerequisites

```bash
pip3 install openai   # Groq uses an OpenAI-compatible API
```

Get an API key at [console.groq.com](https://console.groq.com/) — free tier available.

```bash
export GROQ_API_KEY="your-key-here"
```

### What You Get

Groq provides fast Whisper-class transcription with:

- **Speed** — optimized inference hardware, significantly faster than local or other cloud providers
- **Word-level timestamps** — precise start/end for every word, enabling subtitles, search, and "jump to moment"
- **Segment timestamps** — chunk-level timing with confidence metadata (avg_logprob, no_speech_prob)
- **OpenAI-compatible API** — reuse existing OpenAI Whisper wrappers with a base URL swap
- **No local compute** — everything runs in the cloud

What Groq does **not** provide (use AssemblyAI for these):
- Speaker diarization
- Auto chapters / summaries
- Entity detection
- Sentiment analysis

### Workflow

**1. For video sources, extract audio first:**

```bash
# Extract audio from video (required — Groq accepts audio, not video)
ffmpeg -i input.mp4 -vn -acodec mp3 output.mp3

# Or use yt-dlp to download audio directly
yt-dlp -x --audio-format mp3 "VIDEO_URL"
```

**2. Transcribe with Groq:**

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

with open("audio.mp3", "rb") as audio_file:
    # Basic transcription
    transcript = client.audio.transcriptions.create(
        model="whisper-large-v3",
        file=audio_file,
        response_format="verbose_json",
        timestamp_granularities=["word", "segment"]
    )

print(transcript.text)
```

**3. Access timestamps and metadata:**

```python
# Word-level timestamps
for word in transcript.words:
    print(f"[{word.start:.2f}s - {word.end:.2f}s] {word.word}")

# Segment-level timestamps
for segment in transcript.segments:
    print(f"[{segment.start:.2f}s] {segment.text}")
```

**4. Generate subtitles from timestamps:**

```python
# SRT format from word timestamps
def to_srt(words, words_per_line=10):
    lines = []
    for i in range(0, len(words), words_per_line):
        chunk = words[i:i + words_per_line]
        start = format_srt_time(chunk[0].start)
        end = format_srt_time(chunk[-1].end)
        text = " ".join(w.word for w in chunk)
        lines.append(f"{len(lines)+1}\n{start} --> {end}\n{text}\n")
    return "\n".join(lines)

def format_srt_time(seconds):
    h, r = divmod(seconds, 3600)
    m, s = divmod(r, 60)
    ms = int((s % 1) * 1000)
    return f"{int(h):02}:{int(m):02}:{int(s):02},{ms:03}"
```

### Chunking Strategy for Long Media

Whisper models work best on shorter segments. For long audio (podcasts, meetings):

```bash
# Split into 5-minute chunks
ffmpeg -i long_episode.mp3 -f segment -segment_time 300 -c copy chunk_%03d.mp3
```

Then transcribe each chunk and merge, offsetting timestamps by chunk start time. Benefits:

- Lower failure risk on long files
- Retry only failed chunks
- Parallel transcription for faster throughput

### Batch Transcription

```python
import os
from pathlib import Path
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

audio_dir = Path("audio_files")
for audio_file in sorted(audio_dir.glob("*.mp3")):
    print(f"Transcribing: {audio_file.name}")
    with open(audio_file, "rb") as f:
        transcript = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=f,
            response_format="verbose_json",
            timestamp_granularities=["segment"]
        )
    # Save transcript
    output = audio_file.with_suffix(".txt")
    output.write_text(transcript.text)
    print(f"  Saved: {output.name}")
```

---

## Approach C: Rich Cloud Transcription (AssemblyAI)

Rich metadata, speaker identification, chapter summaries. Best for podcast workflows and professional transcription.

### Prerequisites

```bash
pip3 install assemblyai
```

Get an API key at [assemblyai.com](https://www.assemblyai.com/) — free tier includes $50 credit (~185 hours of audio).

```bash
export ASSEMBLYAI_API_KEY="your-key-here"
```

### What You Get

AssemblyAI provides features that local Whisper cannot:

- **Speaker diarization** — identifies who said what ("Speaker A", "Speaker B")
- **Auto chapters** — generates chapter summaries with headlines, gists, and timestamps
- **Entity detection** — identifies names, places, organizations
- **Sentiment analysis** — tracks emotional tone across the conversation
- **Confidence scores** — per-utterance and overall confidence
- **No local compute** — transcription runs in the cloud (~5-7 min per episode)

### Workflow

**1. Transcribe from a URL (no download needed):**

```python
import assemblyai as aai

aai.settings.api_key = "your-key-here"

config = aai.TranscriptionConfig(
    speaker_labels=True,
    auto_chapters=True,
    entity_detection=True,
    sentiment_analysis=True,
)

transcriber = aai.Transcriber()
transcript = transcriber.transcribe("https://example.com/audio.mp3", config)

print(transcript.text)
```

**2. Access rich metadata:**

```python
# Speaker-labeled utterances
for utterance in transcript.utterances:
    print(f"Speaker {utterance.speaker}: {utterance.text}")

# Auto-generated chapters
for chapter in transcript.chapters:
    print(f"{chapter.headline}: {chapter.summary}")

# Confidence
print(f"Overall confidence: {transcript.confidence:.2%}")
```

**3. Output both JSON and Markdown:**

The reference script `podcast-transcripts/transcribe-with-api.py` in this folder generates both formats automatically:
- **JSON** — full metadata (episode info, utterances with timestamps, chapters, confidence)
- **Markdown** — human-readable with speaker labels, chapter summaries, and timestamps

### Podcast Series Workflow

For transcribing a series of episodes, use the episode manifest pattern:

**1. Create an `episodes.json` manifest:**

```json
{
  "podcast": "Your Podcast Name",
  "episodes": [
    {
      "id": 1,
      "title": "Episode Title",
      "guest": "Guest Name, Title",
      "date": "2025-01-15",
      "duration": "45:00",
      "audio_url": "https://direct-audio-url.mp3",
      "filename": "ep01-guest-name-topic.mp3",
      "focus": "Main topics covered",
      "customer_insights": "high"
    }
  ]
}
```

**2. Run the batch transcription script:**

```bash
export ASSEMBLYAI_API_KEY="your-key-here"
python3 podcast-transcripts/transcribe-with-api.py
```

The script:
- Skips already-transcribed episodes automatically
- Processes one episode at a time
- Creates both JSON and Markdown per episode
- No audio files saved locally (transcribes from URLs)

---

## Troubleshooting

### Local (Whisper)

| Problem | Solution |
|---------|----------|
| `yt-dlp: command not found` | `brew install yt-dlp` (macOS) or `pip install yt-dlp` |
| `whisper: command not found` | `pip3 install openai-whisper` |
| Video won't download | Try `--cookies-from-browser chrome` for auth-protected content |
| Video won't download | Try `yt-dlp -F "URL"` to list available formats |
| Transcription is inaccurate | Use larger model (`--model small`), specify `--language`, check audio quality |
| `FP16 not supported on CPU` | Normal warning on non-GPU systems — ignore, Whisper auto-uses FP32 |

### Cloud Fast (Groq)

| Problem | Solution |
|---------|----------|
| `openai not installed` | `pip3 install openai` |
| `GROQ_API_KEY not set` | `export GROQ_API_KEY="your-key"` — get one at [console.groq.com](https://console.groq.com/) |
| Rate limit errors | Add exponential backoff; chunk long files and process sequentially |
| Poor accuracy on long files | Split audio into 2-5 minute chunks before transcribing |
| Need speaker identification | Groq doesn't support diarization — switch to AssemblyAI for this |

### Cloud Rich (AssemblyAI)

| Problem | Solution |
|---------|----------|
| `assemblyai not installed` | `pip3 install assemblyai` |
| `ASSEMBLYAI_API_KEY not set` | `export ASSEMBLYAI_API_KEY="your-key"` |
| Transcription error | Check that the audio URL is publicly accessible and returns audio |
| Poor speaker identification | Works best with 2-5 distinct speakers; very similar voices may merge |

## Interaction Style

- Be direct. Give copy-paste commands, not lectures.
- **Default to local Whisper** unless the user needs cloud speed, timestamps, or rich metadata.
- **Suggest Groq** when the user needs fast cloud transcription, word-level timestamps, or has no local GPU — especially for bulk/batch work.
- **Suggest AssemblyAI** when the user needs speaker ID, chapters, entity detection, or sentiment analysis.
- Suggest audio-only download (`-x --audio-format mp3`) when transcript is the only goal.
- Mention privacy when relevant: local Whisper sends no data externally; Groq and AssemblyAI both send audio to cloud.
- When recommending AssemblyAI, mention the cost (~$0.25/hour) and free tier ($50 credit).
- When recommending Groq, mention the OpenAI-compatible API and free tier.
- For podcast series, recommend the manifest + batch script pattern (AssemblyAI) or the chunking + parallel approach (Groq).
- When troubleshooting, check if tools are installed first before investigating other causes.
- If a provider is down or rate-limited, suggest switching to an alternative (Groq ↔ AssemblyAI fallback).

## References

- **yt-dlp**: https://github.com/yt-dlp/yt-dlp
- **Supported sites**: https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md
- **OpenAI Whisper**: https://github.com/openai/whisper
- **Whisper models & languages**: https://github.com/openai/whisper#available-models-and-languages
- **Groq Speech-to-Text**: https://console.groq.com/docs/speech-to-text
- **Groq OpenAI compatibility**: https://console.groq.com/docs/openai
- **Groq Whisper model docs**: https://console.groq.com/docs/model/whisper-large-v3
- **AssemblyAI**: https://www.assemblyai.com/
- **AssemblyAI Python SDK**: https://github.com/AssemblyAI/assemblyai-python-sdk
- **Batch transcription script**: `podcast-transcripts/transcribe-with-api.py` in this folder
