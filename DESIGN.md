---
version: alpha
name: 'Satiaya Property Corporate'
description: 'A premium Malaysian property advisory experience built around confident navy, restrained gold and quiet neutral surfaces.'
colors:
  primary: '#0B2D5C'
  secondary: '#174A8B'
  accent: '#D4AF37'
  accent-light: '#E8C96A'
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

# Satiaya Property Corporate Design System

## Overview

### Creative North Star

The visual reference is a well-appointed Malaysian corporate property advisory office: deep navy architectural surfaces, crisp white documents and a small amount of brushed-gold detailing used like a seal of trust.

### Product context and register

- **Audience and primary job:** Malaysian buyers, tenants, owners and landlords who need to discover listings, understand services and contact Satiaya; the owner uses the protected dashboard to maintain the same content.
- **Target market(s) and evidence:** Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson, as named in the website configuration and hero content.
- **Locale(s) and language policy:** English (`en-MY`) is the current interface language. Property prices retain Malaysian Ringgit formatting. Additional locales require reviewed translations rather than mixed-language controls.
- **Usage scene:** Mobile-first property discovery with desktop comparison and an authenticated desktop/mobile content editor.
- **Register:** Hybrid. The public routes are premium brand-led marketing; `/admin` is a quiet, task-led editing surface.
- **Memorable signature:** Property imagery is framed by a deep-navy cinematic veil with a fine gold trust accent.
- **Restraint:** Forms, cards, listings and dashboard controls remain white or light grey; gold is reserved for primary calls to action, selected states, icons and fine highlights.
- **Anti-references:** Avoid casino-like black-and-gold styling, bright neon accents, all-blue slabs, decorative gradients and low-contrast gold body copy.
- **Token ownership/runtime mapping:** `app/globals.css` is the canonical runtime source. This document mirrors its accepted semantic roles. Tailwind utilities consume those CSS variables; raw colours are permitted only for exact brand accents, image overlays and third-party marks. Drift is checked by repository colour search and production browser review.

## Colors

Primary navy `#0B2D5C` owns headings, dark sections, navigation emphasis and the footer. Secondary blue `#174A8B` owns secondary actions, links, focus rings and informational states. Gold `#D4AF37` is an accent and primary-action fill; light gold `#E8C96A` is its hover or dark-surface companion. Pages use `#F7F8FA`, cards use white, and normal text uses `#1F2937`. Muted copy uses `#5B6574`, borders use `#E1E6ED`, and destructive feedback remains semantic red. Gold is not used for small text on white. Selection uses light gold with navy text. The defined dark tokens preserve the same hierarchy if a future route enables dark mode.

## Typography

Manrope is the heading face and DM Sans is the interface/body face. Headings use compact tracking and medium-to-bold weights; body copy uses comfortable line height and sentence case. Regular controls and body copy should remain at least 14–16px, with 12–13px reserved for metadata and uppercase kickers. Numeric property values remain tabular where a component needs alignment.

## Layout

The public experience keeps its existing narrative section order and max width of 80rem. The dashboard keeps its 1520px working canvas and responsive sidebar-to-horizontal-tab transformation. Existing spacing, safe areas, section geometry and breakpoints are preserved during theme changes. Controls retain stable dimensions across idle, loading, success and error states.

## Elevation & Depth

Hierarchy comes from white cards on light-grey fields, fine cool-grey borders and low-opacity navy shadows. The hero may use navy image overlays and subtle glass treatment. Gold never becomes a large background field except for compact primary actions or status accents. Dashboard forms avoid decorative elevation inside cards.

## Shapes

The base radius is 0.75rem. Fields and dashboard controls use 0.75–1rem radii, cards use approximately 1.5–2rem, and compact CTAs or badges may be pill-shaped. Icon containers use simple circles or rounded squares with consistent Lucide strokes.

## Components

### Foundational visual states

Default surfaces are white with cool-grey borders. Hover uses light blue-grey or a controlled shift from navy to secondary blue. Focus-visible uses the secondary-blue ring. Selected navigation uses navy or gold according to surface contrast. Disabled controls retain geometry and reduce opacity. Success is communicated with an icon plus blue informational treatment; warning and errors retain explicit text and semantic colour.

### Buttons and actions

Primary calls to action use gold with navy text and light-gold hover. Secondary actions use secondary blue with white text. Outline and ghost actions use navy text on light surfaces with blue-tinted hover. Destructive actions remain visually separate. Icons accompany labels where meaning benefits, and busy states do not resize buttons.

### Navigation and data display

Public navigation sits on white with navy text and restrained gold hover. The footer and dashboard sidebar use primary navy, white text and small gold accents. Property tabs use navy for the selected state. Cards stay white with cool-grey borders; featured badges use gold with navy text.

### Forms and overlays

Inputs use white or `#F7F8FA`, cool-grey borders, main-text labels and secondary-blue focus treatment. Validation remains textual and field-associated. Existing native selects, authenticated flows, uploads and save feedback retain their current behavior and layout.

### Iconography

Lucide is the canonical icon family, using consistent outline strokes at 16–20px for controls. Gold denotes highlights and trust signals; blue denotes navigation, utilities and secondary actions. Icon-only controls keep accessible names.

### Motion

Motion remains restrained: short colour/elevation transitions and the existing slow cinematic hero drift. Motion communicates affordance without changing layout, and `prefers-reduced-motion` disables the hero animation.

### Content and data visualization

Copy and property data remain unchanged by theme work. The voice is direct, personal and professional. Any future charts start with primary navy and secondary blue, using gold for a single emphasis series and providing a text alternative.

## Do's and Don'ts

- **Do:** Let navy establish trust and gold identify the most important action or detail.
- **Do:** Build new pages from the shared semantic tokens in `app/globals.css`.
- **Don't:** use gold for paragraphs, small labels or large decorative surfaces on white.
- **Don't:** reintroduce green, orange, neon accents or ad-hoc colour literals outside approved third-party marks and semantic alerts.
