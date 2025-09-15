# Bendy Beth CSS Design System

A production-grade CSS design system built from Figma tokens with a strict 3-tier token architecture. This system provides consistent, themeable, and accessible components for modern web applications.

## 🎯 Features

- **Token-Driven Architecture**: 3-tier hierarchy (Primitives → Aliases → Semantic → Components)
- **Theme Support**: Light and dark mode with seamless switching
- **Responsive Design**: Fluid layouts with modern CSS functions
- **Accessibility First**: WCAG AA compliant with proper focus indicators
- **Component Library**: Button, Chip, and Icon components with multiple variants
- **No Hardcoded Values**: Everything uses design tokens
- **Figma Integration**: Direct import from Figma Tokens Studio

## 🏗️ Architecture

### Token Hierarchy

```
Components → Semantic Tokens → Alias Tokens → Primitive Tokens
```

**Components** use only semantic tokens, which reference aliases, which reference primitives. This indirection enables easy theming and system-wide updates.

### File Structure

```
/build/               # 🚨 GENERATED - NEVER EDIT BY HAND
├── primitives.css    # Raw values from Figma
├── alias.css         # Primitive → Semantic mapping
├── semantic.css      # Generic semantic tokens
├── effects.css       # Shadows, blurs, effects
├── typography.css    # Font tokens
└── components.css    # Component-specific tokens

/src/
├── globals.css       # Imports all token layers + base styles
└── components/       # Component CSS (uses ONLY semantic tokens)
    ├── button.css
    ├── chip.css
    └── icon.css

/tokens/
└── tokens.json       # Source tokens from Figma Tokens Studio
```

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bendy_beth_css_design_system

# Install dependencies
npm install

# Build tokens from Figma source
npm run build:tokens
```

### Basic Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="src/globals.css">
    <link rel="stylesheet" href="src/components/button.css">
    <link rel="stylesheet" href="src/components/chip.css">
    <link rel="stylesheet" href="src/components/icon.css">
</head>
<body>
    <!-- Your components here -->
    <button class="bb-button bb-button--primary bb-button--md">
        <i data-lucide="heart" class="bb-icon bb-icon-button-md"></i>
        Click me
    </button>
</body>
</html>
```

## 🧩 Components

### Button

A versatile button component with multiple variants and sizes.

```html
<!-- Primary button -->
<button class="bb-button bb-button--primary bb-button--md">Save</button>

<!-- Destructive button with icon -->
<button class="bb-button bb-button--destructive bb-button--sm">
    <i data-lucide="trash-2" class="bb-icon bb-icon-button-sm"></i>
    Delete
</button>

<!-- Neutral button (large) -->
<button class="bb-button bb-button--neutral bb-button--lg">Cancel</button>
```

**Variants**: `--primary`, `--destructive`, `--neutral`  
**Sizes**: `--sm`, `--md` (default), `--lg`

### Chip

Compact components for tags, labels, and status indicators.

```html
<!-- Primary chip -->
<span class="bb-chip bb-chip--primary bb-chip--md">Active</span>

<!-- Secondary chip with icon -->
<span class="bb-chip bb-chip--secondary bb-chip--sm">
    <i data-lucide="star" class="bb-icon bb-icon-sm"></i>
    Featured
</span>

<!-- Outline chip -->
<span class="bb-chip bb-chip--outline bb-chip--lg">Draft</span>
```

**Variants**: `--primary`, `--secondary`, `--destructive`, `--neutral`, `--outline`, `--ghost`  
**Sizes**: `--sm`, `--md` (default), `--lg`, `--xl`

### Icon System

Consistent icon sizing and coloring using Lucide icons.

```html
<!-- Button icons -->
<i data-lucide="heart" class="bb-icon bb-icon-button-sm"></i>
<i data-lucide="star" class="bb-icon bb-icon-button-md"></i>
<i data-lucide="plus" class="bb-icon bb-icon-button-lg"></i>

<!-- General icons -->
<i data-lucide="user" class="bb-icon bb-icon-sm"></i>
<i data-lucide="settings" class="bb-icon bb-icon-md"></i>
<i data-lucide="home" class="bb-icon bb-icon-lg"></i>
```

