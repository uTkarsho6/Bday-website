"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, useRef } from "react";
import gsap from "gsap";

type RevealFlow = "reading" | "wishing" | "shooting_star" | "done";

export default function FinalReveal({ active, recipientName }: { active: boolean; recipientName: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const layerX = useTransform(x, [-0.5, 0.5], [-18, 18]);
  const layerY = useTransform(y, [-0.5, 0.5], [-10, 10]);
  
  const headline = "HAPPY BIRTHDAY";
  const words = "May this year meet you with wonder, impossible light, and the kind of joy that stays.".split(" ");
  const sparks = useMemo(() => Array.from({ length: 90 }, (_, index) => index), []);
  
  const [flow, setFlow] = useState<RevealFlow>("reading");
  const [wishText, setWishText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const shootingStarRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX / window.innerWidth - 0.5);
      y.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [active, x, y]);

  // Auto-transition to wishing phase after 8 seconds
  useEffect(() => {
    if (active && flow === "reading") {
      const timer = window.setTimeout(() => {
        setFlow("wishing");
      }, 8000);
      return () => window.clearTimeout(timer);
    }
  }, [active, flow]);

  // Focus input when wishing phase starts
  useEffect(() => {
    if (flow === "wishing" && inputRef.current) {
      // slight delay to let it fade in
      setTimeout(() => inputRef.current?.focus(), 1000);
    }
  }, [flow]);

  const submitWish = () => {
    if (flow !== "wishing" || !wishText.trim()) return;
    setFlow("shooting_star");

    if (shouldReduceMotion) {
      setTimeout(() => setFlow("done"), 1000);
      return;
    }

    // GSAP shooting star animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setFlow("done")
      });

      // Wait a moment for input to fade out via framer-motion
      tl.to(shootingStarRef.current, { opacity: 1, scale: 1, duration: 0.4, delay: 0.5 })
        // Shoot across screen (diagonal up right)
        .to(shootingStarRef.current, {
          x: window.innerWidth * 0.8,
          y: -window.innerHeight * 0.8,
          opacity: 0,
          scale: 0.2,
          duration: 1.5,
          ease: "power2.in"
        });
    });

    return () => ctx.revert();
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.section
          className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden px-5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ x: layerX, y: layerY }}
            aria-hidden
          >
            {sparks.map((spark) => (
              <motion.span
                key={spark}
                className="absolute h-1 w-1 rounded-full bg-pearl/80 shadow-[0_0_18px_rgba(246,238,226,.85)]"
                style={{
                  left: `${(spark * 37) % 100}%`,
                  top: `${(spark * 61) % 100}%`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.15],
                  scale: [0, 1.1, 0.45],
                  y: [0, -24 - (spark % 7) * 9]
                }}
                transition={{
                  duration: 4 + (spark % 8) * 0.35,
                  delay: 0.7 + (spark % 12) * 0.08,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          <div className="relative max-w-6xl -translate-y-8">
            <motion.div
              className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,184,115,.19),rgba(156,230,230,.08)_38%,transparent_67%)] blur-2xl"
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
            />
            
            {/* Transition Flare */}
            {!shouldReduceMotion && (
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[30vw] w-[30vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,230,180,0.6)_0%,transparent_60%)] blur-2xl mix-blend-screen"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.2, 1.5, 3] }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
            )}

            <AnimatePresence mode="wait">
              {flow === "reading" && (
                <motion.div
                  key="reading"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.h2
                    className="relative mb-6 font-display text-[clamp(0.9rem,2vw,1.4rem)] font-medium tracking-[0.35em] text-pearl/70 uppercase"
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    DEAR {recipientName}
                  </motion.h2>

                  <h1 className="relative flex flex-wrap justify-center gap-x-[0.3em] font-display text-[clamp(1.8rem,6.5vw,6.5rem)] font-medium leading-[0.9] tracking-[0.12em] text-pearl">
                    {headline.split(" ").map((word, wordIndex) => (
                      <span key={wordIndex} className="whitespace-nowrap">
                        {word.split("").map((letter, letterIndex) => {
                          const index = wordIndex === 0 ? letterIndex : letterIndex + 6;
                          return (
                            <motion.span
                              key={`${letter}-${index}`}
                              className="happy-letter inline-block"
                              initial={{ opacity: 0, y: 90, rotateX: -70, filter: "blur(24px)" }}
                              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                              transition={{ delay: 0.18 + index * 0.055, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                            >
                              {letter}
                            </motion.span>
                          );
                        })}
                      </span>
                    ))}
                  </h1>

                  <motion.p
                    className="relative mx-auto mt-14 max-w-2xl text-balance text-[clamp(0.9rem,1.8vw,1.15rem)] font-light leading-loose text-pearl/78"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.055, delayChildren: 1.05 }
                      }
                    }}
                  >
                    {words.map((word, index) => (
                      <motion.span
                        key={`${word}-${index}`}
                        className="mr-[0.34em] inline-block"
                        variants={{
                          hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
                          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.72 } }
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.p>
                </motion.div>
              )}

              {flow === "wishing" && (
                <motion.div
                  key="wishing"
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center gap-8"
                >
                  <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-pearl">
                    Make a wish.
                  </h2>
                  <input
                    ref={inputRef}
                    type="text"
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitWish()}
                    placeholder="Whisper it here..."
                    className="w-[80vw] max-w-md border-b border-pearl/20 bg-transparent py-2 text-center text-lg text-pearl placeholder-pearl/30 transition focus:border-pearl/80 focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={submitWish}
                    className="text-sm tracking-widest text-pearl/50 transition hover:text-pearl/90"
                  >
                    Send it to the stars &rarr;
                  </button>
                </motion.div>
              )}

              {flow === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-20"
                >
                  <p className="font-display text-[clamp(1.2rem,2.5vw,1.8rem)] font-light text-pearl/80">
                    Your wish is among the stars now.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shooting Star Dot */}
            <div
              ref={shootingStarRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_20px_4px_rgba(255,255,255,0.8)]"
            >
              <div className="absolute top-1/2 h-[1px] w-[100px] -translate-y-1/2 -translate-x-full bg-gradient-to-r from-transparent to-white/80" />
            </div>

            {/* Persistent Faint Star after shooting */}
            <AnimatePresence>
              {flow === "done" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 2 }}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"
                />
              )}
            </AnimatePresence>
            
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
