---
version: alpha
name: 'Satiaya Property Search-Led Teal'
description: 'A clean Malaysian property advisory experience built around standout typography, confident turquoise and quiet white surfaces.'
colors:
  primary: '#173F4A'
  secondary: '#16807F'
  accent: '#2DB8B5'
  accent-light: '#77D9D4'
  background: '#F5F8F9'
  surface: '#FFFFFF'
  text: '#24343A'
  muted: '#EAF2F3'
  muted-text: '#5F7077'
  border: '#D9E6E7'
  destructive: '#C0392B'
typography:
  sans:
    fontFamily: 'Inter, system-ui, sans-serif'
  heading:
    fontFamily: 'Manrope, Inter, system-ui, sans-serif'
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
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.surface}'
    rounded: '{rounded.lg}'
  button-hover:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
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
  highlight:
    backgroundColor: '{colors.accent-light}'
    textColor: '{colors.primary}'
---

# Satiaya Property Premium Teal Design System

## Overview

### Creative North Star

The visual reference combines PropertyGuru Malaysia's search-first clarity and restrained information hierarchy with Satiaya's established turquoise identity. Satiaya's interpretation uses precise Manrope headlines, flatter white surfaces and calm teal actions so the site feels direct, personal and trustworthy rather than copied. The existing imagery, content and editorial structure remain Satiaya's own.

### Product context and register

- **Audience and primary job:** Malaysian buyers, tenants, owners and landlords who need to discover listings, understand services and contact Satiaya; the owner uses the protected dashboard to maintain the same content.
- **Target market(s) and evidence:** Kuala Lumpur, Selangor, Klang Valley, Negeri Sembilan and Port Dickson, as named in the website configuration and hero content.
- **Locale(s) and language policy:** English (`en-MY`) is the current interface language. Property prices retain Malaysian Ringgit formatting. Additional locales require reviewed translations rather than mixed-language controls.
- **Usage scene:** Mobile-first property discovery with desktop comparison and an authenticated desktop/mobile content editor.
- **Register:** Hybrid. The public routes are premium brand-led marketing; `/admin` is a quiet, task-led editing surface.
- **Memorable signature:** Precise Manrope headlines and a slim teal rule create an architectural editorial voice, while turquoise identifies the single next action.
- **Restraint:** Forms, cards, listings and dashboard controls remain white or mist grey; turquoise identifies primary actions while deep teal carries headings and trust-heavy surfaces. Elevation is quiet and decorative motion is minimal.
- **Anti-references:** Avoid unrelated campaign colours, rainbow palettes, large decorative gradients, neon effects and low-contrast turquoise body copy.
- **Token ownership/runtime mapping:** `app/globals.css` is the canonical runtime source. The higher-specificity `html[data-theme='corporate']` selector guarantees that every route and future component inherits the corporate tokens even when library defaults are present. This document mirrors those accepted semantic roles. Tailwind utilities consume the CSS variables; raw colours are permitted only for exact brand accents, image overlays and third-party marks. Drift is checked by repository colour search and production browser review.

## Colors

Deep teal `#173F4A` owns headings, dark sections, navigation emphasis and the footer. Accessible action teal `#16807F` owns buttons, focus rings and selected depth. PropertyHunter-inspired turquoise `#2DB8B5` is the bright brand accent; aqua `#77D9D4` is used sparingly for highlights on dark surfaces. Pages use `#F5F8F9`, cards use white, and normal text uses `#24343A`. Muted copy uses `#5F7077`, borders use `#D9E6E7`, and destructive feedback remains semantic red. Bright turquoise is not used behind small white text. Selection uses aqua with deep-teal text.

## Typography

Manrope is the heading face and Inter is the interface/body face. Manrope gives the property experience a precise, architectural voice while Inter keeps forms and detailed information neutral. Display headings use semibold weight, approximately `-0.035em` to `-0.055em` tracking and a compact `1.02–1.10` line height. Body copy uses subtly tightened tracking and a `1.65` baseline line height; navigation and controls remain compact and highly legible. Regular controls and body copy remain at least 14–16px, with 11–13px reserved for metadata and compact uppercase kickers. Numeric property values remain tabular where a component needs alignment.

## Layout

The public experience keeps its existing narrative section order and max width of 80rem. The dashboard keeps its 1520px working canvas and responsive sidebar-to-horizontal-tab transformation. Existing spacing, safe areas, section geometry and breakpoints are preserved during theme changes. Controls retain stable dimensions across idle, loading, success and error states.

## Elevation & Depth

Hierarchy comes from white cards on alternating white and mist-grey sections, fine blue-grey borders and very low-opacity deep-teal shadows. The hero uses a clean deep-teal image veil without decorative glass effects. Turquoise remains concentrated in compact actions and status accents. Dashboard forms avoid decorative elevation inside cards.

