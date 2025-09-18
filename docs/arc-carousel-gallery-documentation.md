# Arc Carousel Gallery Documentation

## Purpose
The arc carousel highlights **5 key images** from Beth’s journey, arranged in a curved (arc) layout.  
This allows visitors to **see the whole arc at a glance** (before → struggle → after) while still guiding them through focus on the central image.

It’s designed for **emotional storytelling with brevity**:
- Keeps the homepage impactful without overwhelming.
- Provides contrast and drama between the “before” and “after” states.
- Leaves full photo archive for a dedicated story page.

---

## Structure

### Image Selection
Curate **5 images**:
1. **Before** – strong, positive life moment (graduation, smiling).  
2. **Onset** – first signs of illness/injury.  
3. **Struggle (Low Point)** – most dramatic/visible pain.  
4. **Struggle (Resilience)** – a step toward recovery.  
5. **After** – strength, hope, survival.  

### Layout
- Arc of 5 images, with **center image larger**.  
- Left/right images slightly rotated for depth.  
- Always shows all 5 at once (not hidden offscreen).  

---

## Motion / Animation
- **On scroll into view** → images animate into arc (staggered slide/rotate).  
- **On hover/click** → image scales up + shows caption overlay.  
- **Autoplay option** → carousel slowly shifts focus from left → right.  

### Caption Reveal
Each image should have a **short caption** (2–5 words):
- Example: “Before Diagnosis” → “Hospital Stay” → “Fighting Back.”  
Captions can fade in below the focused image.  

---

## Technical Notes
- Container: `display: flex; justify-content: center; align-items: flex-end;`.  
- Apply `transform: rotate()` + `scale()` for arc effect.  
- Use CSS `perspective` for depth illusion.  
- Consider GSAP for smoother arc animation.  

### Example HTML
```html
<div class="arc-carousel">
  <div class="carousel-item"> <img src="before.jpg" alt="Before" /> </div>
  <div class="carousel-item"> <img src="onset.jpg" alt="Onset" /> </div>
  <div class="carousel-item center"> <img src="struggle.jpg" alt="Struggle" /> </div>
  <div class="carousel-item"> <img src="resilience.jpg" alt="Resilience" /> </div>
  <div class="carousel-item"> <img src="after.jpg" alt="After" /> </div>
</div>
```

---

## Accessibility
- Add meaningful `alt` text per image.  
- Provide text-based timeline alternative below gallery (screen reader accessible).  
- Respect `prefers-reduced-motion` → disable auto-play shift.  

---

## Verification Checklist
- [ ] Only 5 curated images shown.  
- [ ] Arc layout visible on all screen sizes.  
- [ ] Captions clear, readable, and tied to each image.  
- [ ] Animation duration < 500ms per element (snappy, not sluggish).  
- [ ] Auto-play shifts slowly (10s+ per step), not distracting.  
- [ ] Accessible alt text + reduced motion support.  

---

## Next Steps
- Build prototype with **flexbox + transforms**.  
- Enhance with **GSAP** for smoother staggered arc animation.  
- Test mobile: images may stack into horizontal scroll instead of arc.  
