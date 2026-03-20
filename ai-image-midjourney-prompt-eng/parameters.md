# Midjourney Parameter & Prompt Reference

## Table of Contents
1. [Core Parameters](#core-parameters)
2. [Reference Parameters](#reference-parameters)
3. [Execution Parameters](#execution-parameters)
4. [V7-Specific Features](#v7-specific-features)
5. [Prompt Structure Deep Dive](#prompt-structure-deep-dive)
6. [Multi-Prompts and Weighting](#multi-prompts-and-weighting)
7. [Style Vocabulary](#style-vocabulary)
8. [Photography Language](#photography-language)
9. [Art Movement Keywords](#art-movement-keywords)
10. [Common Pitfalls](#common-pitfalls)
11. [Parameter Recipes](#parameter-recipes)

---

## Core Parameters

### --aspect / --ar (Aspect Ratio)
Controls image dimensions. Default: 1:1.

| Value | Use Case |
|-------|----------|
| 1:1 | Social media posts, album covers, profile pictures |
| 2:3 | Pinterest, portraits, book covers, posters |
| 3:2 | Landscape photography, horizontal prints |
| 4:5 | Instagram portrait posts |
| 9:16 | Phone wallpapers, stories, TikTok, reels |
| 16:9 | YouTube thumbnails, presentations, desktop wallpapers |
| 21:9 | Ultrawide/cinematic, website hero banners |
| 2.39:1 | Anamorphic widescreen cinema |
| 3:4 | Standard print format |

Any ratio is supported from 1:1 up to the model's maximum.

### --stylize / --s (Artistic Style Intensity)
Controls how much MJ's default aesthetic is applied. Default: 100. Range: 0–1000.

| Range | Effect | When to use |
|-------|--------|-------------|
| 0–50 | Very literal, minimal artistic interpretation | Technical diagrams, straightforward documentation |
| 50–100 | Balanced, respects prompt closely | Most general use, product shots |
| 100–300 | Noticeably artistic, beautiful compositions | Creative work, editorial, portfolio pieces |
| 300–600 | Highly stylized, MJ takes creative liberties | Art exploration, mood boards |
| 600–1000 | Maximum artistic override, prompt becomes suggestion | Experimental, discovering unexpected aesthetics |

**Important trade-off**: Higher stylize = more beautiful but less prompt-adherent. The image may drift from your description in pursuit of aesthetic quality.

When using Personalization (--p), stylize controls how much personalization is applied. Lower values limit personalization, higher values increase it.

### --chaos / --c (Variation)
Controls variety across the 4-image grid. Default: 0. Range: 0–100.

| Range | Effect | When to use |
|-------|--------|-------------|
| 0–15 | Consistent, predictable results | Final production, known style |
| 15–40 | Moderate variety, exploring within a theme | Early ideation, comparing approaches |
| 40–70 | High variety, unexpected interpretations | Creative brainstorming, inspiration |
| 70–100 | Maximum divergence, wildly different outputs | Pure exploration, happy accidents |

### --quality / --q (Rendering Quality)
Controls detail level and GPU time. Default: 1.

| Value | Effect | Notes |
|-------|--------|-------|
| 0.25 | Fast, low detail | Quick sketches, rapid iteration |
| 0.5 | Moderate detail, faster | Good enough for concept exploration |
| 1 | Standard quality | Default, good for most uses |
| 2 | Higher detail (V6.1+) | 25% longer, more texture, may reduce coherence |
| 4 | Highest detail (V7) | Maximum quality, longest generation time |

V7 notes: No --q 3 (auto-switches to --q 4). --q 4 is not compatible with Omni Reference.

### --weird / --w (Experimental Aesthetics)
Introduces unusual, unexpected aesthetic qualities. Default: 0. Range: 0–3000.

| Range | Effect |
|-------|--------|
| 0–100 | Subtle quirks, slightly unusual |
| 100–500 | Noticeably strange, unconventional compositions |
| 500–1000 | Distinctly weird, surreal elements |
| 1000–3000 | Maximum strangeness, alien aesthetics |

Best combined with moderate --stylize (200–400) for interesting results without total chaos.

### --no (Negative Prompt)
Excludes specific elements. Place at end of prompt.

```
--no text, watermark, people, frame, border
```

Common exclusions:
- `--no text` — prevents random text/letters appearing
- `--no watermark` — clean images
- `--no people` — landscapes/still life without figures
- `--no frame, border` — edge-to-edge images
- `--no blur` — sharper results

Tip: Using `--no letters` can paradoxically reduce stray glyphs in logo/type work.

---

## Reference Parameters

### --sref (Style Reference)
Applies the visual style of a reference image or code. Can use URLs or numeric codes.

```
--sref [URL]            # Single image reference
--sref [URL1] [URL2]    # Multiple references
--sref [code]           # Numeric style code from MJ library
--sref random           # Random style from 1B+ base styles
```

**--sw (Style Weight)**: Controls style reference strength. Default: 100. Range: 0–1000.
- Low (0–50): Subtle influence, mostly follows prompt
- Medium (100–300): Balanced blend of prompt and style
- High (300–1000): Style dominates, prompt becomes secondary

**--sv (Style Version)**: Controls which sref algorithm is used.
- V7: `--sv 6` (default), `--sv 4` (old V7 model, pre-June 2025). Six versions total.
- V6: `--sv 4` (default). Four versions total.
- Sref random and sref codes only work with `--sv 4` and `--sv 6`.

**Note**: V7 updated style codes — old codes may produce different results. Use `--sv 4` to get old V7 behavior, or switch to V6 for legacy codes.

### --cref (Character Reference) — V6 only
Reuses a character across different scenes and poses.

```
--cref [URL] --cw 100
```

**--cw (Character Weight)**: Default: 100. Range: 0–100.
- `--cw 100`: Full character detail (face, hair, clothing)
- `--cw 0`: Face only, allows different outfits/hair

Tips:
- Best with single-character Midjourney-generated images
- Real people won't look exactly like them
- Intricate details (specific freckles, logos) may not transfer perfectly
- Requires a text prompt alongside the reference

### Omni Reference (V7)
Replaces --cref in V7. More flexible reference system that can handle characters, objects, and styles in a unified way.

### --iw (Image Weight)
Controls balance between image prompt and text prompt. Default: 1. Range: 0–2.0.
- Low (0–0.5): Text dominates, image is light suggestion
- Medium (1.0): Equal weight
- High (1.5–2.0): Image dominates composition and content

---

## Execution Parameters

### --seed
Sets the initial noise pattern. Range: 0–4294967295.
- Same seed + same prompt + same parameters → similar (not identical) composition
- Useful for A/B testing parameter changes
- Seeds have the **least impact** of any parameter on final output
- **Do not use with Turbo mode** — seed locking isn't reliable at turbo speed

### --repeat / --r
Generates multiple jobs from one prompt. Range: 1–40.
Useful for exploring variations without retyping.

### --tile
Generates seamless tileable patterns. Great for:
- Textile/fabric patterns
- Wallpaper designs
- Game textures
- Background patterns

### --version / --v
Switches Midjourney model version.
- V7 (default since June 17, 2025): Best text/image precision, richer textures, better hands/bodies. Introduces Draft Mode and Omni Reference.
- V6.1: 25% faster than V6, more coherent, precise details.
- V6: Enhanced prompt accuracy for longer inputs, advanced remixing.

### --niji
Switches to the anime-focused model. Best for:
- Anime/manga style illustrations
- Japanese art aesthetics
- Character design in anime style

### Speed modes
- `--fast` — Standard speed
- `--turbo` — Fastest generation (less reliable seeds)
- `--relax` — Slower, uses relax mode GPU minutes

### --stop
Stops generation at a percentage. Range: 10–100.
- Lower values produce softer, more abstract/painterly results
- Can create interesting "unfinished" aesthetics
- Useful for creating base images to iterate on

---

## V7-Specific Features

### Draft Mode
Faster generation with reduced quality. Use for rapid ideation.

### --exp (Experimental)
Enables experimental V7 features. Results may be unpredictable but can unlock new capabilities.

### Omni Reference
Unified reference system replacing --cref. More flexible handling of character, object, and style references in a single framework.

### Personalization (--p)
Applies your personal aesthetic profile trained from your image rankings.
- Must unlock by ranking enough image pairs on the Personalize Page
- Can create multiple profiles with different styles
- Each profile gets a unique code usable in prompts
- Stylize parameter (--s) controls how much personalization is applied
- Can select default profiles or specify per-prompt

---

## Prompt Structure Deep Dive

### The Seven Dimensions

Build prompts by considering these dimensions (include only what matters):

1. **Subject**: Who or what? (person, animal, object, character, landscape)
2. **Medium**: In what form? (photograph, oil painting, 3D render, watercolor, illustration, pencil sketch)
3. **Environment**: Where? (studio, forest, underwater, space, urban, interior)
4. **Lighting**: What kind? (golden hour, neon, volumetric, rim light, ambient, dramatic shadows)
5. **Color**: What palette? (monochromatic, vibrant, muted, pastel, earth tones, complementary)
6. **Composition**: How framed? (close-up, wide angle, bird's eye, rule of thirds, centered, negative space)
7. **Mood**: What feeling? (epic, serene, mysterious, whimsical, melancholic, energetic)

### Word Order Matters

Midjourney prioritizes words at the **front** of the prompt. Structure accordingly:

```
[MOST IMPORTANT] [IMPORTANT] [SUPPORTING DETAILS] [NICE-TO-HAVES] --parameters
```

Example ordering strategies:
- Subject-first: "a lone astronaut, standing on Mars, golden hour, cinematic"
- Style-first: "hyper-realistic photograph of a lone astronaut on Mars"
- Mood-first: "ethereal, dreamlike portrait of a woman in a garden"

---

## Multi-Prompts and Weighting

### Understanding Separators

Midjourney has three levels of concept separation:

| Separator | Meaning | Example |
|-----------|---------|---------|
| Space | Single concept | `hot dog` → the food |
| Comma `,` | Soft break — "these are different concepts" (default weight 1) | `wizard, forest` |
| Double colon `::` | Hard break — "these are VERY different concepts" | `hot:: dog` → a warm canine |

### Basic Multi-Prompt
Split concepts with `::` so MJ interprets them independently:

```
hot dog           → the food (one concept)
hot:: dog         → a heated canine (two concepts)
```

### Weighted Multi-Prompt
Add numbers after `::` to control relative importance:

```
sunset::2 ocean::1 sailboat::0.5
```

Key mechanics:
- **Weights are relative, not absolute.** `::2` vs `::1` is the same ratio as `::4` vs `::2` or `::100` vs `::50`.
- **Default weight is 1.** Writing `car:: blue::` is the same as `car::1 blue::1`.
- **Words at the start of a prompt already carry more influence** even without explicit weights.
- **Practical range is 0.5 to ~8.** Beyond that, diminishing returns — you're unlikely to see meaningful difference past weight 10.
- **All weights must sum to a positive value.** You can't make the total negative.

### Negative Weights
Actively suppress concepts with negative values:

```
forest landscape::1 animals::-0.5
still life painting:: green::-0.5
```

- Negative weights don't always completely remove a concept, but significantly lessen its influence.
- `--no [thing]` is shorthand for `::-0.5` — a good default suppression strength.
- Stronger negatives (`::-1`) have a more dramatic effect.

### When to Use Multi-Prompts
- **Concept blending**: Precise control over how two ideas merge
- **Emphasis control**: When word order alone isn't giving enough weight to a key element  
- **Disambiguation**: When MJ treats a multi-word phrase as one concept but you want separate concepts
- **Negative weights**: Removing unwanted elements more precisely than `--no`
- **Complex scenes**: Controlling the balance between foreground subject, background, mood, and style

### Multi-Prompt Recipes

**Scene with emphasis on environment:**
```
/imagine prompt: lone figure::1 vast desert landscape::3 dramatic sky::2 --ar 16:9
```

**Concept fusion with controlled blending:**
```
/imagine prompt: mechanical::2 butterfly::2 steampunk::1 --s 200
```

**Style-heavy with subject:**
```
/imagine prompt: portrait of a woman::1 art nouveau::3 Alphonse Mucha::2 --ar 2:3 --s 300
```

**Removing unwanted elements precisely:**
```
/imagine prompt: peaceful zen garden::2 water feature::1 people::-0.5 text::-0.5 --no signs
```

---

## Style Presets Library

These are proven style keywords that Midjourney responds to strongly. Organized by category for quick lookup. Use as-is or combine them.

### Era & Aesthetic Styles
16-bit, 4-bit, 8-bit, 1800s, 1980s, Ancient, Renaissance, Retro, Vintage, Old Photograph, Ultra Modern, Futuristic

### Visual Styles
Anime, Cartoon, Comicbook, Comicbook Drawing, Concept Art, Graphic Novel, Manga, Pixelart, Photorealistic, Realistic, Sketch Drawing, Blueprint Drawing, Anatomical Drawing, Da Vinci Drawing, Charcoal Style, Etching, Gouache, Oil Painting, Pastel, Risograph, Sticker, Logo

### Mood & Theme Styles
Cyberpunk, Synthwave, Vaporwave, Steampunk, Tron, Surreal, Psychedelic (LSD), Horror, Diabolic, Hell, Dark Matter, Dangerous, Celestial, Galactic, Space, Deep Sea, Tropical, Caribbean, Wild West, Dune, Stranger Things

### Pattern & Texture Styles
Fractal, Fibonacci, Kaleidoscope, Mandala, Sacred Geometry, Flower Of Life, Merkaba, Helix, Dots, Polka, Squiggles, Symmetric, Ornamental, Floral

### Material & Surface Styles
Carbon Fiber, Glass, Glass Blowing, Amber, Coral, Cellulose, DNA, Fiber Optic, Dripping Paint, Splatter Paint, Spray Paint, Wet Paint, Gasoline, Gummies, Ice/Icy, Knitted, Latex, Liquid, Magma, Metallic, Neon, Origami, Slime, Volcanic, Wrinkled

### Science & Tech Styles
Antimatter, Black Hole, Computer Chip, Dark Matter, Diffraction Grading, Electrical, Electronic Circuitry, Higgs Boson, Molecular, Mitochondria, NASA, Nebula, Nuclear, Orbital, Prokaryotic, Quasar, Radioactive, Ray Tracing, Ultrasonic, Wormhole

### Digital Art Styles
Glitchart, Graffiti, Street Art, Chromatic, Multidimensional, Lightspeed, Matter

### Camera & Lens Keywords
360 Panorama, DSLR, Electron Microscope, Macro Lens, Magnification, Microscopy, Miniature Faking (tilt-shift), Panorama, Pinhole Lens, Satellite Imagery, Super Resolution Microscopy, Telephoto Lens, Telescope Lens, Ultra Wide Angle Lens, Wide Angle Lens

### Lighting Keywords
Accent Lighting, Backlight, Blacklight, Blinding Light, Candlelight, Concert Lighting, Crepuscular Rays, Direct Sunlight, Dusk, Edison Bulb, Electric Arc, Fire, Fluorescent, Glowing, Glowing Radioactively, Glowstick, Lava Glow, Moonlight, Natural Lighting, Neon Lamp, Nightclub Lighting, Nuclear Waste Glow, Quantum Dot Display, Spotlight, Strobe, Sunlight, Ultraviolet

### Color Keywords
Baby Blue, Baby Pink, Beige, Blue, Brown, Citrus, Coquelicot, Cyan, CMYK, Gold, Gray, Grayscale, Green, Hot Pink, Indigo, Lavender, Magenta, Matte Black, Mint, Navy Blue, Neon Blue, Neon Green, Neon Orange, Neon Purple, Neon Red, Neon Yellow, Orange, Pink, Red, RGB, Silver, Teal, Turquoise, Vermillion, Violet, White, Yellow

### Material Keywords
Aluminum, Brick, Bronze, Cardboard, Ceramic, Cotton, Fabric, Foil, Gold, Leather, Nickel, Nylon, Paper, Plastic, Quartz, Shrink Wrap, Skin, Wooden, Yarn

### Artist Reference Keywords
Midjourney responds well to these artist names to invoke their visual style:

**Classic Masters**: Leonardo Da Vinci, Michelangelo, Rembrandt, Caravaggio, Johannes Vermeer, JMW Turner, Sandro Botticelli, Eugene Delacroix, Francisco De Goya

**Impressionist / Post-Impressionist**: Monet, Pierre Auguste Renoir, Edgar Degas, Paul Cezanne, Paul Gauguin, Van Gogh

**Modern & Contemporary**: Picasso, Henri Matisse, Paul Klee, Wassily Kandinsky, Piet Mondrian, Marcel Duchamp, Marc Chagall, Salvador Dali, Rene Magritte, Francis Bacon, Frida Kahlo, Diego Rivera, Gustav Klimt, Alphonse Mucha

**Abstract & Pop**: Jackson Pollock, Mark Rothko, Willem De Kooning, Andy Warhol, Roy Lichtenstein, Jean Michel Basquiat, David Hockney, Yayoi Kusama, Takashi Murakami

**Illustration & Fantasy**: Jack Kirby, Gerald Brom, Yoji Shinkawa, Banksy, Art By Yoko Ono

---

## Photography & Film Vocabulary

### Photography Styles
- Photojournalistic, editorial, fashion, street photography
- Product photography, food photography, architectural
- Portrait (environmental, studio, headshot)
- Macro, aerial/drone, astrophotography
- Double exposure, long exposure, tilt-shift

### Camera & Lens References
Mentioning specific gear triggers associated aesthetics:
- "Shot on Hasselblad 500C" → medium format, rich tones
- "Leica M6, 35mm" → street photography feel
- "Canon EOS R5, 85mm f/1.2" → creamy bokeh portraits
- "Fujifilm X-T4" → distinctive color science
- "iPhone" → casual, documentary feel
- "GoPro" → wide angle, action/adventure
- "Kodak Portra 400" → warm, natural skin tones
- "Kodachrome" → saturated, nostalgic color
- "Fuji Velvia" → vivid, punchy landscapes
- "Ilford HP5" → classic black and white grain

### Lighting Vocabulary
- **Natural**: golden hour, blue hour, overcast, dappled sunlight, harsh midday
- **Studio**: Rembrandt lighting, butterfly lighting, split lighting, rim light, key light
- **Atmospheric**: volumetric light, god rays, haze, fog, dust particles
- **Artificial**: neon, fluorescent, candlelight, firelight, LED
- **Dramatic**: chiaroscuro, low-key, high-key, silhouette, backlit

### Rendering Engines (for 3D/digital styles)
- Octane Render, Unreal Engine 5, Blender, Cinema 4D
- Ray tracing, global illumination, subsurface scattering
- Isometric, low-poly, voxel

---

## Art Movement Keywords

| Movement | Visual Characteristics |
|----------|----------------------|
| Art Nouveau | Organic flowing lines, botanical motifs, decorative |
| Art Deco | Geometric patterns, gold/black, symmetry, luxury |
| Bauhaus | Primary colors, geometric shapes, functional |
| Impressionism | Visible brushstrokes, light effects, everyday scenes |
| Surrealism | Dream logic, impossible juxtapositions, melting forms |
| Cyberpunk | Neon, rain, high-tech low-life, dark urban |
| Steampunk | Victorian machinery, brass, gears, goggles |
| Vaporwave | Pastel gradients, Greek busts, 80s/90s nostalgia, glitch |
| Brutalism | Raw concrete, massive forms, stark geometry |
| Minimalism | Reduction, negative space, essential forms |
| Baroque | Dramatic, ornate, rich color, dynamic movement |
| Ukiyo-e | Japanese woodblock style, flat perspective, waves |
| Pop Art | Bold colors, halftone dots, consumer culture |
| Gothic | Dark, pointed arches, ornate, mysterious |

---

## Common Pitfalls

1. **Overloading the prompt** — Keep under 60 descriptive words. MJ prioritizes early words; late words may be ignored.

2. **Saying what you DON'T want in the text prompt** — "A party with no cake" will often produce cake. Use `--no cake` instead.

3. **Ignoring aspect ratio** — Always set --ar to match your target platform. Default 1:1 is rarely what you want for finished work.

4. **Maxing stylize for "better" results** — High --s makes images beautiful but less prompt-adherent. Start at 100, adjust from there.

5. **Trusting in-image text** — MJ is unreliable for text rendering. Create the visual, add real typography in a design tool.

6. **Not using --no** — Stray text, watermarks, borders, and unwanted elements are easily suppressed.

7. **Reusing V6 sref codes in V7** — Old codes may produce different styles. Use --sv 4 for old behavior or regenerate codes.

8. **Using seeds in Turbo mode** — Seed locking is unreliable at turbo speed. Use --fast or --relax for seed consistency.

---

## Parameter Recipes

### Photorealistic Portrait
```
professional headshot, natural lighting, shallow depth of field, 85mm lens, shot on Canon EOS R5, sharp focus --ar 2:3 --s 50 --q 2
```

### Cinematic Scene
```
[scene description], anamorphic lens, film grain, cinematic lighting, volumetric fog --ar 2.39:1 --s 200 --q 2
```

### Editorial / Magazine Cover
```
[subject], studio portrait, clean background, editorial fashion photography --ar 2:3 --s 160 --no text
```

### Product Shot
```
[product] on minimal surface, soft studio lighting, product photography, clean white background --ar 4:5 --s 80
```

### Fantasy / Concept Art
```
[scene description], epic composition, dramatic lighting, detailed environment, concept art --ar 16:9 --s 400 --q 2
```

### Seamless Pattern / Texture
```
[pattern description], seamless tileable pattern, flat design --tile --ar 1:1 --s 100
```

### Surreal / Experimental
```
[concept], surreal composition, impossible geometry --ar 1:1 --s 300 --weird 500 --c 40
```

### Album Cover / Poster
```
[concept], bold composition, high contrast, negative space for copy --ar 1:1 --s 220 --no text
```

### Logo / Emblem Exploration
```
[concept] emblem, minimal, clean vector style, solid background --ar 1:1 --s 180 --no letters, extra text
```

### Vintage / Retro
```
[scene], Kodachrome film, 1970s color palette, film grain, slight vignette --ar 3:2 --s 200
```

### Anime / Manga
```
[character/scene description], detailed anime style --niji --ar 2:3 --s 150
```

---

## Iteration Strategy

When results aren't right, guide the user through this progression:

1. **First**: Adjust the text prompt — reorder words, add/remove descriptors
2. **Second**: Tune --stylize up or down
3. **Third**: Add --no for unwanted elements
4. **Fourth**: Try different --chaos values to explore alternatives
5. **Fifth**: Use --seed to lock a good composition, then tweak other params
6. **Sixth**: Use --sref with a reference image that captures the target aesthetic
7. **Last resort**: Use Vary Region / inpainting to fix specific areas
