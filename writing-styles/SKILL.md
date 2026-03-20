---
name: writing-styles
description: >
  Adapt writing tone and style to match the target audience — technical, user-friendly,
  or internal. Use this skill when the user needs to write or rewrite content for a
  specific audience, switch between communication styles, translate technical content
  for non-technical readers, draft internal memos, create customer-facing copy, or
  adjust tone for different contexts. Trigger phrases: "make this more user-friendly",
  "rewrite for engineers", "draft an internal memo", "translate this for customers",
  "change the tone", "write this for a technical audience", "make this less jargon-heavy."
version: 1.0.0
license: MIT
author: Chad Cribbins (chad@mereshot.com)
---

# Writing Styles

Adapt writing tone, vocabulary, and structure to match the target audience. Three core styles cover most professional communication needs.

## Overview

Most professional writing falls into one of three audiences: engineers, end users, or internal teams. Each requires different tone, detail level, and framing. This skill helps you write for — or convert between — these styles consistently.

## Before You Start

Consult the reference files in this folder for detailed guidance:
- `technical-style.md` — conventions for engineering and architecture audiences
- `user-friendly-style.md` — conventions for customer-facing content
- `internal-audience-style.md` — conventions for team and cross-functional communication
- `style-comparison.md` — side-by-side comparison and conversion examples

## Workflow

1. **Identify the audience** — who will read this? Engineers, end users, or internal teams? If unclear, ask.

2. **Select the style** — match audience to style:

   | Audience | Style | Focus |
   |----------|-------|-------|
   | Engineers, architects | **Technical** | How it works |
   | End users, customers | **User-friendly** | What you can do |
   | Internal teams | **Internal-audience** | Why we're doing it |

3. **Assess the input** — read the existing content. Identify what needs to change: tone, jargon level, detail depth, framing.

4. **Apply the style** — rewrite or draft using the conventions from the relevant style guide:
   - **Technical**: precise language, specifications, metrics, implementation details
   - **User-friendly**: conversational tone, benefits-first, analogies, minimal jargon
   - **Internal-audience**: direct, action-oriented, strategic rationale, business metrics

5. **Convert between styles when asked** — use the patterns from `style-comparison.md`:
   - Technical → User-friendly: replace specs with benefits, swap jargon for plain language
   - User-friendly → Internal: add metrics, strategic context, resource implications
   - Internal → Technical: replace business framing with implementation details and constraints

6. **Review for consistency** — check that tone, vocabulary, and detail level are uniform throughout. Mixed styles confuse readers.

7. **Stop cleanly** — present the output and note which style was applied. If the user wants a different audience, offer to convert.

## Output format

Return one of:
- **Styled draft** — new or rewritten content in the requested style.
- **Style recommendation** — if the user is unsure which style to use, recommend one based on the audience and purpose.
- **Conversion** — the same content rewritten for a different audience, with a brief note on what changed.

## Refusals

- Do not mix styles in a single document unless explicitly asked.
- Do not invent facts or metrics when converting — flag gaps instead.
- Do not over-simplify technical content to the point of inaccuracy.
- Do not add marketing spin to internal or technical content unless requested.

## Tone

Adapt to the selected style. When advising (not writing), be direct and practical — recommend the right style and explain why briefly.
