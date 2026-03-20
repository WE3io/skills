---
name: markdown-to-pdf
description: >
  Generate a PDF from a markdown file. Use this skill when the user wants to
  convert markdown to PDF, create a PDF document, generate a one-pager, or produce
  print-ready output. Trigger when users mention md-to-pdf, PDF from markdown,
  branded PDF, or "make a PDF." Two modes: standard (just markdown) or branded
  (markdown + DTCG design tokens).
version: 1.0.0
license: MIT
author: Chad Cribbins (chad@mereshot.com)
---

# PDF Generator

Generate print-quality PDFs from markdown files. Two modes: standard (clean defaults) or branded (token-driven styling).

## Prerequisites

| Tool | Purpose | Install |
|------|---------|---------|
| **Node.js** | Runtime | `brew install node` |
| **md-to-pdf** | Markdown to PDF | `npm i -g md-to-pdf` |

Branded mode also requires:

| Tool | Purpose | Install |
|------|---------|---------|
| **style-dictionary** | Token to CSS compiler | `npm install style-dictionary` (per-project) |

## Mode Selection

| User provides | Mode |
|--------------|------|
| Markdown file only | **Standard** |
| Markdown + DTCG token file | **Branded** |

Default to standard. Use branded when the user provides a token file, asks for "branded" output, or mentions design tokens.

---

## Standard Mode

Clean, professional A4 output using md-to-pdf's built-in stylesheet. No custom CSS, no config file, no build step.

### Pipeline

1. **Confirm** the markdown file exists and is well-formed.
2. **Generate:**

```bash
npx md-to-pdf <markdown-file>
```

3. **Report** the PDF path and file size.

That's it. The built-in `markdown.css` handles typography, spacing, lists, tables, code blocks, and images.

### What it produces

- White background, default margins
- System font stack, 11pt body, 1.6 line height
- Clean heading hierarchy, standard bullets, gainsboro rules
- Print-safe page breaks, orphan/widow control

---

## Branded Mode

Layer brand colors, fonts, and accents on top of the clean default using DTCG design tokens.

### Architecture

```
tokens.json (DTCG master file — same one used for web, Figma, etc.)
    |
    v  Style Dictionary (pdf-only filter)
    |
styles/tokens.generated.css   (CSS custom properties: --ref-*, --sys-*)
    +
styles/pdf-brand.css           (thin overrides using var())
    +
markdown.css                   (md-to-pdf built-in base)
    |
    v  md-to-pdf --config-file pdf-config.js
    |
output.pdf
```

The token file is the single source of truth. Style Dictionary compiles it to CSS custom properties. A thin brand stylesheet references those variables to override only colors, fonts, and accents. Layout and spacing stay from the default.

### Pipeline

1. **Set up project directory:**

```
project/
  tokens/tokens.json        # DTCG token file (copy or symlink from master)
  styles/                   # Generated CSS goes here
  sd.config.mjs             # Copy from this skill folder
  pdf-config.js             # Create (see below)
  package.json              # Needs style-dictionary dependency
```

2. **Install style-dictionary** if not already present:

```bash
npm init -y && npm install style-dictionary
```

3. **Copy files from this skill folder** into the project:
   - `sd.config.mjs` → project root
   - `pdf-brand.css` → `styles/pdf-brand.css`

4. **Create `pdf-config.js`** in the project root:

```javascript
const { join } = require('path');

module.exports = {
  stylesheet: [
    '/opt/homebrew/lib/node_modules/md-to-pdf/markdown.css',
    join(__dirname, 'styles', 'tokens.generated.css'),
    join(__dirname, 'styles', 'pdf-brand.css'),
  ],
  pdf_options: {
    format: 'A4',
    printBackground: true,
    margin: 0,
  },
};
```

5. **Compile tokens:**

```bash
npx style-dictionary build --config sd.config.mjs
```

This produces `styles/tokens.generated.css`.

6. **Generate PDF:**

```bash
npx md-to-pdf <markdown-file> --config-file pdf-config.js
```

7. **Report** the PDF path and file size.

### Changing the brand

Edit `tokens.json`, recompile (`npx style-dictionary build --config sd.config.mjs`), regenerate the PDF. The CSS files never change — only the token values do.

---

## Key Technical Facts

These are verified facts. Do not guess or assume otherwise.

### md-to-pdf behavior

- **No config auto-discovery.** There is no automatic loading of `.md-to-pdf.js` or any other config file. Config must be passed explicitly via `--config-file path`.
- **`--stylesheet` REPLACES the built-in default.** It does not add to it. The config file's `stylesheet` array also replaces, not appends. To keep the built-in styles, include the path to `markdown.css` in your stylesheet array.
- **Built-in stylesheet** lives at: `/opt/homebrew/lib/node_modules/md-to-pdf/markdown.css`
- **`stylesheet` expects file paths**, not CSS content. Passing `readFileSync()` content will cause an ENAMETOOLONG error.
- **Config file must be CommonJS** (`module.exports = { ... }`), not ESM. md-to-pdf loads it with `require()`.
- **Frontmatter** in the markdown file can set config (pdf_options, stylesheet, etc.), but this modifies the input file — avoid it.
- **Runs from Claude Code sandbox** — Puppeteer/headless Chrome launches fine.

### Full-bleed background color

Chromium's PDF engine does not paint background colors in the page margin area. This is a known Chromium limitation (Puppeteer issue #9341, closed as "not planned").

**The solution:**
1. Set Puppeteer margins to 0 in `pdf_options` — background fills edge-to-edge
2. Use CSS `padding: 2cm` on `body` to simulate visual margins
3. Use `box-decoration-break: clone` so padding repeats on every page

This is implemented in `pdf-brand.css`. Do not change the margin/padding approach without understanding why it exists.

### Style Dictionary

- **SD config must be ESM** (`.mjs` extension) because it imports `style-dictionary`
- The `pdf-only` filter skips web-specific tokens: grid, motion, radius, z-index, layout, and UI components (button, card, panel, input, badge, stripe, cursor, icon)
- Uses the WE3 3-tier naming: `reference.*` → `--ref-*`, `system.*` → `--sys-*`, `component.*` → `--comp-*`
- `outputReferences: true` preserves the reference chain for debugging

### Token file requirements

The brand CSS (`pdf-brand.css`) references these system-tier variables. The token file must define them (or tokens that resolve to them):

```
--sys-surface-page        Page background color
--sys-color-on-surface    Body text color
--sys-color-primary       Heading color, bullet color
--sys-color-secondary     Blockquote accent
--sys-surface-border      Horizontal rule color
--sys-surface-card        Table header/stripe background
--sys-font-family         Body font stack
```

---

## Interaction Style

- Be direct. Confirm inputs, generate, report.
- Default to standard mode unless tokens are provided.
- Do not modify the input markdown file.
- If the user wants to change the look in branded mode, guide them to edit `tokens.json` and recompile.
- If the PDF output has issues, adjust `pdf-brand.css` for branded mode. For standard mode, there is no custom CSS to adjust — the built-in defaults are what they are.
