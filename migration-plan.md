# Migration Plan: Hugo Boss Sustainability Strategy Page

**Source URL:** https://group.hugoboss.com/en/sustainability/strategy  
**Project Type:** Document Authoring (DA) with Universal Editor (UE)  
**Status:** Phase 2 In Progress — Header, Hero & Footer Styling Complete  
**Last Updated:** 2026-05-22

---

## 1. Page Structure

### Overview

The page contains **10 distinct content sections** (excluding header/footer) arranged in a single-column layout. The page uses a mix of interactive components (carousels, accordions) and static text/image blocks.

### Block Inventory

| # | Block Type | Source Class | Content Summary | EDS Block Candidate |
|---|-----------|-------------|-----------------|---------------------|
| 1 | Hero / Image Header | `ce-image-header` | H1 "FOR A BOLD & BETTER FUTURE" with background image overlay | **Hero** |
| 2 | Text Block | `dce-text` | Introductory paragraph about sustainability responsibility | **Default Content** (text) |
| 3 | Video Embed | `ce-video` | "OUR SUSTAINABILITY STRATEGY AT A GLANCE" with embedded video | **Embed / Video** |
| 4 | Fact Slider / Carousel | `ce-fact-slider` | 5 cards with key metrics (-50% CO2, 80% circularity, >70% digital, 100% natural materials, 100% polyester) | **Carousel** (new block) |
| 5 | Accordion | `dce-accordeon` | "DEEP-DIVE INTO OUR STRATEGIC KEY PILLARS" - 5 expandable items (Increase Circularity, Drive Digitization, Leverage Better Natural Materials, Shift to Better Polyester & Polyamide, Reduce Climate Impact) | **Accordion** (new block) |
| 6 | Text Block | `dce-text` | "A solid foundation" - paragraph about organizational approach | **Default Content** (text) |
| 7 | Card Carousel (Center Slider) | `ce-center-slider` | "THE BASIS FOR OUR COMMITMENT" - 3 cards (Natural capital, Materiality analysis, Collaboration & dialog) with images and CTAs | **Carousel** (cards variant) |
| 8 | Value Chain (Text + Image) | `dce-text` + `ce-text-bg-w-img-bottom` | "WE MANAGE SUSTAINABILITY ALONG THE ENTIRE VALUE CHAIN" - introductory paragraph + static infographic image showing the value chain stages | **Default Content** (text + image) |
| 9 | Value Chain Accordion | `dce-accordeon` | 6 expandable items describing each value chain stage (Raw materials, Yarn and fabric production, Manufacturing, Administration, Sales, Packaging and logistics) | **Accordion** (value-chain variant) |
| 10 | Activity Cards Carousel | `ce-center-slider` | "SUSTAINABILITY ACTIVITIES IN DETAIL" - 3 cards (Product, People, Planet) with images and CTAs | **Carousel** (cards variant) |

### Section Count: 10 content blocks + Header + Footer

### Interactive Components Summary
- **2 Carousels** (Slick-based sliders with dot navigation)
- **2 Accordions** (5 strategic pillars + 6 value chain stages)
- **1 Fact slider** (5 metric cards with auto-rotation)

---

## 2. Authoring Approach

### Content Organization Strategy

The page follows a **progressive disclosure** pattern:
1. **Hook** - Hero with bold statement
2. **Context** - Introductory text explaining the "why"
3. **Overview** - Video summarizing strategy at a glance
4. **Key Metrics** - Visual fact cards for quick consumption
5. **Deep Dive** - Expandable accordion for detailed pillar content
6. **Foundation** - Supporting context text
7. **Supporting Evidence** - Cards linking to sub-pages (materiality, collaboration, natural capital)
8. **Value Chain Overview** - Introductory text + static infographic image
9. **Value Chain Details** - Accordion with expandable descriptions per stage
10. **Activity Areas** - Cards linking to Product/People/Planet sections

### Block Utilization Patterns

**Default Content (Text Sections)**
- Used for introductory paragraphs and the "solid foundation" section
- No special block needed; authored as plain text with headings
- H2 headings + body paragraphs

**Hero Block**
- Full-width image with text overlay
- Contains H1 heading in uppercase
- White text on dark/image background

**Carousel Block (3 instances)**
- **Fact Slider variant:** Metric cards with large numbers, description text, and footnotes; each card has a background image
- **Cards variant:** Image + heading + description + CTA link; 3 items per carousel

**Accordion Block (2 instances)**
- **Strategic Pillars:** 5 expandable items with title + detailed body text content
- **Value Chain:** 6 expandable items, each describing a stage of the supply chain

