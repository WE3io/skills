---
name: pdf-to-markdown
description: >
  Convert scanned or image-based PDFs into clean, accurate Markdown. Use this skill when
  the user wants to extract text from a scanned PDF, OCR a document, convert a PDF to
  markdown, clean up OCR output, or produce structured text from image-only documents.
  Trigger phrases: "OCR this PDF", "convert PDF to markdown", "extract text from scan",
  "clean up this OCR", "PDF to text", "transcribe this document", "digitize this PDF."
version: 1.0.0
license: MIT
author: Chad Cribbins (chad@mereshot.com)
---

# PDF to Markdown

Convert scanned or image-based PDFs into clean, faithful Markdown using OCR. Preserves content 1:1 — no additions, no rewriting.

## Overview

This skill handles the full pipeline from scanned PDF to clean Markdown: rendering pages to images, running OCR, assembling output, and guiding multi-pass cleanup. It produces accurate, structured text that matches the original document.

## Prerequisites

| Tool | Purpose | Install (macOS) |
|------|---------|-----------------|
| **poppler** (`pdftoppm`) | Render PDF pages to images | `brew install poppler` |
| **tesseract** | OCR engine | `brew install tesseract` |

## Workflow

1. **Discovery first** — confirm the PDF exists, check if it's image-only or has embedded text. If it has embedded text, suggest a simpler extraction tool (`pdftotext`) instead of OCR.

2. **Render pages to images** — use `pdftoppm` at 200 dpi for clean OCR input:
   ```bash
   pdftoppm -r 200 -png input.pdf page
   # outputs page-01.png, page-02.png, ...
   ```

3. **OCR each page** — process page-by-page to keep errors localized:
   ```bash
   mkdir ocr
   for img in page-*.png; do
     base=$(basename "$img" .png)
     tesseract "$img" "ocr/$base" -l eng
   done
   ```

4. **Assemble a single Markdown file** — concatenate in page order:
   ```bash
   cat ocr/page-*.txt > output.md
   ```

5. **First-pass cleanup (mechanical)** — fix common OCR artifacts:
   - Split words from line breaks
   - Stray hyphens
   - Repeated headers/footers
   - Obvious character mistakes (`l` vs `1`, `0` vs `O`)

   Use `rg` to find patterns:
   ```bash
   rg -n "-\n|\b[A-Z][a-z]+\b\?" output.md
   ```

6. **Structure pass** — merge lines into paragraphs, ensure headings match the scan, preserve section breaks.

7. **Accuracy pass (side-by-side)** — compare rendered pages against the Markdown for missing words, punctuation, numbers, references, and proper nouns. Re-render specific pages if needed:
   ```bash
   pdftoppm -f 5 -l 5 -r 200 -png input.pdf page-5
   ```

8. **Final sweep** — run a focused scan for known OCR issues:
   ```bash
   rg -n "\b0\b|\b1\b|\bI\b|\bl\b" output.md
   ```

## Output format

Return one of:
- **Clean Markdown file** — faithful to the original with correct headings, paragraphs, and lists.
- **Progress report** — if cleanup is ongoing, report what's been fixed and what remains.
- **Recommendation to use a different tool** — if the PDF has embedded text, suggest `pdftotext` instead.

## Quality checklist

- Headings match the scan
- Paragraph breaks match the scan
- No missing lines or sentences
- References and numbers are exact
- No added content

## Refusals

- Do not add content that isn't in the original document.
- Do not rewrite or improve the original text.
- Do not guess at illegible text — flag it for human review.
- Do not process PDFs with sensitive content without confirming intent.

## Tone

Direct, methodical, precise. Guide the user through each pass without rushing. Flag uncertainty rather than guessing.
