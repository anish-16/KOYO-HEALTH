# Photography & package artwork

## One system: a person, a category, a number

Package cards and package pages render `src/components/packages/PackageArt.tsx`, which layers three
things on one panel:

1. **A person** whose subject matches the panel — a man for men's health, a woman for women's, a
   couple for fertility, an older adult for cancer screening, a family for the full body check. The
   mapping is per slug in `src/data/families.ts`; `tests/unit/people.test.ts` asserts each panel's
   subject and proves that no photograph repeats within four catalogue positions, so no two
   neighbouring cards in a three-column grid show the same face. Equipment shots (microscope, lab
   bench, boardroom) are deliberately excluded from cards — a card sells a checkup to a person.
2. **A category tone** — Essential / Advanced / Premium / Focused each get their own wash and scrim,
   which sorts the catalogue visually and keeps a shared subject from looking like a duplicate.
3. **A number** — the discipline glyph, the parameter count, the test count and the report time.

The eight category tiles on `/packages` and the homepage come from the same source: every tile is a
real filter (`/packages?family=women`) and its count and starting price are computed from the 18
packages, so no tile can point at an empty result.

## Files

Every human photograph is self-hosted from `public/images/people/` — nothing is hot-linked at runtime,
so the CSP stays `img-src 'self'` and no third-party request is made while a patient reads a page.

All files come from [Pexels](https://www.pexels.com/license/) (free for commercial use, no attribution
required). They are requested once at the exact pixel size each placement renders at, so the bytes on
disk are the bytes on the wire.

| File | Pexels photo | Used for |
| --- | --- | --- |
| `hero-family.jpg` | 14124346 | Packages index banner (one visit, whole family) |
| `care-mother.jpg` | 11708068 | Homepage "care that comes home" inset |
| `sample-collection.jpg` | 6285344 | Homepage care section, "who comes to you" card on package pages |
| `clinician.jpg` | 5888168 | Homepage expert-guidance section, clinician review |
| `senior-care.jpg` | 18870282 | Senior care tile, senior and cancer-screening panels |
| `couple-mature.jpg` | 5784940 | Mature-couple placements |
| `couple-young.jpg` | 38781069 | Fertility & pregnancy tile, fertility and pregnancy panels |
| `kids.jpg` | 9633840 | Paediatric placements (package cards use `pediatrician.jpg`) |
| `pediatrician.jpg` | 5998455 | Paediatric placements |
| `women.jpg` | 37951162 | Women's health tile and women's panels |
| `corporate.jpg` | 7580766 | Men's health tile and men's panels, corporate wellness hero |
| `meeting.jpg` | 1181370 | Corporate wellness (never on a package card) |
| `corporate-manufacturing.jpg` | Pexels search "garment factory worker" | Corporate wellness: manufacturing sector, field strip |
| `corporate-logistics.jpg` | Pexels search "warehouse logistics worker" | Corporate wellness: logistics card, field strip |
| `corporate-vaccination.jpg` | Pexels search "vaccination arm" | Corporate wellness: onsite camp programme \(\times2\) |
| `lab-researcher.jpg` | 4031319 | Laboratory credibility (never on a package card) |
| `lab-microscope.jpg` | 9243372 | Laboratory credibility, drug-testing programme (never on a package card) |

## Conventions

- **One registry.** `src/data/people.ts` holds the file path, alt text, caption and intrinsic size of
  every photograph. Components never take a raw string path.
- **Alt text describes the photograph**, not the marketing claim: "A phlebotomist in gloves drawing
  blood from a patient's arm into a collection tube", not "home collection".
- **Packages are data-keyed, not photo-keyed.** `PackageArt` derives its tone from
  `HealthPackage['category']` and its glyph from the package name, so a new package inherits artwork
  automatically and cannot ship as a duplicate of another card.
- **Fixed dimensions.** `src/components/media/PersonPhoto.tsx` always sets `width`/`height`, lazy
  loads below the fold, and uses a plain `<img>` because the crop already produced the final size —
  the Next.js optimiser would only add a cache layer and a `sharp` dependency.

## Replacing a photograph

Overwrite the JPEG at the same path and size, keep alt text accurate, and update the table. No code
change is required. To change how a package looks, adjust the tone map in `PackageArt` — never by
attaching a photograph to it.
