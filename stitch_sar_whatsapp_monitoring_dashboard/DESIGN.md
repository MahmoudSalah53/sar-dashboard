---
name: Lumina Dashboard System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#005523'
  on-tertiary: '#ffffff'
  tertiary-container: '#007030'
  on-tertiary-container: '#63f889'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h1:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h2:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  container-padding: 32px
---

## Brand & Style

This design system is anchored in a **Modern Corporate** aesthetic that prioritizes clarity, efficiency, and professional trust. The brand personality is composed, precise, and unobtrusive, designed to fade into the background so that user data remains the focal point. 

The visual language utilizes a "Soft Minimalism" approach—avoiding the starkness of pure black and white by using a nuanced palette of slates and indigos. The emotional response should be one of "organized calm," reducing the cognitive load typically associated with data-heavy dashboard environments. High-quality whitespace and intentional grouping create a logical flow for complex workflows.

## Colors

The palette is dominated by a clean white base to maximize legibility. **Soft Indigo (#4F46E5)** serves as the primary action color, used for CTA buttons, active states, and primary navigation highlights. **Slate (#64748B)** provides a neutral, sophisticated secondary tone for icons, secondary text, and borders.

For specific WhatsApp status indicators, a **Subtle Green (#22C55E)** is used. This is paired with a very light green wash for background chips to ensure the status is noticeable without being jarring. The overall contrast ratios are strictly maintained to meet WCAG AA standards for data readability.

## Typography

This design system employs a dual-font strategy. **Manrope** is used for headlines and dashboard titles to provide a modern, refined character. **Inter** is utilized for all body copy, data tables, and labels due to its exceptional legibility and neutral systematic feel.

For data-heavy views, use `data-tabular` settings to ensure numbers align perfectly in columns. Hierarchy is established through weight shifts (Medium for labels, Regular for body) rather than dramatic size changes, maintaining a compact yet readable density.

## Layout & Spacing

The system follows an 8px grid (with 4px increments for tight components). The primary layout is a **12-column fluid grid** with a fixed-width sidebar (260px). 

Margins between major dashboard widgets should be 24px (lg) to provide enough "breathing room" to prevent the data from feeling overwhelming. Padding inside cards and containers is set to 20px to balance content density with aesthetic airiness.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. The main background uses the Neutral Slate tint (#F8FAFC), while primary content cards are pure white (#FFFFFF). 

Shadows are used sparingly. The "Standard Card" shadow is highly diffused: `0px 4px 20px rgba(15, 23, 42, 0.05)`. For interactive elements like dropdowns or modals, a more pronounced shadow is used: `0px 10px 32px rgba(15, 23, 42, 0.10)`. Avoid heavy inner shadows or high-contrast borders; use a subtle 1px border (#E2E8F0) to define boundaries instead.

## Shapes

The design system uses a consistent **Rounded** language (Base: 8px/0.5rem). This softens the professional tone, making the application feel more accessible and modern. 

- Large containers (Cards, Modals): `16px` (rounded-lg)
- Standard components (Buttons, Inputs): `8px` (rounded-md)
- Small accents (Tags, Chips): `4px` or full pill-shape depending on context.
- WhatsApp Status Indicators: Circular icons (50% radius) to denote "online" presence.

## Components

- **Buttons:** Primary buttons use a solid Indigo background with white text. Secondary buttons use a Slate-50 background with Slate-700 text. Use a "ghost" style for less critical actions.
- **Cards:** White background, 1px border (#E2E8F0), and a subtle 8px corner radius. Title areas should have a 16px bottom margin.
- **Input Fields:** 1px Slate-200 border, 8px radius. On focus, the border transitions to Indigo with a 2px soft outer glow.
- **WhatsApp Status Chips:** Rounded-pill shape. "Active" uses a light green background (#DCFCE7) with dark green text (#166534) and a 6px solid green dot.
- **Data Tables:** No vertical borders. Horizontal dividers should be 1px Slate-100. Row hover state uses a subtle Indigo-50 tint.
- **Navigation:** Sidebar utilizes a clean vertical list with 12px vertical padding per item. Active states are indicated by a 3px vertical Indigo line on the left and a subtle text weight increase.