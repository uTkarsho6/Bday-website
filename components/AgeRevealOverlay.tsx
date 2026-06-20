"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

// Deterministic pseudo-random (sin hash) — avoids SSR/client hydration mismatch.
// Returns a stable value in [0, 1) for any given integer seed.
function seededRng(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type AgeRevealOverlayProps = {
  active: boolean;
  age: number;
  onExplode: () => void;
  onComplete: () => void;
  isReducedMotion: boolean;
};

export default function AgeRevealOverlay({ active, age, onExplode, onComplete, isReducedMotion }: AgeRevealOverlayProps) {
  const root = useRef<HTMLDivElement>(null);

  // Particles placed on two rings for a deliberate orbital gather look.
  // All values use seededRng (deterministic) to avoid SSR/hydration mismatch.
  const particles = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => {
      const ring = i < 50 ? 1 : 2;
      const angle = (i / (ring === 1 ? 50 : 30)) * Math.PI * 2;
      const radius = ring === 1 ? 420 : 260;
      return {
        id: i,
        startX: Math.cos(angle) * radius,
        startY: Math.sin(angle) * radius,
        endX: (seededRng(i) - 0.5) * 80,
        endY: (seededRng(i + 100) - 0.5) * 80,
        size: ring === 1
          ? 1 + seededRng(i + 200) * 1.5
          : 2 + seededRng(i + 300) * 2,
        delay: i * 0.008,
      };
    });
  }, []);

  const ageString = String(age);
  const digits = ageString.split("");

  useEffect(() => {
    if (!active || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      // ─── PHASE 0: Overlay fades in ───────────────────────────────────────
      tl.to(root.current, { autoAlpha: 1, duration: 0.6, ease: "power2.out" });

      if (!isReducedMotion) {
        // ─── PHASE 1: Particles gather — orbital spawn to tight cluster ────
        // Set initial positions on rings
        gsap.set(".gather-particle", (i: number, target: HTMLElement) => {
          const p = particles[i];
          gsap.set(target, { x: p.startX, y: p.startY, scale: 0, autoAlpha: 0 });
        });

        // Staggered spiral inward — each particle travels from ring to center cluster
        tl.to(".gather-particle", {
          x: (i: number) => particles[i].endX,
          y: (i: number) => particles[i].endY,
          scale: (i: number) => particles[i].size * 0.4,
          autoAlpha: (i: number) => 0.5 + seededRng(i + 400) * 0.5,
          duration: 1.6,
          ease: "power3.out",
          stagger: (i: number) => particles[i].delay,
        }, 0.3);
      }

      // ─── PHASE 2: Number forms — digit by digit from blur/scale ──────────
      // Each digit blooms in from a white-hot blur, then cools to pearl; rules scale & fade in
      const digitDelay = isReducedMotion ? 0.3 : 1.2;
      tl.fromTo(".age-digit",
        {
          autoAlpha: 0,
          scale: isReducedMotion ? 1 : 1.45,
          filter: isReducedMotion ? "blur(0px)" : "blur(28px)",
          y: isReducedMotion ? 0 : 12,
        },
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          duration: isReducedMotion ? 0.4 : 1.1,
          stagger: isReducedMotion ? 0 : 0.18,
          ease: "expo.out",
        },
        digitDelay
      );

      if (!isReducedMotion) {
        tl.fromTo(".age-rule",
          { autoAlpha: 0, scaleX: 0 },
          { autoAlpha: 0.35, scaleX: 1, duration: 1.4, ease: "power2.out" },
          digitDelay + 0.2
        );
      } else {
        tl.to(".age-rule", { autoAlpha: 0.35, duration: 0.3 }, digitDelay);
      }

      // ─── PHASE 3: Light shimmer — golden streak sweeps across ────────────
      if (!isReducedMotion) {
        const shimmerStart = digitDelay + (digits.length * 0.18) + 0.9;
        // Shimmer enters from left, sweeps, exits right
        tl.fromTo(".shimmer-sweep",
          { autoAlpha: 0, x: "-55%", scaleY: 1 },
          { autoAlpha: 1, x: "0%", duration: 0.25, ease: "power2.in" },
          shimmerStart
        )
        .to(".shimmer-sweep",
          { autoAlpha: 0, x: "55%", duration: 0.3, ease: "power2.out" },
          shimmerStart + 0.25
        );

        // Digits pulse gold as shimmer passes
        tl.to(".age-digit",
          {
            filter: "blur(0px) brightness(1.8)",
            color: "#d9b873",
            duration: 0.15,
            stagger: 0.06,
            ease: "power1.in",
          },
          shimmerStart + 0.1
        )
        .to(".age-digit",
          {
            filter: "blur(0px) brightness(1)",
            color: "#f6eee2",
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",
          },
          shimmerStart + 0.32
        );

        // Also pulse rules as shimmer passes
        tl.to(".age-rule",
          { autoAlpha: 0.8, duration: 0.2, ease: "power1.in" },
          shimmerStart + 0.1
        ).to(".age-rule",
          { autoAlpha: 0.35, duration: 0.6, ease: "power2.out" },
          shimmerStart + 0.3
        );

        // ─── Linger — let the number breathe ─────────────────────────────
        // (implicit pause — shimmer ends at shimmerStart+0.55, dissolve starts at +1.3)
        const dissolveStart = shimmerStart + 1.3;

        // ─── PHASE 4: Dissolve — digits scatter outward, particles follow ─
        // Each digit fires in a different direction for organic scatter
        tl.to(".age-digit", {
          autoAlpha: 0,
          scale: 0.7,
          y: (i: number) => (i % 2 === 0 ? -40 : 40),
          x: (i: number) => (i - digits.length / 2) * 60,
          filter: "blur(20px)",
          duration: 0.65,
          stagger: 0.05,
          ease: "power3.in",
        }, dissolveStart);

        tl.to(".age-rule", {
          autoAlpha: 0,
          scaleX: 0.3,
          filter: "blur(8px)",
          duration: 0.6,
          ease: "power3.in",
        }, dissolveStart);

        // Particles scatter back out
        tl.to(".gather-particle", {
          x: (i: number) => particles[i].startX * 0.6,
          y: (i: number) => particles[i].startY * 0.6,
          autoAlpha: 0,
          scale: 0,
          duration: 0.8,
          stagger: (i: number) => i * 0.003,
          ease: "power4.in",
        }, dissolveStart + 0.1);

        // ─── PHASE 5: Explosion trigger ───────────────────────────────────
        tl.call(onExplode, undefined, dissolveStart + 0.5)
          .to(root.current, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, dissolveStart + 0.6);

      } else {
        // Reduced motion: simple crossfade
        const dissolveStart = digitDelay + 1.8;
        tl.to(".age-digit", { autoAlpha: 0, duration: 0.3 }, dissolveStart);
        tl.call(onExplode, undefined, dissolveStart + 0.2)
          .to(root.current, { autoAlpha: 0, duration: 0.5 }, dissolveStart + 0.3);
      }

    }, root);

    return () => ctx.revert();
  }, [active, onComplete, onExplode, isReducedMotion, digits.length, particles]);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-30 grid place-items-center opacity-0">
      {/* Atmospheric vignette for the reveal moment */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,157,72,.12),transparent_28%,rgba(5,5,7,.45)_70%)]" />

      {/* Gather particles — opacity-0, GSAP-controlled; suppressHydrationWarning because
           Node.js and browsers serialize floats differently in inline styles. */}
      {!isReducedMotion && particles.map((p) => {
        const sz = Math.round(p.size * 100) / 100;
        return (
          <span
            key={p.id}
            suppressHydrationWarning
            className="gather-particle absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne opacity-0"
            style={{
              width: `${sz}px`,
              height: `${sz}px`,
              boxShadow: `0 0 ${Math.round(sz * 6 * 100) / 100}px rgba(217,184,115,0.8)`,
            }}
          />
        );
      })}

      {/* Golden shimmer sweep bar */}
      {!isReducedMotion && (
        <div
          className="shimmer-sweep pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200%] opacity-0"
          style={{
            width: "clamp(8rem, 30vw, 24rem)",
            background: "linear-gradient(90deg, transparent 0%, rgba(217,184,115,0.06) 20%, rgba(255,220,140,0.22) 50%, rgba(217,184,115,0.06) 80%, transparent 100%)",
            filter: "blur(4px)",
          }}
        />
      )}

      {/* The age number — editorial luxury treatment */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Soft ambient glow behind the number */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: "clamp(18rem, 55vw, 40rem)",
            height: "clamp(18rem, 55vw, 40rem)",
            background: "radial-gradient(circle, rgba(217,184,115,0.12) 0%, rgba(255,157,72,0.06) 35%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Very thin champagne rule above */}
        <div
          className="age-rule mb-6 h-px opacity-0"
          style={{
            width: "clamp(3rem, 8vw, 6rem)",
            background: "linear-gradient(90deg, transparent, rgba(217,184,115,0.5), transparent)",
          }}
        />
        <div className="flex items-baseline justify-center gap-[0.04em]">
          {digits.map((digit, i) => (
            <span
              key={i}
              className="age-digit inline-block font-display leading-none opacity-0"
              style={{
                fontSize: "clamp(8rem, 28vw, 24rem)",
                fontWeight: 200,
                letterSpacing: "0.06em",
                // Champagne-to-pearl gradient for a light-catching quality
                background: "linear-gradient(160deg, #ffffff 0%, #f6eee2 30%, #d9b873 55%, #f6eee2 80%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                filter: "drop-shadow(0 0 32px rgba(217,184,115,0.4))",
              }}
            >
              {digit}
            </span>
          ))}
        </div>
        {/* Very thin champagne rule below */}
        <div
          className="age-rule mt-6 h-px opacity-0"
          style={{
            width: "clamp(3rem, 8vw, 6rem)",
            background: "linear-gradient(90deg, transparent, rgba(217,184,115,0.5), transparent)",
          }}
        />
      </div>
    </div>
  );
}
