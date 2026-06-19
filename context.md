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