**Button Icon Sizes**: `bb-icon-button-sm`, `bb-icon-button-md`, `bb-icon-button-lg`  
**General Icon Sizes**: `bb-icon-sm`, `bb-icon-md`, `bb-icon-lg`

## 🎨 Theming

### Light/Dark Mode

The system supports seamless theme switching using data attributes:

```html
<!-- Light theme (default) -->
<html data-theme="light">

<!-- Dark theme -->
<html data-theme="dark">
```

### Theme Switching

```javascript
// Toggle theme
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
}
```

## 🛠️ Development

### Available Scripts

```bash
# Build tokens from Figma source
npm run build:tokens

# Lint CSS files
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests (linting)
npm test
```

### Adding New Components

1. **Check existing semantic tokens** for your component needs
2. **Create component file** in `src/components/`
3. **Use semantic tokens only** (no hardcoded values)
4. **Implement all states** (hover, focus, active, disabled)
5. **Test in both themes**
6. **Add to demo page**

### Token Management

```bash
# After updating tokens.json
npm run build:tokens

# Verify no errors
npm run lint
```

## 📋 Design System Rules

### Critical Rules

1. **NEVER use hardcoded values** - Everything must use design tokens
2. **ALWAYS use semantic tokens** in components (never primitives)
3. **TEST in both themes** for every component
4. **MAINTAIN token hierarchy** strictly
5. **ONE icon file only** - consolidate all icon styles
6. **DOCUMENT everything** with usage examples

### Token Usage Examples

```css
/* ✅ CORRECT - Using semantic tokens */
.bb-button--primary {
  background: var(--bb-surface-primary-default);
  color: var(--bb-text-neutral-inverse);
  border-radius: var(--bb-component-md-button-radius);
}

/* ❌ WRONG - Using hardcoded values */
.bb-button--primary {
  background: #ff0000;
  color: white;
  border-radius: 8px;
}
```

## 🎯 Token Categories

### Semantic Tokens

- **Surface**: `--bb-surface-*` - Background colors for surfaces
- **Text**: `--bb-text-*` - Text colors for different contexts  
- **Icon**: `--bb-icon-*` - Icon colors for different contexts
- **Component**: `--bb-component-*` - Component-specific sizing and spacing

### Typography Tokens

- **Font Families**: `--bb-font-body`, `--bb-font-heading`
- **Font Sizes**: `--bb-text-body-sm`, `--bb-text-body-md`, `--bb-text-body-lg`
- **Font Weights**: `--bb-font-weight-medium`, `--bb-font-weight-semibold`

### Spacing Tokens

- **Spacing Scale**: `--bb-spacing-1` through `--bb-spacing-24`
- **Component Spacing**: `--bb-component-*-padding`, `--bb-component-*-gap`

## 🔧 Customization

### Adding New Tokens

1. **Update `tokens.json`** with new token definitions
2. **Run `npm run build:tokens`** to regenerate CSS
3. **Use new tokens** in components
4. **Test in both themes**

### Extending Components

```css
/* Add new variant */
.bb-button--custom {
  background: var(--bb-surface-custom-default);
  color: var(--bb-text-custom-inverse);
}

.bb-button--custom:hover {
  background: var(--bb-surface-custom-hover);
}
```

## 📚 Documentation

- **Design System Guide**: See `.cursor/rules/design-system-implementation-rules.mdc`
- **Component Examples**: Check `demo.html` for usage examples
- **Token Reference**: Generated CSS files in `/build/` directory

## 🤝 Contributing

1. **Follow design system rules** strictly
2. **Use semantic tokens only** in components
3. **Test in both light and dark themes**
4. **Ensure accessibility** compliance
5. **Document new components** with examples
6. **Run linting** before submitting changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Figma Tokens Studio** for token management
- **Lucide Icons** for the icon system
- **Style Dictionary** for token transformation
- **Modern CSS** techniques for responsive design

---

**Built with ❤️ for consistent, accessible, and maintainable web interfaces.**