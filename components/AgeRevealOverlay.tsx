"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

type AgeRevealOverlayProps = {
  active: boolean;
  age: number;
  onExplode: () => void;
  onComplete: () => void;
  isReducedMotion: boolean;
};

export default function AgeRevealOverlay({ active, age, onExplode, onComplete, isReducedMotion }: AgeRevealOverlayProps) {
  const root = useRef<HTMLDivElement>(null);
  
  const particles = useMemo(() => Array.from({ length: 72 }, (_, index) => index), []);
  const fragments = useMemo(() => {
    return Array.from({ length: 18 }, (_, index) => ({
      id: index,
      transform: `translate(${(Math.cos(index) * 180).toFixed(3)}px, ${(
        Math.sin(index * 1.7) * 140
      ).toFixed(3)}px) rotate(${index * 31}deg)`
    }));
  }, []);

  const ageString = String(age);
  const digits = ageString.split("");

  useEffect(() => {
    if (!active || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete
      });

      tl.to(root.current, { autoAlpha: 1, duration: 0.8 });

      if (!isReducedMotion) {
        tl.fromTo(".orbit-particle", 
          { autoAlpha: 0, x: () => gsap.utils.random(-400, 400), y: () => gsap.utils.random(-300, 300), scale: 0 },
          { autoAlpha: 1, x: () => gsap.utils.random(-40, 40), y: () => gsap.utils.random(-40, 40), scale: () => gsap.utils.random(0.5, 1.5), duration: 1.2, stagger: 0.002 }, 0
        );
      }

      // Animate digits sequentially
      tl.fromTo(".age-digit",
        { autoAlpha: 0, scale: isReducedMotion ? 1 : 2.5, filter: isReducedMotion ? "blur(0px)" : "blur(40px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.5 },
        0.2
      );

      // Add a slight pause before we blow it up
      const delayAfterDigits = 0.2 + (digits.length * 0.5) + 0.5;

      if (!isReducedMotion) {
        // Fragments logic from previous countdown overlay
        tl.fromTo(".fragment", 
          { autoAlpha: 0, scale: 4 }, 
          { autoAlpha: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.8, stagger: 0.02 }, delayAfterDigits - 0.5)
          .to(".fragment", { autoAlpha: 0, scale: 0, duration: 0.3 }, delayAfterDigits)
          .to(".orbit-particle", { autoAlpha: 0, scale: 0, duration: 0.3 }, delayAfterDigits);
      }

      // Now "explode" all digits together
      tl.to(".age-digit", { autoAlpha: 0, scale: isReducedMotion ? 1 : 25, filter: isReducedMotion ? "blur(0px)" : "blur(40px)", duration: 0.5, ease: "power4.in" }, delayAfterDigits);

      tl.call(onExplode, undefined, delayAfterDigits + 0.2)
        .to(root.current, { autoAlpha: 0, duration: 1.0 }, delayAfterDigits + 0.3);

    }, root);

    return () => ctx.revert();
  }, [active, onComplete, onExplode, isReducedMotion, digits.length]);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-30 grid place-items-center opacity-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,157,72,.18),transparent_26%,rgba(5,5,7,.34)_62%)]" />
      
      {!isReducedMotion && particles.map((particle) => (
        <span
          key={particle}
          className="orbit-particle absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-champagne opacity-0 shadow-[0_0_18px_rgba(217,184,115,.9)]"
        />
      ))}

      {!isReducedMotion && fragments.map((fragment) => (
        <span
          key={fragment.id}
          className="fragment absolute left-1/2 top-1/2 h-[2px] w-10 origin-center rounded-full bg-pearl opacity-0 shadow-[0_0_20px_rgba(246,238,226,.9)]"
          style={{ transform: fragment.transform }}
        />
      ))}

      <div className="flex items-baseline justify-center relative">
        {digits.map((digit, i) => (
          <span key={i} className="age-digit inline-block font-display text-[clamp(9rem,32vw,28rem)] font-semibold leading-none text-pearl opacity-0">
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
}
