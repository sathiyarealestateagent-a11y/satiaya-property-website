# UX Contract

## Product context

- Audience: the authenticated website owner editing a Malaysian real-estate website.
- Primary job: update, arrange and publish public-site content without changing code.
- Active locale: English (`en-MY`); Malaysian Ringgit and `Asia/Kuala_Lumpur` conventions.
- Accessibility target: WCAG 2.2 AA.

## Business-context sources

| Domain / scope         | Authoritative source                                          | Source type        | Reviewed date |
| ---------------------- | ------------------------------------------------------------- | ------------------ | ------------- |
| Admin permission model | `supabase/migrations/20260904134258_initial_site_backend.sql` | Database policy    | 2026-09-07    |
| Content lifecycle      | `app/api/admin/content/route.ts`, `db/content.ts`             | API implementation | 2026-09-07    |
| Editor behavior        | Current user request and this contract                        | Product decision   | 2026-09-07    |

## Visual contract

- Project visual source: `DESIGN.md`.
- Runtime tokens remain canonical in `app/globals.css`; `DESIGN.md` mirrors their accepted roles.
- The visual editor follows the same teal, white and mist-grey system as the public website.

## Canonical UI Map

| Capability | Canonical owner                                                  | Source of truth                | Allowed variants    | Verification           |
| ---------- | ---------------------------------------------------------------- | ------------------------------ | ------------------- | ---------------------- |
| Form       | Existing shared fields plus Zod content schema                   | `src/content/schema.ts`        | edit                | lint + build + browser |
| Scrollbar  | Global application stylesheet                                    | `DESIGN.md`, `app/globals.css` | geometry exceptions | browser                |
| CRUD       | `AdminDashboard` history/save flow and authenticated content API | This contract                  | stay in editor      | full-flow browser      |

## Editor behavior

- Every public-page section appears in the Page layers panel.
- Sections can be reordered by drag and drop or by the equivalent Move up / Move down buttons.
- Text and link layers can be selected from the content list or directly on the live page preview, then edited in the inspector.
- Containers, cards, images and registered icons appear in a separate layer group and can also be selected directly on the preview.
- The design inspector supports typography, alignment, text/fill colour, opacity, responsive width, padding, margins, radius and icon sizing. Reset style returns a layer to the design-system default.
- Registered icon layers provide a safe icon-library selector as well as size and colour controls. Registered decorative lines provide width, thickness, colour, remove and restore controls.
- Layout editing intentionally uses responsive width and spacing controls instead of unrestricted absolute X/Y positioning, so owner changes remain usable on mobile screens.
- Removing a section or element is reversible: it is hidden from the public page, retained in the dashboard, and can be restored before or after publishing.
- Individual property, service, statistic and navigation records continue to use their detailed list controls for permanent record deletion.
- Every change updates the preview immediately, enters the shared undo history, and remains private until **Save & publish** succeeds.
- Hidden navigation destinations are removed from public header and footer navigation while their target section is hidden.

## Public listing behavior

- Selecting a property card image, title or arrow opens its dedicated `/properties/[id]` page in the same tab.
- A property detail page presents the stored photo, title, location, asking price, bedrooms, bathrooms, size and property type before contact actions.
- A listing supports up to 12 stored photos. The first photo is the cover; four or more photos are recommended, while legacy one-photo listings remain valid.
- The public media panel switches between Photos and Map view without navigating away. Map view uses saved coordinates when both are present and otherwise searches the saved full address or location.
- Selecting any gallery photo opens a modal full-size viewer. Multiple-photo listings provide previous/next buttons, thumbnail selection and Left/Right Arrow navigation; Escape or the Close button exits the viewer and restores focus to the selected gallery photo.
- Share listing invokes the device share sheet when available. Facebook has a direct web share action; Instagram and TikTok copy the listing URL before opening their publishing surfaces because those platforms do not provide a general URL-prefilled web composer.
- Long-form listing introduction, package/promotions, project information and amenities preserve the owner's line breaks and remain optional.
- WhatsApp, phone and email are explicit enquiry actions on the detail page; catalogue navigation never opens WhatsApp directly.
- An unknown or removed property ID presents a recoverable not-found state with a route back to the current listings.

## Flow ledger

| Operation               | Trigger                   | Pending                        | Success destination | Success feedback           | Failure recovery             | Focus outcome               |
| ----------------------- | ------------------------- | ------------------------------ | ------------------- | -------------------------- | ---------------------------- | --------------------------- |
| Reorder section         | Drag/drop or arrow button | Local immediate preview        | Stay in editor      | Dirty state                | Undo                         | Remains on control          |
| Remove element/section  | Remove button             | Local immediate preview        | Stay in editor      | Strikethrough/hidden state | Restore or Undo              | Remains in inspector/layers |
| Restore element/section | Restore button            | Local immediate preview        | Stay in editor      | Visible state              | Undo                         | Remains on control          |
| Restyle selected layer  | Inspector design control  | Local immediate preview        | Stay in editor      | Dirty state                | Reset style or Undo          | Remains in inspector        |
| Publish                 | Save & publish            | Busy button; duplicate blocked | Stay in editor      | Published status           | Inline error; draft retained | Save control/status         |

## Async and resilience

- Publishing is pessimistic; the public state changes only after the authenticated API and Supabase write succeed.
- Duplicate publish is blocked while saving. Failed saves retain the complete draft and expose retry through the same action.
- Undo/redo keeps up to 50 local snapshots. The API validates the full content structure before persistence.
- Session and authorization remain server-verified by Supabase before every content mutation.

## Verification

- Required commands: formatter, `npm run lint`, `npm run build`, strict premium UI audit, and `designmd lint DESIGN.md` when visual tokens change.
- Browser matrix: public preview plus authenticated editor at desktop and narrow viewport; verify reorder, remove, restore, undo, publish, and reload persistence.
