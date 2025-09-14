# Design System Architecture Guide

## 🚨 CRITICAL: 3-Tier Token Architecture

This design system follows a strict **3-tier token hierarchy**. Breaking this chain will cause components to fail silently (appear as unstyled elements).

### Token Flow (MUST be maintained)

```
Components → Semantic Tokens → Alias Tokens → Primitive Tokens
```

#### 1. **Primitive Tokens** (in `/build/primitives.css`)
- Raw values from Figma exports
- Examples: `--color-red-500: #e11d48`, `--color-grayscale-200: #e5e7eb`
- **Never reference these directly in components**

#### 2. **Alias Tokens** (in `/build/alias.css`)
- Map primitives to semantic roles
- Examples: `--bb-color-primary-500: var(--color-yellow-500)`
- **Bridge between primitives and semantics**
- **CRITICAL**: Every color referenced by semantic tokens MUST have an alias

#### 3. **Semantic Tokens** (in `/build/semantic.css`)
- Component-specific tokens referencing aliases
- Examples: `--bb-button-bg-primary-default: var(--bb-color-primary-500)`
- **Components ONLY use these tokens**

### 🔥 Common Failure Point: Missing Alias Tokens

**Symptom**: Components appear as unstyled text
**Cause**: Semantic token references alias that doesn't exist

**Example of BROKEN chain**:
```css
/* Semantic references alias that doesn't exist */
--bb-surface-neutral-card: var(--bb-color-neutral-50); /* ❌ BROKEN */

/* Missing alias (should exist) */
--bb-color-neutral-50: var(--color-grayscale-50); /* ❌ MISSING */

/* Primitive exists */
--color-grayscale-50: #f9fafb; /* ✅ EXISTS */
```

## 📁 File Structure

```
/build/               # 🚨 GENERATED - DO NOT EDIT BY HAND
├── primitives.css    # Raw values from Figma
├── alias.css         # Primitive → Semantic mapping
├── semantic.css      # Component-specific tokens
├── typography.css    # Font tokens
└── effects.css       # Shadows, etc.

/src/
├── globals.css       # Imports all token layers + base styles
└── components/       # Component CSS (uses ONLY semantic tokens)
    ├── button.css
    └── icon.css

/tokens/
└── tokens.json       # Source tokens from Figma Tokens Studio
```

## 🛠 Development Workflow

### Adding New Components
1. **Check semantic tokens exist** for your component
2. If missing, add them to the token source (NOT generated CSS)
3. Regenerate CSS files
4. Build component using ONLY semantic tokens

### Debugging "Unstyled" Components
1. **Check browser dev tools** for CSS variable errors
2. **Trace the token chain** backwards:
   - Does semantic token exist?
   - Does the alias it references exist?
   - Does the primitive exist?
3. **Fix at the source** - never edit generated CSS

### Token Naming Convention
```css
/* Primitives: Raw color names */
--color-[name]-[scale]: [value]

/* Aliases: Semantic color roles */
--bb-color-[role]-[scale]: var(--color-[primitive])

/* Semantics: Component-specific */
--bb-[component]-[property]-[variant]-[state]: var(--bb-color-[alias])
```

## 🚨 Rules That MUST Be Followed

### ❌ NEVER DO
- Edit generated files in `/build/` by hand
- Use raw values in component CSS (`color: #ff0000`)
- Reference primitive tokens directly in components
- Skip levels in the token hierarchy

### ✅ ALWAYS DO
- Use semantic tokens in components
- Maintain the 3-tier hierarchy
- Regenerate CSS when tokens change
- Test components in both light/dark themes
- Run `npm run lint` before commits

## 🔧 Quality Gates

### Linting
```bash
npm run lint  # Catches raw values in CSS
```

### Manual Checks
- [ ] All semantic tokens have corresponding aliases
- [ ] All aliases have corresponding primitives
- [ ] Components work in light AND dark themes
- [ ] No CSS variable errors in browser console

## 🎯 Success Criteria

Your design system is working correctly when:
- Components are styled (not plain text)
- Theme switching works seamlessly
- No CSS variable errors in console
- New components can be built using existing tokens
- Developers can extend the system following established patterns

---
**Remember**: This token architecture enables easy theming and system-wide updates. Breaking the chain breaks the entire system.