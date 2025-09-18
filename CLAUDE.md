# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Token Management (Primary Workflow)
npm run build:tokens      # Build CSS tokens from tokens.json (must run after token changes)
npm run lint              # Check CSS for hardcoded values and style violations
npm run lint:fix          # Auto-fix CSS formatting issues
npm test                  # Run linting (no separate test suite)

# Development Workflow
npm install               # Install dependencies
npm run build:tokens     # Initial token build
npm run lint             # Verify code compliance

# Local Development Server
python3 -m http.server 5500  # Serve files at http://127.0.0.1:5500 for asset testing
```

## Architecture Overview

### Critical Design System Principles

This is a **token-only CSS design system** with **zero tolerance for hardcoded values**. The architecture enforces strict separation between design tokens and components.

**3-Tier Token Architecture:**
```
Components → Semantic Tokens → Alias Tokens → Primitive Tokens
```

**Forbidden:** Direct use of colors, spacing, or sizing in components
**Required:** All design values must flow through semantic tokens

### File Structure & Ownership

```
/build/                    # 🚨 GENERATED - NEVER EDIT
├── primitives.css         # Raw Figma values
├── alias.css             # Primitive → Semantic mapping
├── semantic.css          # Context-specific tokens
├── effects.css           # Shadows, blurs
├── typography.css        # Font tokens
└── components.css        # Component-specific tokens

/src/                     # 👥 HUMAN-AUTHORED
├── globals.css           # Imports all tokens + base styles
└── components/           # Component CSS (semantic tokens only)
    ├── button.css
    ├── button-fluid.css
    ├── chip.css
    ├── icon.css
    └── header.css

/examples/                # Component demos and testing
├── header.html           # Header component showcase
└── video-test.html       # Video asset debugging

/public/                  # Digital assets from website
├── logos/                # Brand assets (horizontal, stacked, monogram)
├── videos/               # Video backgrounds and effects
├── images/               # Static images
└── fonts/                # Typography assets

/tokens/
└── tokens.json           # 📡 SOURCE OF TRUTH (Figma export)
```

### Token Flow & Naming

**Naming Convention:** `--bb-{category}-{context}-{state}`

**Semantic Token Categories:**
- `--bb-surface-*` - Background colors (page, card, elevated, hover, focus, disabled)
- `--bb-text-*` - Text colors (primary, secondary, inverse, interactive, disabled)
- `--bb-icon-*` - Icon colors (default, muted, inverse, interactive)
- `--bb-component-*` - Component-specific sizing/spacing

**Example Token Usage:**
```css
/* ✅ CORRECT */
.bb-button--primary {
  background: var(--bb-surface-primary-default);
  color: var(--bb-text-neutral-inverse);
  border-radius: var(--bb-component-md-button-radius);
}

/* ❌ FORBIDDEN */
.bb-button--primary {
  background: #ff0000;
  color: white;
  border-radius: 8px;
}
```

## Development Rules (Strictly Enforced)

### Token Management
1. **Source Changes:** Only modify `tokens/tokens.json` (Figma export)
2. **Build Requirement:** Run `npm run build:tokens` after any token changes
3. **No Manual Edits:** Never edit files in `/build/` directory
4. **Linting:** `npm run lint` must pass before commits

### Component Development
1. **Semantic Tokens Only:** Components must use `--bb-surface-*`, `--bb-text-*`, etc.
2. **No Primitives:** Never reference `--bb-color-*` or `--bb-spacing-*` directly
3. **Theme Testing:** Test all components in both light (`data-theme="light"`) and dark (`data-theme="dark"`) modes
4. **State Coverage:** Implement hover, focus, active, and disabled states

### CSS Standards
- **BEM Naming:** `.bb-{component}--{variant}--{modifier}`
- **Kebab Case:** All variables, classes, and files
- **Prefix:** All CSS variables start with `--bb-`
- **Units:** rem for spacing/sizing, unitless line-height

## Theming System

**Theme Switching:**
```html
<!-- Light theme (default) -->
<html data-theme="light">

<!-- Dark theme -->
<html data-theme="dark">
```

**Token Overrides:** Dark theme tokens automatically override light tokens via CSS specificity in `/build/semantic.css`

## Figma Integration & Development Workflow

### Figma MCP Server Integration
This project integrates with Figma via MCP (Model Context Protocol) for component analysis:
- Extract component specifications directly from Figma designs
- Analyze responsive breakpoints and design tokens
- Generate code that matches exact Figma specifications
- Retrieve screenshots and metadata for design validation

### Component Development from Figma
1. **Analyze Figma Component**: Use Figma node IDs to extract specifications
2. **Extract Design Tokens**: Match Figma values to existing semantic tokens
3. **Build Responsive CSS**: Implement exact breakpoints from Figma specs
4. **Create Interactive Examples**: Build demo pages in `/examples/`
5. **Test Across Devices**: Verify responsive behavior matches design

## Component System

### Available Components
- **Button:** `.bb-button` with variants `--primary`, `--destructive`, `--neutral` and sizes `--sm`, `--md`, `--lg`
- **Chip:** `.bb-chip` with variants `--primary`, `--secondary`, `--destructive`, `--neutral`, `--outline`, `--ghost` and sizes `--sm`, `--md`, `--lg`, `--xl`
- **Icon:** `.bb-icon` with context sizing (`bb-icon-button-*`) and general sizing (`bb-icon-sm/md/lg`)
- **Header:** `.bb-header` with responsive breakpoints and video hover effects

### Icon Integration
Uses Lucide icons with `data-lucide` attributes. Icon sizing is context-aware:
```html
<!-- Button context -->
<i data-lucide="heart" class="bb-icon bb-icon-button-md"></i>

<!-- General context -->
<i data-lucide="user" class="bb-icon bb-icon-md"></i>
```

### Component Examples
Interactive component examples are available in `/examples/` directory:
- `header.html` - Header component with responsive design and video hover effects
- `video-test.html` - Video asset testing and debugging

### Asset Management
All digital assets are stored in `/public/` directory:
- `/public/logos/` - Brand logos (horizontal.svg, stacked.svg, monogram.svg)
- `/public/videos/` - Video assets for hover effects and backgrounds
- `/public/images/` - Static image assets
- `/public/fonts/` - Typography assets

## Linting & Enforcement

**Stylelint Configuration:**
- `stylelint-declaration-strict-value`: Blocks hardcoded values
- Requires semantic tokens for all design values
- Enforces BEM naming patterns
- Validates CSS formatting

**Allowed Hardcoded Values:** Only CSS keywords (`transparent`, `currentColor`, `inherit`, `solid`, `100%`, `dark`)

## Common Debugging

**Token Build Issues:**
1. Check `tokens/tokens.json` syntax
2. Verify token structure matches expected hierarchy
3. Run `npm run build:tokens` to see build errors

**Linting Failures:**
1. Use `npm run lint:fix` for auto-fixable issues
2. Replace hardcoded values with semantic tokens
3. Fix BEM naming patterns (avoid multiple dashes like `--`)

**Theme Issues:**
1. Verify tokens exist in both light and dark contexts
2. Test with `<html data-theme="dark">` attribute
3. Check semantic token mappings in `/build/semantic.css`

## Critical Constraints

- **No Hardcoded Design Values:** Stylelint blocks hex colors, pixel values, arbitrary numbers
- **Semantic Tokens Required:** Components cannot reference primitive tokens directly
- **Build Dependency:** Token changes require `npm run build:tokens` before testing
- **Theme Compliance:** All components must work in both light and dark modes
- **Read-Only Generated Code:** Never edit `/build/` directory manually