## Shapes

The base radius is 0.75rem. Fields and dashboard controls use 0.75–1rem radii, cards use approximately 1.5–2rem, and compact CTAs or badges may be pill-shaped. Icon containers use simple circles or rounded squares with consistent Lucide strokes.

## Components

### Foundational visual states

Default surfaces are white with blue-grey borders. Hover uses pale aqua-grey or a controlled shift from turquoise to deeper teal. Focus-visible uses the supporting-teal ring. Selected navigation uses deep teal or turquoise according to surface contrast. Disabled controls retain geometry and reduce opacity. Success is communicated with an icon plus teal informational treatment; warning and errors retain explicit text and semantic colour.

### Buttons and actions

Primary calls to action use turquoise with white text and a deeper-teal hover. Buttons use 12px geometry, a controlled 1px hover lift and compact teal elevation without decorative shine. Motion runs on a quick 180ms easing curve, settles on press and is removed under `prefers-reduced-motion`. Secondary actions use supporting or deep teal with white text. Outline and ghost actions use deep-teal text on light surfaces with an aqua-tinted hover. Destructive actions remain visually separate. Icons accompany labels where meaning benefits, and busy states do not resize buttons.

### Navigation and data display

Public navigation sits on white with deep-teal text and restrained turquoise hover. The footer and dashboard sidebar use deep teal, white text and small turquoise accents. Property tabs use deep teal for the selected state. Cards stay white with blue-grey borders; featured badges use turquoise with deep-teal text.

### Forms and overlays

Inputs use white or `#F5F8F9`, blue-grey borders, main-text labels and supporting-teal focus treatment. Validation remains textual and field-associated. Existing native selects, authenticated flows, uploads and save feedback retain their current behavior and layout.

### Visual content editor

The dashboard opens with a three-pane visual editor: searchable page layers, an exact same-origin website preview, and a focused inspector. A compact white toolbar owns viewport switching, undo/redo, preview and publishing. Editable elements receive turquoise selection outlines only inside editor mode; these affordances never appear on the public website. Detailed section forms remain available as the canonical fallback for every field and advanced listing control.

### Iconography

Lucide is the canonical icon family, using consistent outline strokes at 16–20px for controls. Turquoise denotes highlights and trust signals; deep and supporting teal denote navigation, utilities and secondary actions. Icon-only controls keep accessible names.

### Motion

Motion remains restrained: a single highlight sweep and 2px lift for primary actions, short colour/elevation transitions elsewhere, and the existing slow cinematic hero drift. Motion communicates affordance without changing layout, and `prefers-reduced-motion` disables both button effects and the hero animation.

### Content and data visualization

Copy and property data remain unchanged by theme work. The voice is direct, personal and professional. Any future charts start with deep and supporting teal, using turquoise for a single emphasis series and providing a text alternative.

### Property detail pages

Every listing opens a dedicated, shareable `/properties/[id]` page before an enquiry action. The page uses an image-led gallery with a quiet Photos / Map view switch, a clear title and asking price, scannable property facts, structured long-form details and a sticky agent enquiry card on large screens. The gallery uses one large cover image with supporting images to create an editorial property-brochure signature; it collapses into a touch-friendly grid on narrow screens. Detail pages may only present attributes available in the stored listing; tenure, furnishing, facilities and other facts must never be invented. WhatsApp remains an explicit action within the detail page rather than the destination of a catalogue card.

Property photos are direct zoom targets. Selecting any gallery image opens a restrained full-screen viewer with object-contain presentation, a position counter, thumbnail navigation when multiple photos exist, and high-contrast controls that do not compete with the image.

For-sale detail pages include a two-button Home Loan & DSR calculator area after the complete property-information area and before further listing recommendations. Mortgage and DSR calculations are presented as separate views so visitors see only the fields relevant to their current task; the mortgage instalment remains connected to the DSR calculation. White and pale-mist input panels with a deep-teal summary reuse the established property-card language, while turquoise is limited to financing emphasis. The listing price is the starting value, and all financial inputs remain editable locally. Results never imply lender approval, and detailed visitor income and commitments are never persisted or included in WhatsApp summaries.

## Do's and Don'ts

- **Do:** Let deep teal establish trust and turquoise identify the most important action or detail.
- **Do:** Build new pages from the shared semantic tokens in `app/globals.css`.
- **Don't:** use bright turquoise for paragraphs, small labels or large decorative surfaces on white.
- **Don't:** add gold, orange, violet or ad-hoc campaign colours outside approved third-party marks and semantic alerts.
