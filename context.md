# Project Context

## Overall Target

Build a premium, cinematic, interactive birthday website that feels closer to an Awwwards / Apple product reveal / creative digital art experience than a traditional birthday page.

The final site should have exactly three experiential sections:

1. Landing Experience
2. Countdown Reveal
3. Birthday Wish Reveal

Core creative goals:

- Dark luxury visual language.
- Realistic 3D birthday cake with one candle.
- Mouse-reactive camera/object motion.
- Floating ambient particles, volumetric-feeling light, realistic shadows, depth.
- Candle flame that flickers and subtly lights the scene.
- Cinematic Begin transition into a motion-designed countdown.
- Countdown numbers formed through particles, light trails, and fragments.
- Cake explosion into glowing particles.
- Particles reform into an artistic HAPPY BIRTHDAY reveal.
- Final message appears with elegant staggered animation and subtle parallax.
- Scroll-independent, fluid, high-end motion experience.

Required stack:

- Next.js
- TypeScript
- Tailwind CSS
- React Three Fiber
- Three.js
- GSAP
- Framer Motion

## What Exists So Far

The project has already been scaffolded as a Next.js app named `cinematic-birthday-experience`.

Known files/components:

- `app/page.tsx`: renders `BirthdayExperience`.
- `app/layout.tsx`: app metadata and root layout.
- `app/globals.css`: global dark visual system, film grain, canvas sizing, text effects.
- `components/BirthdayExperience.tsx`: owns the phase state machine: `landing`, `ignition`, `countdown`, `explosion`, `finale`.
- `components/SceneCanvas.tsx`: React Three Fiber canvas, camera rig, lighting, fog, sparkles, 3D scene.
- `components/CountdownOverlay.tsx`: GSAP countdown with particle/trail/fragment animation.
- `components/FinalReveal.tsx`: Framer Motion HAPPY BIRTHDAY reveal with sparks, parallax, staggered message.
- `components/three/CakeModel.tsx`: procedural 3D cake, candle, flickering flame.
- `components/three/ParticleBloom.tsx`: Three.js point particle bloom.
- `lib/design-tokens.ts`: shared color/motion/camera tokens.
- `tailwind.config.ts`: custom colors, fonts, shadows, grain animation.

Dependencies are installed in `node_modules`.

## Previous Verification

- Dev server was started with Next.js and reached `http://localhost:3000`.
- The page compiled successfully once warmed:
  - `Compiled / in 13.5s`
  - `GET / 200`
- A full production build/typecheck/browser screenshot pass was attempted but could not be completed because the OS temporarily rejected new processes with `Resource temporarily unavailable (os error 35)`.
- The dev server was stopped cleanly after that.
- Current session verification:
  - `npm run build` completed successfully.
  - Next.js compiled, linted/type-checked, generated static pages, finalized optimization, and produced a static `/` route.
  - Build output reported `/` at about `324 kB` with about `426 kB` first-load JS.
  - A standalone `tsc --noEmit` run before the successful Next build failed only because stale/generated `.next/types` files were referenced before Next regenerated build artifacts.

## Current Task

Complete the project end to end while keeping this file updated before each meaningful work phase so progress can be recovered if the thread hits a rate limit.

Current phase:

- Verify the full landing -> countdown -> explosion -> finale flow after the phase-machine patch.
- `BirthdayExperience` now advances from `explosion` to `finale` after a short timed transition.

## Next Task

Reload the local app and run the full interactive flow in-browser, checking for final text, canvas presence, and console errors.

## Running Notes

- Treat the existing untracked project files as the current baseline.
- Do not remove or revert user changes.
- Update this file before starting each major action.

Completed Item:
- Load cake.glb

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Production build compiles successfully, GLB model is loaded, shadows enabled, bounding box console log added)

Next Item:
- Scale verified (Verify scale of cake.glb)

