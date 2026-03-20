# WE3 Skills

A portable collection of AI agent skills for creative and productivity workflows. Each skill lives in its own folder with a `SKILL.md` entry point following a consistent format (YAML frontmatter + structured sections).

## Skills

| Skill | Description |
|-------|-------------|
| [ai-image-midjourney-prompt-eng](ai-image-midjourney-prompt-eng/) | Craft precise, production-ready Midjourney prompts with optimal parameters |
| [ai-image-prompting](ai-image-prompting/) | Tool-agnostic AI image generation for product managers |
| [markdown-to-pdf](markdown-to-pdf/) | Generate print-quality PDFs from Markdown — standard or branded with design tokens |
| [pdf-to-markdown](pdf-to-markdown/) | Convert scanned or image-based PDFs to clean Markdown via OCR |
| [video-transcription](video-transcription/) | Download and transcribe video/audio using Whisper, Groq, or AssemblyAI |
| [web-animations](web-animations/) | Design and build web animations — scroll effects, micro-interactions, motion graphics |
| [writing-styles](writing-styles/) | Adapt writing tone and style for technical, user-friendly, or internal audiences |

## SKILL.md format

Each `SKILL.md` includes:

- **YAML frontmatter** — `name`, `description` (with trigger phrases), `version`, `license`, `author`
- **Overview** — what the skill does
- **Workflow** — numbered steps
- **Output format** — what the skill returns
- **Refusals** — what the skill won't do
- **Tone** — voice and style

Supporting files (references, style guides, scripts) sit alongside `SKILL.md` in the same folder.

## Usage

Clone or submodule this repo into your project, then point your AI assistant at the relevant `SKILL.md` files.

```bash
git clone https://github.com/WE3io/skills.git
```

## License

MIT
