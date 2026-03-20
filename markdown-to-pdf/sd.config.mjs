import StyleDictionary from 'style-dictionary';

/* ---------------------------------------------------------------------------
 * PDF-specific Style Dictionary config
 *
 * Reads the same WE3 master token file, but only outputs tokens
 * relevant to print/PDF. Skips grid, motion, z-index, radius,
 * layout, and web-specific components.
 * ------------------------------------------------------------------------ */

const kebab = (s) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/* --- WE3 3-Tier Naming Convention --- */
const TIER = { reference: 'ref', system: 'sys', component: 'comp' };

const REF_DROP = new Set(['palette', 'typography']);
const REF_RENAME = { spacing: 'space', family: 'font', scale: 'text' };

const SYS_TYPO = {
  fontFamily: 'font-family',
  displayFamily: 'display-family',
  monoFamily: 'mono-family',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  h1Size: 'text-h1',
  h2Size: 'text-h2',
  h3Size: 'text-h3',
  h4Size: 'text-h4',
};

const SYS_SURFACE = {
  pageBackground: 'page',
  cardFill: 'card',
  altFill: 'alt',
  border: 'border',
};

/* --- Custom name transform --- */
StyleDictionary.registerTransform({
  name: 'name/we3',
  type: 'name',
  transform: (token) => {
    const [tier, ...rest] = token.path;
    const prefix = TIER[tier] || tier;
    let segs = [...rest];

    if (tier === 'reference') {
      segs = segs.filter((s) => !REF_DROP.has(s));
      segs = segs.map((s) => REF_RENAME[s] || s);
    }

    if (tier === 'system') {
      if (segs[0] === 'typography' && SYS_TYPO[segs[1]]) {
        segs = SYS_TYPO[segs[1]].split('-');
      } else if (segs[0] === 'typography') {
        segs.shift();
      }
      if (segs[0] === 'surface' && SYS_SURFACE[segs[1]]) {
        segs = ['surface', ...SYS_SURFACE[segs[1]].split('-')];
      }
    }

    return `${prefix}-${segs.map(kebab).join('-')}`;
  },
});

/* --- Filter: only PDF-relevant tokens --- */
const SKIP_REF = new Set(['grid', 'motion', 'radius']);
const SKIP_SYS = new Set(['motion', 'zIndex', 'layout', 'spacing']);
const SKIP_COMP = new Set([
  'button', 'card', 'panel', 'input', 'badge',
  'stripe', 'cursor', 'icon',
]);

StyleDictionary.registerFilter({
  name: 'pdf-only',
  filter: (token) => {
    const [tier, group] = token.path;
    if (tier === 'reference' && SKIP_REF.has(group)) return false;
    if (tier === 'system' && SKIP_SYS.has(group)) return false;
    if (tier === 'component' && SKIP_COMP.has(group)) return false;
    return true;
  },
});

/* --- Config --- */
export default {
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  platforms: {
    css: {
      transforms: ['name/we3'],
      buildPath: 'styles/',
      files: [
        {
          destination: 'tokens.generated.css',
          format: 'css/variables',
          filter: 'pdf-only',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};