**Value Chain Static Section**
- H2 heading + introductory paragraph
- Static infographic image showing the value chain stages visually (not interactive)

**Video/Embed Block**
- Section heading + embedded video player
- Play button overlay on thumbnail

### Authoring Decisions for EDS

| Decision | Approach | Rationale |
|----------|----------|-----------|
| Hero | Dedicated Hero block | Needs image overlay + centered text treatment |
| Introductory text | Default content | Simple H2 + paragraphs, no special block needed |
| Video | Embed block or Video block | Standard video embed with heading |
| Fact metrics | New **Carousel (facts)** block | Cards with stats, images, descriptions |
| Strategic pillars | New **Accordion** block | 5 expandable items with title + body content |
| Foundation text | Default content | Simple H2 + paragraphs |
| Card sliders | New **Carousel (cards)** block | Image + text + CTA pattern, reusable |
| Value chain overview | Default content | H2 + paragraph + static infographic image |
| Value chain details | **Accordion (value-chain)** variant | 6 expandable items describing supply chain stages |
| Activity cards | **Carousel (cards)** variant | Same pattern as block #7, reusable |

### New Blocks to Create

1. **Hero** - Image background with text overlay
2. **Carousel** - Multi-card slider with dot navigation (two variants: facts, cards)
3. **Accordion** - Expandable title/content items (two variants: strategic-pillars, value-chain)
4. **Embed** - Video embed with heading (may use existing EDS embed block)

---

## 3. Design System / Styling

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-black` | `rgb(0, 0, 0)` / `#000000` | Primary text, headings, navigation, footer background |
| `--color-white` | `rgb(255, 255, 255)` / `#FFFFFF` | Page background, text on dark backgrounds |
| `--color-gold` | `rgb(152, 113, 71)` / `#987147` | Accent color, brand highlight |
| `--color-blue` | `rgb(23, 121, 186)` / `#1779BA` | Links |
| `--color-near-black` | `rgb(10, 10, 10)` / `#0A0A0A` | Secondary text |
| `--color-off-white` | `rgb(254, 254, 254)` / `#FEFEFE` | Subtle background variation |
| `--color-overlay` | `rgba(0, 0, 0, 0.8)` | Dark overlay on images |

### Typography

**Font Family: Averta PE** (custom font with multiple weights)

| Weight/Style | Font Name | Usage |
|-------------|-----------|-------|
| Light (300) | `Averta PE Light` | Body text, paragraphs, navigation links |
| Regular (400) | `Averta PE Regular` | Buttons, UI elements |
| Bold (700) | `Averta PE Bold` | Emphasis text |
| Extrabold (800) | `Averta PE Extrabold` | Headings (H1-H4), tabs, nav parent items |

**Font Sizes**

| Element | Size | Line Height | Letter Spacing | Transform |
|---------|------|-------------|----------------|-----------|
| H1 | 36px | 38.88px (1.08) | 1px | uppercase |
| H2 (section) | 24px | 30px (1.25) | normal | uppercase |
| H2 (card) | 18px | 21.85px (1.21) | normal | uppercase |
| Body text | 16px | - | normal | none |
| Tabs | 14px | - | normal | - |
| Navigation (parent) | 16px | - | normal | uppercase |
| Navigation (child) | 18px | - | normal | none |
| Buttons | 14px | - | normal | - |

### Spacing System

| Context | Value |
|---------|-------|
| Section vertical padding | 25px (mobile), scales up for desktop |
| Section margin bottom | 25px (mobile) |
| Heading margin bottom | 8px - 25px (varies by context) |
| Content max-width | Not constrained (uses grid column offsets) |
| Grid system | 12-column (Foundation-style: `small-12 medium-offset-1 medium-10`) |

### Component Styling

**Buttons/CTAs**
- No border-radius (sharp corners)
- Transparent background (text-link style)
- Padding: `16px 60px 16px 23px` (asymmetric - space for arrow icon)
- Font: Averta PE Regular, 14px
- Color: Black on white backgrounds

**Tabs**
- Active tab: 2px solid black bottom border
- Font: Averta PE Extrabold, 14px
- No background color change on active

**Cards (in carousels)**
- Image top/background
- Heading + description + "Discover more" / "Mehr entdecken" link
- Clean, minimal borders

**Footer**
- Background: Black (`rgb(0, 0, 0)`)
- Text: White
- Tab-based layout (Contact, Legal, Discover)

### Responsive Breakpoints

Based on the source site's class naming (`small-*`, `medium-*`, `large-*`, `xlarge-*`):

| Breakpoint | Size | EDS Equivalent |
|-----------|------|----------------|
| small | 0em (default) | Mobile-first base |
| medium | 48em (768px) | `@media (width >= 600px)` |
| large | 64em (1024px) | `@media (width >= 900px)` |
| xlarge | 75em (1200px) | `@media (width >= 1200px)` |

