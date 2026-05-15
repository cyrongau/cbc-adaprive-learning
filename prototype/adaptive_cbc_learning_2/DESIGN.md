---
name: Adaptive CBC Learning CBC
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4940'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a6f'
  outline-variant: '#becabd'
  surface-tint: '#006d36'
  primary: '#006a34'
  on-primary: '#ffffff'
  primary-container: '#268549'
  on-primary-container: '#f6fff3'
  inverse-primary: '#7eda95'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#5d5c58'
  on-tertiary: '#ffffff'
  tertiary-container: '#767471'
  on-tertiary-container: '#fcffe3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9af7af'
  primary-fixed-dim: '#7eda95'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Nunito Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  price-lg:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: '800'
    lineHeight: 28px
  label-sm:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  card-gap: 32px
---

## Brand & Style
The design system is centered on the intersection of literary tradition and modern digital convenience. It evokes the atmosphere of a well-curated, contemporary bookstore—approachable, scholarly, and organized. The aesthetic combines **Minimalism** with a **Tactile** sensibility, utilizing generous whitespace and a warm, paper-inspired color palette to focus attention on book covers and content. 

The target audience ranges from casual readers to academic researchers, necessitating a UI that feels both friendly and authoritative. Emotional responses should lean toward reliability, calm discovery, and intellectual curiosity.

## Colors
The palette is anchored by a flagship **Success Green**, used for primary actions and affirmative commerce states. The background uses a soft cream-tinted off-white to reduce eye strain during long browsing sessions, mimicking the quality of high-grade book paper.

**Semantic Commerce Tokens:**
- **Price:** Deep black for maximum legibility.
- **Stock Status:** High-visibility amber for low stock to drive urgency; neutral slate for out-of-stock items to minimize visual noise.
- **Format Badges:** Distinct hues for Digital vs. Physical formats to ensure quick scanning at the catalog level.

## Typography
This design system utilizes **Nunito Sans** across all levels to maintain a soft, welcoming, and highly readable interface. The geometric yet rounded nature of the typeface bridges the gap between technical SaaS tools and friendly consumer retail.

Large headlines use a heavier weight and tighter tracking to create a "bold editorial" look. For commerce-specific needs, the `price-lg` token uses an extra-bold weight to ensure financial information is immediately visible against book titles.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain the structural integrity of book cover galleries, preventing covers from stretching into awkward aspect ratios. 

- **Desktop:** 12-column grid with a max-width of 1280px.
- **Tablet:** 8-column fluid grid.
- **Mobile:** 2-column layout for product listings to maximize vertical screen real estate for book covers.

A 8px base unit governs all internal component spacing, ensuring consistent rhythm between product titles, ratings, and price tags.

## Elevation & Depth
The system uses **Ambient Shadows** to create a sense of physical layering, reminiscent of books stacked on a table. Shadows are highly diffused and use a low-opacity neutral tint (#000000 at 0.08 alpha) to avoid a "dirty" look.

- **Level 1 (Resting):** Used for book cards. A very soft, wide blur that makes the card appear to hover slightly above the paper background.
- **Level 2 (Hover/Active):** Increased blur and slightly more opacity to indicate interactivity.
- **Level 3 (Overlays):** Used for carts and filters, employing a backdrop blur (glassmorphism) to maintain context of the library beneath.

## Shapes
The shape language is **Rounded**, mirroring the soft terminals of the Nunito Sans typeface. 

- UI elements like buttons and input fields utilize a 0.5rem radius.
- Product cards and containers utilize a 1rem (rounded-lg) radius to feel more approachable.
- Format badges and tags use a pill-shape (3rem) to distinguish them from structural card elements.

## Components
Consistent component styling ensures the e-commerce experience feels integrated:

- **Book Cards:** A vertical-first layout. The book cover is the hero, featuring a subtle 1px inner border to define edges of white covers. Titles are limited to two lines, followed by the author in a muted secondary color.
- **Price Tags:** Displayed in `price-lg`. If on sale, the original price is shown in `label-sm` with a strikethrough, placed to the left of the active price.
- **Stock Badges:** Small, dot-prefixed labels. **Low Stock** uses an amber dot; **Out of Stock** uses a grayscale treatment for the entire card image (0.5 opacity) to indicate unavailability.
- **Format Badges:** Small, high-contrast capsules (e.g., "E-BOOK" or "HARDCOVER") placed at the top-left of the book cover image.
- **Rating Stars:** A 5-star scale using the `rating` yellow. Empty stars are shown in a light grey outline to maintain visual balance.
- **Buttons:** Primary buttons use the Success Green with white text. Secondary buttons for "Add to Wishlist" use a ghost style with a 1px border.