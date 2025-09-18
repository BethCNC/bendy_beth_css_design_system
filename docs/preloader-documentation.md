# Preloader → Header Transition Documentation

## Purpose
The preloader introduces the **bendy bethc** brand identity with an animated handwriting logo.  
On page load completion, the animation **shrinks and transitions smoothly into the header logo**, creating a unified storytelling moment.

This avoids wasted animation, keeps the logo consistent, and adds a memorable entry without overwhelming users.

---

## Animation Flow
1. **Page Load Start**
   - Show animated GIF/SVG handwriting logo in the center of the screen.
   - Background: solid (e.g., `--bb-surface-page`).

2. **Page Load Complete**
   - Logo scales down and moves into the header logo position.
   - Duration: 0.6–0.8s with `ease-in-out` or spring easing.

3. **Post Animation**
   - Logo remains fixed as the header brand mark.
   - Preloader overlay fades out and is removed from DOM.

---

## Technical Notes
- **Container**
  ```html
  <div id="preloader">
    <img src="/assets/write-on-yellow-alpha-design.gif" alt="BendyBethC logo animation" />
  </div>
  ```
- Preloader covers viewport with `position: fixed; top:0; left:0; width:100%; height:100%;`.
- Header logo slot should be reserved so no layout shift occurs.

- **Animation Options**
  - **Vanilla CSS/JS**: translate & scale preloader image into header slot.
  - **GSAP**: smoother, easier timing & easing control.

- **Performance**
  - Duration under 3 seconds.
  - Use `prefers-reduced-motion` media query to disable for motion-sensitive users.
  - Cache-control: avoid replaying GIF on every navigation.

---

## Accessibility
- `aria-hidden="true"` on preloader container (decorative only).
- Do not trap keyboard focus inside preloader.
- Fallback: static logo if JS disabled.
- Option: skip animation for returning visitors (cookie/localStorage flag).

---

## Verification Checklist
- [ ] Animation duration < 3s.  
- [ ] Smooth shrink into header (no jump cut).  
- [ ] Header logo space reserved (no CLS).  
- [ ] Preloader shows only once per session, not on every page.  
- [ ] Fallback static logo works.  
- [ ] Reduced motion respected (`prefers-reduced-motion`).  

---

## Next Steps
- Implement prototype using **vanilla JS + CSS**.  
- Test load times, performance, and accessibility.  
- Decide whether to enhance with GSAP for production.