---

## 4. Migration Phases

### Phase 1: Content Migration (Authoring Experience) ✅ COMPLETE
- [x] Set up page template structure
- [x] Create Hero block (content structure — single cell with image + title)
- [x] Create Carousel block (content structure — fact slides with image + text)
- [x] Create Accordion block (content structure — title/body expandable items)
- [x] Create Video block (content structure — poster image + video URL, modal playback)
- [x] Create Columns block (content structure — image left, text right)
- [x] Create Card-Carousel block (content structure — image + text + CTA cards)
- [x] Author all text content for sustainability/strategy page
- [x] Author all text content for sponsorship/golf page
- [x] Import images (external URLs from source Dynamic Media)
- [x] Create UE model for Embed block (`ue/models/blocks/embed.json`)
- [x] Add card-carousel to section filter
- [x] Create header navigation (`nav.plain.html`) with full mega menu + horizontal bar
- [x] Create footer (`footer.plain.html`) with contact, legal, discover, and bottom bar
- [x] Fix Video block: extensionless URL type detection + modal overlay playback
- [x] Fix Hero block: single-cell structure matching UE model
- [x] Fix poster image: added `?fmt=jpg&wid=1280` for Dynamic Media compatibility
- [x] Validate authoring experience in Universal Editor

**Pages migrated:**
- `/en/sustainability/strategy` — 10 sections (Hero, Text, Video, Carousel, Accordion×2, Card-Carousel×2, Columns-with-image)
- `/en/sponsorship/sports-sponsorship/golf` — 7 sections (Hero, Text×2, Carousel, Columns, Accordion, Card-Carousel)

**Blocks used:** Hero, Carousel, Accordion, Video, Card-Carousel, Columns, Default Content

### Phase 2: Design System & Styling ← IN PROGRESS
- [x] Extract and configure Averta PE fonts
- [x] Set up CSS custom properties (colors, typography, spacing)
- [x] Apply global styles to `styles/styles.css`
- [x] Style Header block (mega menu, horizontal nav bar, utilities, sticky scroll, search panel)
- [x] Style Hero block (full-width bleed, text overlay, responsive height)
- [x] Style Footer block (3-column grid, bottom bar, contact spacing, hover effects)
- [ ] Style Carousel block (facts + cards variants)
- [ ] Style Accordion block (strategic-pillars + value-chain variants)
- [ ] Style Card-Carousel block
- [ ] Style Columns block
- [ ] Style Video block (placeholder + modal)
- [ ] Responsive adjustments
- [ ] Visual QA against source

---

## 5. Notes & Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-20 | Identified Averta PE as brand font | Custom font used across all weights on source site |
| 2026-05-20 | Black/white/gold as primary palette | Minimal luxury brand aesthetic |
| 2026-05-20 | Carousel block for both fact sliders and card sliders | Same underlying pattern (items + dots), different visual treatment via variants |
| 2026-05-20 | Accordion block for strategic pillars and value chain | Both are expandable title/content patterns; value chain icons section is a static infographic image, not interactive tabs |
| 2026-05-20 | Value chain icons = static image | The "Raw materials / Yarn / Manufacturing / etc." icons with labels are a static infographic PNG, not clickable tabs — the accordion below provides the expandable details |
| 2026-05-20 | Content-first approach | Migrate content structure first, then apply styling to ensure good authoring UX |
| 2026-05-20 | Removed "Downloads" block from inventory | PDF link to Annual Report not visible on the live page per user verification |
| 2026-05-20 | Video block opens in modal overlay | Reference site plays video in a popup with dark overlay; updated video.js to match |
| 2026-05-20 | Dynamic Media URLs need `?fmt=jpg&wid=1280` for images | EDS can't process extensionless DM image URLs; adding format params fixes it |
| 2026-05-20 | Video block type detection defaults to `video/mp4` | Extensionless URLs broke the original `source.split('.').pop()` logic |
| 2026-05-20 | Hero block uses single cell (not two columns) | UE model defines single-cell structure; two columns caused mismatch after UE save |
| 2026-05-20 | Nav structure: 4 sections (brand, mega menu+home, utilities, horizontal bar) | Matches reference site's visual layout and reading order |
| 2026-05-20 | Footer structure: 4 sections (contact, legal, discover, bottom bar) | Bottom bar uses 3 lines for authoring; CSS will handle horizontal layout in Phase 2 |
| 2026-05-20 | Mega menu has no "Overview" child items | Reference site uses heading link for overview; children start with actual sub-pages |
