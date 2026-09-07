---
version: alpha
name: 'Satiaya Property Midnight & Cyan'
description: 'A premium Malaysian property advisory experience built around midnight blue, vivid cyan, controlled violet and quiet neutral surfaces.'
colors:
  primary: '#000040'
  secondary: '#4133BA'
  accent: '#00B1FC'
  accent-light: '#70D7FF'
  background: '#F7F8FA'
  surface: '#FFFFFF'
  text: '#1F2937'
  muted: '#EDF2F7'
  muted-text: '#5B6574'
  border: '#E1E6ED'
  destructive: '#C0392B'
typography:
  sans:
    fontFamily: 'DM Sans, system-ui, sans-serif'
  heading:
    fontFamily: 'Manrope, DM Sans, system-ui, sans-serif'
  mono:
    fontFamily: 'ui-monospace, monospace'
rounded:
  DEFAULT: '0.75rem'
  sm: '0.45rem'
  md: '0.6rem'
  lg: '0.75rem'
  xl: '1.05rem'
spacing:
  section-gap: '5rem'
  page-max: '80rem'
components:
  button:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.primary}'
    rounded: '{rounded.lg}'
  button-hover:
    backgroundColor: '{colors.accent-light}'
    textColor: '{colors.primary}'
  destructive-action:
    backgroundColor: '{colors.destructive}'
    textColor: '{colors.surface}'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text}'
    rounded: '{rounded.xl}'
  input:
    backgroundColor: '{colors.background}'
    textColor: '{colors.text}'
    rounded: '{rounded.DEFAULT}'
  muted-surface:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.muted-text}'
  divider:
    backgroundColor: '{colors.border}'
  navigation:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
  tabs:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
  badge:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.primary}'
    rounded: '{rounded.xl}'
---

# Satiaya Property Midnight Blue & Cyan Design System

## Overview

### Creative North Star

The visual reference is the crisp Malaysian corporate language seen on ICDM: near-black midnight blue, vivid cyan actions, controlled royal-violet depth, generous white space and sharp geometric contrast. The property site retains its own imagery, content and layout.

### Product context and register

- **Audience and primary job:** Malaysian buyers, tenants, owners and landlords who need to discover listings, understand services and contact Satiaya; the owner uses the protected dashboard to maintain the same content.
- **Target market(s) and evidence:** Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson, as named in the website configuration and hero content.
- **Locale(s) and language policy:** English (`en-MY`) is the current interface language. Property prices retain Malaysian Ringgit formatting. Additional locales require reviewed translations rather than mixed-language controls.
- **Usage scene:** Mobile-first property discovery with desktop comparison and an authenticated desktop/mobile content editor.
- **Register:** Hybrid. The public routes are premium brand-led marketing; `/admin` is a quiet, task-led editing surface.
- **Memorable signature:** Property imagery is framed by a midnight-blue cinematic veil, with vivid cyan used as a precise directional accent.
- **Restraint:** Forms, cards, listings and dashboard controls remain white or light grey; cyan identifies primary actions and highlights, while violet appears only for secondary emphasis and depth.
- **Anti-references:** Avoid unrelated campaign colours, rainbow palettes, all-blue slabs, decorative gradients and low-contrast cyan body copy.
- **Token ownership/runtime mapping:** `app/globals.css` is the canonical runtime source. The higher-specificity `html[data-theme='corporate']` selector guarantees that every route and future component inherits the corporate tokens even when library defaults are present. This document mirrors those accepted semantic roles. Tailwind utilities consume the CSS variables; raw colours are permitted only for exact brand accents, image overlays and third-party marks. Drift is checked by repository colour search and production browser review.

## Colors

Midnight blue `#000040` owns headings, dark sections, navigation emphasis and the footer. Royal violet `#4133BA` owns secondary actions, focus rings and selected depth. Vivid cyan `#00B1FC` is the primary accent and action fill; light cyan `#70D7FF` is its hover or dark-surface companion. Pages use `#F7F8FA`, cards use white, and normal text uses `#1F2937`. Muted copy uses `#5B6574`, borders use `#E1E6ED`, and destructive feedback remains semantic red. Cyan is not used for small text on white. Selection uses light cyan with midnight text. The defined dark tokens preserve the same hierarchy if a future route enables dark mode.

## Typography

Manrope is the heading face and DM Sans is the interface/body face. Headings use compact tracking and medium-to-bold weights; body copy uses comfortable line height and sentence case. Regular controls and body copy should remain at least 14–16px, with 12–13px reserved for metadata and uppercase kickers. Numeric property values remain tabular where a component needs alignment.

## Layout

The public experience keeps its existing narrative section order and max width of 80rem. The dashboard keeps its 1520px working canvas and responsive sidebar-to-horizontal-tab transformation. Existing spacing, safe areas, section geometry and breakpoints are preserved during theme changes. Controls retain stable dimensions across idle, loading, success and error states.

## Elevation & Depth

Hierarchy comes from white cards on light-grey fields, fine cool-grey borders and low-opacity midnight-blue shadows. The hero uses layered midnight and violet image overlays with subtle glass treatment. Cyan remains concentrated in compact actions and status accents. Dashboard forms avoid decorative elevation inside cards.

## Shapes

The base radius is 0.75rem. Fields and dashboard controls use 0.75–1rem radii, cards use approximately 1.5–2rem, and compact CTAs or badges may be pill-shaped. Icon containers use simple circles or rounded squares with consistent Lucide strokes.

## Components

### Foundational visual states

Default surfaces are white with cool-grey borders. Hover uses pale cyan-grey or a controlled shift from midnight to violet. Focus-visible uses the violet ring. Selected navigation uses midnight, violet or cyan according to surface contrast. Disabled controls retain geometry and reduce opacity. Success is communicated with an icon plus blue informational treatment; warning and errors retain explicit text and semantic colour.

### Buttons and actions

Primary calls to action use vivid cyan with midnight text and light-cyan hover. Secondary actions use violet or midnight with white text. Outline and ghost actions use midnight text on light surfaces with cyan-tinted hover. Destructive actions remain visually separate. Icons accompany labels where meaning benefits, and busy states do not resize buttons.

### Navigation and data display

Public navigation sits on white with midnight text and restrained cyan hover. The footer and dashboard sidebar use midnight blue, white text and small cyan accents. Property tabs use midnight for the selected state. Cards stay white with cool-grey borders; featured badges use cyan with midnight text.

### Forms and overlays

Inputs use white or `#F7F8FA`, cool-grey borders, main-text labels and secondary-blue focus treatment. Validation remains textual and field-associated. Existing native selects, authenticated flows, uploads and save feedback retain their current behavior and layout.

### Iconography

Lucide is the canonical icon family, using consistent outline strokes at 16–20px for controls. Cyan denotes highlights and trust signals; midnight and violet denote navigation, utilities and secondary actions. Icon-only controls keep accessible names.

### Motion

Motion remains restrained: short colour/elevation transitions and the existing slow cinematic hero drift. Motion communicates affordance without changing layout, and `prefers-reduced-motion` disables the hero animation.

### Content and data visualization

Copy and property data remain unchanged by theme work. The voice is direct, personal and professional. Any future charts start with midnight blue and royal violet, using cyan for a single emphasis series and providing a text alternative.

## Do's and Don'ts

- **Do:** Let midnight blue establish trust and cyan identify the most important action or detail.
- **Do:** Build new pages from the shared semantic tokens in `app/globals.css`.
- **Don't:** use vivid cyan for paragraphs, small labels or large decorative surfaces on white.
- **Don't:** reintroduce green, gold, orange or ad-hoc campaign colours outside approved third-party marks and semantic alerts.