Completed Item:
- Scale verified

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Production build compiles successfully, scale set to 1.35 and optimized lerp loop implemented)

Next Item:
- Orientation verified (Verify orientation of cake.glb)

Completed Item:
- Orientation verified

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Orientation verified as upright based on bounding box proportions, primitive configured with default rotation coords [0, 0, 0])

Next Item:
- Camera (Calibrate camera rig for custom model)

Completed Item:
- Camera

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Result:
PASS (Camera rig targets aligned to designTokens.camera dynamically, preserving centered focus on the candle flame)

Next Item:
- Lighting (Calibrate lights in VolumetricLights for premium look on custom GLB model)

Completed Item:
- Lighting

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Result:
PASS (Candle glow pointLight position shifted to world Y = 0.863 matching the top flame wick, and spotLight shadow mapping parameters optimized for high-quality shadows)

Next Item:
- Atmosphere (Calibrate atmosphere parameters and sparkles relative to the new model bounds)

Completed Item:
- Atmosphere

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Result:
PASS (Floating sparkles positioned at world Y = -0.1 to center the particle field around the cake and flame)

Next Item:
- Mouse interaction (Verify mouse parallax interaction on landing phase)

Completed Item:
- Mouse interaction

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Result:
PASS (Refactored cake group rotation to run inside a useFrame hook reading the global pointer, resolving stickiness and ensuring smooth globally-responsive mouse parallax)

Next Item:
- Idle motion (Verify idle floating animation parameters on landing phase)

Completed Item:
- Idle motion

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Idle floating and slow Y-axis spin rotation verified as smooth and organic, stacking nicely with Drei's Float component parameters without erratic resonance)

Next Item:
- Begin interaction (Verify transition to ignition phase upon button click)

Completed Item:
- Begin interaction

Files Modified:
- [BirthdayExperience.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/BirthdayExperience.tsx)

Result:
PASS (Framer motion landing fade transition and beginExperience click handler verified as reactive and fully operational)

Next Item:
- Candle detection (Identify the coordinates of the candle wick relative to the loaded GLB model)

Completed Item:
- Candle detection

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Candle wick coordinate verified as local position [0, 0.868855, 0] based on GLTF position accessor min/max bounds)

Next Item:
- Flame anchor (Anchor the Flame component at the candle wick tip)

Completed Item:
- Flame anchor

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Flame component group position shifted to local Y = 0.868855, aligning the flame meshes perfectly on top of the candle wick)

Next Item:
- Flame effect (Verify flame scale transition during ignition and countdown phases)

Completed Item:
- Flame effect

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Added ref-tracked delta-lerped scale multipliers for smooth flame expansion transition, and corrected the scaling logic to use scale.set to preserve the teardrop aspect ratio of the inner core mesh)

Next Item:
- Flicker (Verify candle light flicker behavior on ignition phase)

Completed Item:
- Flicker

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Result:
PASS (Added pointLight reference and useFrame flicker animation utilizing multi-frequency wave summation to create realistic dynamic candlelight flicker)

Next Item:
- Lighting response (Ensure overall scene lighting ambient and spotlight colors react beautifully to the ignition phase)

Completed Item:
- Lighting response

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Result:
PASS (Implemented ref-tracked delta-lerping for ambient and fill light intensities, dimming them smoothly when entering the active ignition phase to emphasize the warm candle glow)

Next Item:
- Countdown logic (Verify scale-lerping and countdown transitions in the countdown phase)

Completed Item:
- Countdown logic

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Verified that CakeModel accelerates its Y-rotation to 1.9 rad/s and scale-lerps down to 0.01 during the explosion phase to create a dramatic shrink transition)

Next Item:
- GSAP timeline (Verify the timing coordination of the GSAP timeline in CountdownOverlay)

Completed Item:
- GSAP timeline

Files Modified:
- [CountdownOverlay.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/CountdownOverlay.tsx)

