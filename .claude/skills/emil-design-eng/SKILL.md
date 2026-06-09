# Design Engineering: Emil Kowalski's UI Polish Philosophy

This comprehensive guide encodes principles for building interfaces where every detail compounds into something that feels exceptional. Here are the core takeaways:

## Foundation

**Taste develops through training**, not innate ability. The philosophy emphasizes that "unseen details combine to produce something that's just stunning" by studying great work, reverse-engineering interactions, and practicing relentlessly.

## Animation Decision Framework

Before animating anything, ask four questions:

1. **Frequency** — High-frequency actions (100+ times daily) should never animate. Keyboard shortcuts and command palettes must respond instantly.

2. **Purpose** — Every animation needs a clear reason: spatial consistency, state indication, feedback, or preventing jarring changes. "It looks cool" isn't sufficient.

3. **Easing** — Use strong custom curves via resources like easing.dev. Critical rule: "avoid ease-in for UI animations" because it delays initial movement when users watch most closely. Prefer `ease-out` for entries and custom curves for on-screen motion.

4. **Duration** — Keep UI animations under 300ms. Faster animations make apps feel more responsive and performant, even when load times remain identical.

## Component Principles

- **Buttons need press feedback**: Add `transform: scale(0.97)` on `:active`
- **Never animate from `scale(0)`** — Start from `scale(0.95)` with opacity
- **Popovers should scale from their trigger**, not center (modals are the exception)
- **Skip delays on subsequent tooltips** once one is open for perceived speed gains
- **Use CSS transitions over keyframes** for interruptible UI

## Performance Rules

Only animate `transform` and `opacity` to stay GPU-accelerated. CSS animations outperform JavaScript under load. Avoid changing CSS variables on containers with many children — update `transform` directly instead.

## The Sonner Principles

Great components prioritize developer experience, ship with excellent defaults, use transitions for dynamic UI, and handle edge cases invisibly. Cohesion matters: animation personality should match component identity.
