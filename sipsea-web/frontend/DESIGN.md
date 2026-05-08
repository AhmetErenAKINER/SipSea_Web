---
name: Midnight Intelligence
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7ca'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8e9195'
  outline-variant: '#43474a'
  surface-tint: '#bdc8d1'
  primary: '#bdc8d1'
  on-primary: '#283239'
  primary-container: '#00050a'
  on-primary-container: '#6e7880'
  inverse-primary: '#556067'
  secondary: '#afc8f0'
  on-secondary: '#163152'
  secondary-container: '#2f486a'
  on-secondary-container: '#9eb7de'
  tertiary: '#c7c6c6'
  on-tertiary: '#303031'
  tertiary-container: '#040404'
  on-tertiary-container: '#777777'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9e4ed'
  primary-fixed-dim: '#bdc8d1'
  on-primary-fixed: '#131d23'
  on-primary-fixed-variant: '#3e484f'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#afc8f0'
  on-secondary-fixed: '#001c3a'
  on-secondary-fixed-variant: '#2f486a'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 48px
  bento-gap: 16px
---

## Brand & Style

The design system is engineered to evoke a sense of profound intelligence, stability, and future-ready precision. It targets a sophisticated audience that values clarity over decoration. The brand personality is "The Quiet Authority"—knowledgeable, calm, and impeccably organized.

The aesthetic merges **Ultra-Minimalism** with **Glassmorphism**. It utilizes a deep, monochromatic base to allow content to emerge from the darkness. Visual interest is maintained through organic, fluid wave-like shapes in the background that suggest movement and thought without distracting from the functional interface. Every element is governed by a strict adherence to grid systems and high-contrast typography, ensuring a premium, high-fidelity experience.

## Colors

The palette is anchored in a near-absolute black dubbed "Midnight Ocean" to create a vacuum-like depth where information takes center stage. 

- **Primary:** The foundational background color, providing the "infinite" canvas.
- **Secondary:** A deep navy used sparingly for subtle depth in container backgrounds or focused interactive states.
- **Tertiary:** A neutral slate-grey for secondary text and low-priority borders.
- **Neutral:** Pure white, reserved strictly for high-contrast typography and primary iconography to ensure maximum legibility against the dark background.

Avoid chromatic saturation. The interface should feel monochromatic, using value and transparency rather than hue to differentiate elements.

## Typography

This design system utilizes **Inter** for its utilitarian precision and Swiss-inspired neutrality. The typographic hierarchy is built on extreme scale contrast. Headlines are oversized and tightly tracked to feel architectural and bold.

Body text maintains generous line-height for readability in low-light environments. Labels use an uppercase treatment with increased tracking to act as clear navigational markers. All text should be pure white (#FFFFFF) or high-opacity grey to maintain the high-contrast aesthetic.

## Layout & Spacing

The layout follows a **Fixed Bento-Grid** model. This modular approach organizes information into logical, low-saturation panels of varying sizes, creating a sense of curated order. 

A 12-column grid is used for the main structure, with a focus on wide margins and generous white space (or "black space") to prevent visual clutter. Internal panel padding should be rigorous and consistent, typically following a 32px or 40px internal margin to give content room to breathe.

## Elevation & Depth

Hierarchy is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional shadows.

1.  **Background Layer:** Midnight Ocean (#00050a) with subtle, low-opacity organic fluid waves.
2.  **Surface Layer:** Low-saturation panels using a semi-transparent Deep Navy (#001f3f) at 40-60% opacity.
3.  **Floating Layer:** Sticky headers and menus utilize a heavy backdrop-blur (20px-30px) and a micro-thin 1px border (#ffffff at 10% opacity) to simulate frosted glass.
4.  **Interaction Layer:** Hover states should slightly increase the opacity or brightness of a panel rather than adding a shadow.

## Shapes

The shape language is "Soft-Technical." Elements use a subtle 4px to 8px corner radius (Soft). This preserves a professional, engineering-focused look while avoiding the harshness of sharp 0px corners. 

Buttons and input fields should remain consistent with this soft rounding. Bento boxes should use `rounded-lg` (8px) to clearly define separate modules within the grid.

## Components

- **Buttons:** Primary buttons are pure white with black text. Secondary buttons are "ghost" style with a 1px slate-grey border. No gradients.
- **Sticky Headers:** Always glassmorphic. Use a 1px bottom border (#ffffff at 10%) to define the edge against the background.
- **Bento Panels:** The core container. Low-saturation backgrounds with subtle 1px borders. Content inside is left-aligned with "Headline-MD" or "Headline-LG" titles.
- **Input Fields:** Minimalist under-line or subtle dark-grey fill. Focus states are indicated by a shift to a pure white border.
- **Chips/Labels:** Small, rectangular, with the `label-caps` typographic style. Used for categorization or status.
- **Organic Waves:** Use SVG paths with low-opacity strokes (5-10%) to create background textures. These should be animated very slowly to suggest life.