Result:
PASS (Verified the memory-safe GSAP timeline scoped inside a React useEffect hook with proper context.revert() cleanup on unmount, and using optimized autoAlpha transitions)

Next Item:
- Number animation (Verify timing of individual numbers 3, 2, 1 in the timeline)

Completed Item:
- Number animation

Files Modified:
- [CountdownOverlay.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/CountdownOverlay.tsx)

Result:
PASS (Verified sequential fade, scale, and skew timings of numbers 3, 2, and 1 pacing at ~1s rhythmic intervals, concluding in a full-screen font scale zoom at 3.34s)

Next Item:
- Light trails (Verify the light trail graphics and timing during the countdown transition)

Completed Item:
- Light trails

Files Modified:
- [CountdownOverlay.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/CountdownOverlay.tsx)

Result:
PASS (Verified light trail lines animation and styling. Color uses tailwind config brand champagne color token #d9b873, scaling in horizontally at 1.28s to frame countdown number 2)

Next Item:
- Explosion trigger (Verify scale-lerp transition to explosion phase in CakeModel)

Completed Item:
- Explosion trigger

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
PASS (Verified CakeModel scale contraction transition down to 0.01 scale and accelerated rotation during explosion phase)

Next Item:
- Particle burst (Verify ParticleBloom acceleration and density in explosion phase)

Completed Item:
- Particle burst

Files Modified:
- [ParticleBloom.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/ParticleBloom.tsx)

Result:
PASS (Verified particle bloom expansion up to 1.55+ scale, increased opacity, and enlarged particle size during active explosion and finale phases)

Next Item:
- Sound integration (Verify audio synthesis for experience onset and explosion climax)

Completed Item:
- Sound integration

Files Modified:
- [audio.ts](file:///Users/utkarshpradippatil/Documents/HBD%20website/lib/audio.ts)
- [BirthdayExperience.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/BirthdayExperience.tsx)

Result:
PASS (Created procedural sound engine utilizing native browser Web Audio API to play an ambient synth drone/crystal chime swell during the begin phase and a dual-frequency white noise rumble/crackle explosion with a C Minor 11th chime chord during the explosion)

Next Item:
- Camera response (Verify camera vibration offsets during the cake explosion)

Completed Item:
- Camera response

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Result:
PASS (Verified decaying camera vibration lookAt and position offsets dynamically generated at 75 Hz during the 1.2s explosion phase, smoothly blending into the final camera reveal gliding motion)

Next Item:
- Final greeting (Verify final greeting visual animations and typography)

Completed Item:
- Final greeting

Files Modified:
- [FinalReveal.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/FinalReveal.tsx)
- [ParticleBloom.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/ParticleBloom.tsx)

Result:
PASS (Verified Particle reformation, HAPPY BIRTHDAY letter stagger tilt reveals, word-by-word fading paragraph, and interactive stardust parallax driven by cursor position)

Next Item:
NONE (All checklist items fully verified and operational)

═══════════════════════════════════════
VISUAL REFINEMENTS
═══════════════════════════════════════

Completed Issue:
- Issue 1: Flame Effect

Files Modified:
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
Replaced the spherical glowing orbs with a dual-shader procedural candle flame.
- Vertex shader applies tapering for a teardrop silhouette and organic high-frequency wiggling (flicker) at the tip.
- Fragment shader interpolates a white-hot core, amber outer body, and soft reddish tip.
- Secondary concentric shader models a very soft, subtle radial glow without appearing disconnected.
- Calibrated radius to 0.08 and positioned accurately on the wick.

Completed Issue:
- Issue 3: Finale Typography

Files Modified:
- [FinalReveal.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/FinalReveal.tsx)

Result:
Refined typography scales and tracking to achieve a cinematic, luxury aesthetic.
- Reduced H1 text size by ~35% (`clamp(2.2rem,8vw,8rem)`).
- Switched heading tracking from normal to `0.12em` and weight to medium for cinematic elegance.
- Increased the paragraph top margin to 3.5rem (`mt-14`) for extensive breathing room.
- Adjusted paragraph size and increased line-height to `leading-loose`.

Completed Issue:
- Issue 4: Countdown Polish

Files Modified:
- [CountdownOverlay.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/CountdownOverlay.tsx)
- [CakeModel.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/CakeModel.tsx)

Result:
Re-orchestrated the GSAP countdown timeline for high-fidelity cinematic assembly without altering DOM structure.
- Number 3 is formed by 72 randomly scattered gold particles sweeping instantly into the center.
- Number 2 is framed by three sweeping champagne light trails slicing horizontally.
- Number 1 is built by 18 orbital fragments slamming radially into place with an elastic drop-bounce.
- The 3D Cake model's position was shifted vertically upward (`y=-0.22`) to perfectly center it within the frame.

═══════════════════════════════════════
VISUAL POLISH PASS — PRIORITY 1: LANDING COMPOSITION
═══════════════════════════════════════

Completed: Landing Composition Rework

Files Modified:
- [BirthdayExperience.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/BirthdayExperience.tsx)
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)
- [lib/design-tokens.ts](file:///Users/utkarshpradippatil/Documents/HBD%20website/lib/design-tokens.ts)
- [app/globals.css](file:///Users/utkarshpradippatil/Documents/HBD%20website/app/globals.css)

Changes Made:
1. **Typography relocated** — text moved from center-bottom to far bottom-left, left-aligned (editorial layout). Hierarchy: eyebrow → headline → CTA.
2. **Headline reduced** — `clamp(1.45rem, 3.2vw, 2.6rem)` with `font-light`, color at `pearl/80`. Now whispers, not shouts.
3. **Eyebrow added** — `text-pearl/30`, `tracking-[0.38em]`, extremely quiet. Luxury editorial marker.
4. **"waiting" word accent** — champagne/70 color with italic em tag for editorial color accent.
5. **CTA button refined** — inline-flex with a subtle arrow line (`h-px w-5`), border reduced from pearl/18 to pearl/12, background lowered from 0.065 to 0.05 opacity. Less visual mass.
6. **Vignette deepened** — radial now ellipse 60%×55% centered at 50% 42%, outer opacity 0.88. Bottom fade increased to h-56/90%. Creates a "dark well" for text.
7. **Camera pulled back** — landing Z from 7.2 → 8.0, Y from 1.35 → 1.1. More breathing room around cake.
8. **LookAt raised** — landing lookAt Y from 0.66 → 0.78 (frame the flame). Cinematic upward gaze.
9. **Mouse parallax reduced** — position: 0.28 → 0.18, lookAt: 0.24 → 0.16. Gentler, breathing feel.
10. **Background spotlight tightened** — ellipse 40%×35% at 50% 30%, 0.12 opacity. Acts as precise stage cone above cake.

Visual hierarchy achieved:
  Cake → Atmosphere → Text (not Text → Cake)

Status: AWAITING TEST (PASS/FAIL)

═══════════════════════════════════════
VISUAL POLISH PASS — PRIORITY 2: CAMERA CHOREOGRAPHY
═══════════════════════════════════════

Completed: Cinematic Camera Drift

Files Modified:
- [SceneCanvas.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/SceneCanvas.tsx)

Changes Made:
1. **Autonomous drift** — Two superimposed sinusoids with prime-ratio periods (0.071, 0.041 for X; 0.053, 0.083 for Y) create a non-repeating organic breathing quality. Total amplitude ~0.06 units.
2. **Z breath** — A single slow sinusoid (period ~0.037 rad/s) gently moves the camera toward/away from the cake. Amplitude 0.018 units.
3. **Gaze drift** — The lookAt point drifts on a third, separate sinusoid (0.047 X, 0.031 Y) — the camera feels like it is gently surveying rather than locked-on.
4. **Smooth pointer** — Mouse input now smoothed with a very slow lerp (`pow(0.008, delta)`) so the camera has genuine inertia. No more instant snap.
5. **Drift envelope** — During `countdown` and `explosion` phases, drift fades to 0 via a slow lerp (`pow(0.005, delta)`) creating absolute stillness that heightens tension. Restores on finale.
6. **Heavier camera inertia** — Position lerp slowed from `pow(0.035)` to `pow(0.022, delta)`. Camera moves like a heavy steadicam.
7. **Reduced mouse influence** — Position: 0.18 → 0.14. LookAt: 0.16 → 0.12. Mouse is now a gentle modulation, not the dominant force.
8. **prefers-reduced-motion safe** — All drift set to env=0 when reduced motion is detected.

Status: PASS

═══════════════════════════════════════
VISUAL POLISH PASS — PRIORITY 3: COUNTDOWN QUALITY
═══════════════════════════════════════

Completed: Age reveal — cinematic 5-phase animation

Files Modified:
- [AgeRevealOverlay.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/AgeRevealOverlay.tsx)

Changes Made:
1. **Phase 1 — Particles gather**: 80 particles placed on two concentric orbital rings at radii 420px and 260px. Each spirals inward to a tight cluster around center via staggered `power3.out` easing. Total gather duration ~1.9s.
2. **Phase 2 — Number forms**: Digits materialize from `blur(28px) + scale(1.45)` with a staggered 0.18s per digit via `expo.out`. Feels like condensing light.
3. **Phase 3 — Light shimmer**: A translucent golden gradient bar sweeps left→right across the number (0.55s total). As it passes, digits pulse to `brightness(1.8)` + champagne color, then cool back to pearl.
4. **Phase 4 — Dissolve**: Digits scatter outward — even digits go up, odd go down, each pushed sideways proportional to position. Simultaneously particles scatter back to their ring origins. Both fade with `power3.in`/`power4.in`.
5. **Phase 5 — Explosion**: `onExplode` fires mid-dissolve for dramatic overlap. Overlay fades out.
6. **Shimmer element**: New `shimmer-sweep` div in DOM — wide transparent gradient bar, `blur(4px)`, positioned absolute center.
7. **Particle sizing**: Inner ring particles are larger (2-4px) for depth. Outer ring smaller (1-2.5px). Individual glow via inline boxShadow.
8. **Reduced motion**: All particle/shimmer/scatter animations skipped. Simple crossfade only.

Status: PASS

═══════════════════════════════════════
VISUAL POLISH PASS — PRIORITY 4: FINALE REVEAL
═══════════════════════════════════════

Completed: Finale reveal — emotional cinematic reveal

Files Modified:
- [FinalReveal.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/FinalReveal.tsx)

Changes Made:
1. **Section fade slowed** — 1.1s → 1.8s with expo ease. The reveal emerges, not cuts.
2. **Eyebrow replaces h2** — "Dear {name}" is now `text-[0.6rem] tracking-[0.42em] text-pearl/35`. Barely visible, sets emotional context before the headline lands.
3. **Headline timing restructured** — First letter arrives at 1.2s (was 0.18s). Stagger 0.07s per letter (was 0.18+0.055). Every letter gets to breathe and land individually.
4. **Headline reduced** — `clamp(1.9rem, 5.5vw, 5.8rem)` font-weight 400 (was 6.5vw, medium). Lighter, more editorial.
5. **Thin rule added** — A `h-px` champagne gradient line (scaleX enters at 2.8s) separates the headline from the body. Creates visual pause.
6. **Body copy delayed to 3.0s** — Was 1.05s delayChildren. Now the paragraph only begins appearing after the headline has completely settled. The reveal is sequential, not simultaneous.
7. **Body opacity reduced** — `text-pearl/60` (was /78). More recessive against the headline.
8. **Glow disc smaller and subtler** — `min(36rem,80vw)` size, 0.10 opacity (was 42rem, 0.19). No longer competing with scene.
9. **Entry flare softened** — max opacity 0.70 → 0.25, blur increased. Whisper of light, not a flash.
10. **Parallax halved** — ±8px/±5px (was ±18px/±10px). The parallax is now atmospheric, not distracting.
11. **Sparks reduced** — 90 → 48. Non-uniform positions via deterministic hash (no hydration risk). Each spark is 2px not 4px. Individual opacity cap at 0.55 (was 0.8).
12. **Wishing phase refined** — Input placeholder uses ellipsis, font-light, tracking added. Button smaller and quieter.

Status: PASS

═══════════════════════════════════════
VISUAL POLISH PASS — PRIORITY 5: CINEMATIC POST PROCESSING
═══════════════════════════════════════

Completed: CSS-based cinematic post-processing stack

Files Modified:
- [BirthdayExperience.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/BirthdayExperience.tsx)
- [app/globals.css](file:///Users/utkarshpradippatil/Documents/HBD%20website/app/globals.css)

Approach: No new dependencies. All effects via CSS compositing layers above the Three.js canvas. mix-blend-mode:screen targets only bright pixels, naturally simulating bloom without affecting dark areas.

Layers (z-index order):
1. .scene-grade (z:0) — contrast(1.055) saturate(1.1) brightness(0.97) on canvas wrapper.
2. Bloom (z:11) — mix-blend-mode:screen warm radial glow, flame-aligned. Phase-aware intensity (landing=0.08, active=0.22, finale=0.10). 1.4s CSS transition.
3. Chromatic tone (z:12) — Cool blue top cast + warm amber bottom lift. Lens temperature falloff.
4. Cinematic vignette (z:13) — Ellipse 58%x52%, outer opacity 0.92. Top h-40/72% + bottom h-60/94% edge fades.
5. Atmospheric haze (z:14) — Inward radial creates depth recession toward screen edges.

Status: PASS

═══════════════════════════════════════
CINEMATIC MUSIC & TIMELINE INTEGRATION
═══════════════════════════════════════

Completed: Integrated the custom track `atlasaudio` from Downloads with dynamic volume orchestration and a custom 21-second start/loop offset synced to the experience timeline, resolved compilation type warnings, and verified production build correctness.

Files Modified:
- [BirthdayExperience.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/BirthdayExperience.tsx)
- [AgeRevealOverlay.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/AgeRevealOverlay.tsx)
- [FinalReveal.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/FinalReveal.tsx)
- [ParticleBloom.tsx](file:///Users/utkarshpradippatil/Documents/HBD%20website/components/three/ParticleBloom.tsx)
- [context.md](file:///Users/utkarshpradippatil/Documents/HBD%20website/context.md)

Changes Made:
1. **Custom Music Integration (atlasaudio)**:
   - Coerced and copied the custom `atlasaudio-instrumental-519455.mp3` from the user's Downloads folder to `public/assets/audio/reveal-theme.mp3`.
   - Set the audio playback start time to exactly 21 seconds (`currentTime = 21`, representing the user-requested "0.21s" clock timestamp) for initial start and unmute triggers.
   - Removed the browser's default `loop` attribute and implemented a manual `ended` listener that loops the track back to the 21-second mark, preserving the musical pacing.
   - Programmed immediate, low-volume background audio initialization (`volume: 0.16`) upon clicking "Begin Experience" or un-muting to create an atmospheric sound bed.
   - Built a dynamic GSAP volume coordinator that swells the audio to full cinema volume (`volume: 0.82`) over a 4.0-second fade duration when the user transitions to the `finale` phase.
2. **Interactive Audio Controls**:
   - Synced the mute toggle to immediately play/pause or mute/unmute the active backing track to prevent autoplay blocks.
   - Configured the audio to remain completely paused and muted during the landing screen phase, only starting playback once the user clicks "Begin" or "Skip" to align with modern web standard experiences.
3. **Recipient Name Highlight**:
   - Styled the recipient's name in the `FinalReveal` reading intro using the editorial `text-champagne` gold color, bold weight, and a soft golden glow backdrop drop-shadow (`drop-shadow-[0_0_8px_rgba(217,184,115,0.4)]`).
4. **Cinematic Guidance Prompt**:
   - Integrated an elegant, slow-fading "wait for it..." prompt beneath the main body text in `FinalReveal.tsx`. The text automatically fades in at `6.5s` and fades out at `9.7s`, guiding the user smoothly into the "Make a Wish" input transition.
5. **Background Consistency & Transition Polishing**:
   - Aligned the background bloom glow across all phases by setting the default landing and idle `pp-bloom` gradient in `BirthdayExperience.tsx` to match the final reveal's champagne gold radial glow (`rgba(217,184,115,0.10)`). The glow only shifts to warm orange during the active candle ignition phase.
   - Fixed the stardust particles color in `ParticleBloom.tsx` to be champagne white (`#f6eee2`) across all phases. This removes the abrupt color pop from amber to white during the transition to the final reveal card.
6. **Mobile Responsive UI & Layout Enhancements**:
   - Centered the landing text and "Begin" button horizontally on mobile viewports while retaining standard left-alignment on desktop viewports.
   - Removed the word "Intro" from the skip button to make it a clean, premium "Skip" prompt, and moved it to the top-right corner (`absolute top-7 right-6`) to prevent overlapping with custom mobile browser navigation overlays (like the Naver "N" button).
   - Removed the subtle horizontal arrow line (dash) from the "Begin" button to deliver a cleaner pill styling.
   - Repositioned the personal message to float elegantly downside at the bottom-center of the viewport (`bottom-[8vh]`), cleanly separated from the center "wish is among the stars" title.
   - Removed the gold horizontal divider lines from the "HAPPY BIRTHDAY" screen and the final "Your wish is among the stars" screen.
   - Removed the static center star dot from the final reveal screen.
   - Made input borders and text fields extremely faded and subtle (`border-pearl/[0.03]` and `placeholder-pearl/15`) to blend seamlessly into the night sky background.
   - Cleaned up debug log output from the terminal and browser console.
7. **Type-Safety & Build Integrity**:
   - Declared explicit TypeScript type signatures for GSAP functional parameters (such as `(i: number, target: HTMLElement)`) in `AgeRevealOverlay.tsx` to fix compiler type errors.
   - Successfully compiled the Next.js production build (`npm run build`) after purging the webpack resolver cache.

8. **Personalization Architecture (Approved & Implemented)**:
   - Installed `firebase` SDK client package.
   - Initialized database configurations in `lib/firebase.ts` with client environment variables. Included dynamic checking (`isFirebaseConfigured`) to gracefully fallback to local defaults if API keys are missing.
   - Updated `app/page.tsx` to read the search query parameter `id` (maps to `configId`, defaulting to `manasvi-20`).
   - Refactored `BirthdayExperience.tsx` to fetch personalization parameters (recipient name, age, landing messages, music track configurations, and creator/sender personal messages) dynamically from the `/birthdayConfigs/{configId}` Firestore document, and parse asterisks (e.g. `*waiting*`) into golden champagne highlighted text.
   - Redesigned `FinalReveal.tsx` to implement an intimate 1-to-1 wish reveal. The birthday boy/girl enters their own wish (pre-populated with their name from the config) which is saved to Firestore under `/birthdayConfigs/{configId}/wishes` for the creator (Utkarsh) to receive.
   - Once submitted, the star shoots to the sky and reveals the creator's personal message (`senderName` and `personalMessage` loaded from the database config) on an elegant gold-bloom glass card, without displaying any public feed of other wishes.
   - Created a `.env.example` file detailing required environment variables.

Status: PASS
