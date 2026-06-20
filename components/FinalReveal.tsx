"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, useRef } from "react";
import gsap from "gsap";
import { db, isFirebaseConfigured } from "@/lib/firebase";

type RevealFlow = "reading" | "wishing" | "shooting_star" | "done";

export default function FinalReveal({
  active,
  config,
  configId
}: {
  active: boolean;
  config: import("./BirthdayExperience").BirthdayConfig;
  configId: string;
}) {
  // Subtle parallax — reduced amplitude so it feels like atmosphere, not shake
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const layerX = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const layerY = useTransform(y, [-0.5, 0.5], [-5, 5]);

  const words = useMemo(() => config.birthdayParagraph.split(" "), [config.birthdayParagraph]);

  // Fewer sparks, non-uniform positions using a deterministic hash
  const sparks = useMemo(() => Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: ((i * 73 + 11) % 97),
    top: ((i * 41 + 29) % 91),
    duration: 5 + (i % 7) * 0.6,
    delay: 1.2 + (i % 15) * 0.11,
    rise: 18 + (i % 5) * 8,
  })), []);

  const [flow, setFlow] = useState<RevealFlow>("reading");
  const [senderName, setSenderName] = useState("");
  const [wishText, setWishText] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const shootingStarRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse move parallax
  useEffect(() => {
    if (!active) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX / window.innerWidth - 0.5);
      y.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [active, x, y]);

  // Pre-fill recipient's name in the name field
  useEffect(() => {
    if (config.name) {
      setSenderName(config.name);
    }
  }, [config.name]);

  // Transition to wishing phase after 10s — give the reading moment more time
  useEffect(() => {
    if (active && flow === "reading") {
      const timer = window.setTimeout(() => setFlow("wishing"), 10000);
      return () => window.clearTimeout(timer);
    }
  }, [active, flow]);

  // Focus input field when entering wishing phase
  useEffect(() => {
    if (flow === "wishing" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 1000);
    }
  }, [flow]);

  const submitWish = async () => {
    if (flow !== "wishing" || !wishText.trim() || !senderName.trim()) return;
    setFlow("shooting_star");

    if (shouldReduceMotion) {
      setTimeout(() => setFlow("done"), 1000);
      return;
    }

    // Submit wish to Firestore
    if (isFirebaseConfigured && db) {
      try {
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        const wishesRef = collection(db!, "birthdayConfigs", configId, "wishes");
        await addDoc(wishesRef, {
          senderName: senderName.trim(),
          message: wishText.trim(),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Failed to submit wish to Firestore:", err);
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setFlow("done") });
      tl.to(shootingStarRef.current, { opacity: 1, scale: 1, duration: 0.4, delay: 0.5 })
        .to(shootingStarRef.current, {
          x: window.innerWidth * 0.8,
          y: -window.innerHeight * 0.8,
          opacity: 0,
          scale: 0.2,
          duration: 1.8,
          ease: "power2.in"
        });
    });

    return () => ctx.revert();
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.section
          className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Slow fade in — the reveal should feel like emerging, not appearing
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ambient floating sparks — reduced count, non-uniform */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ x: layerX, y: layerY }}
            aria-hidden
          >
            {sparks.map((s) => (
              <motion.span
                key={s.id}
                className="absolute h-[2px] w-[2px] rounded-full bg-pearl/60"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  boxShadow: "0 0 6px 1px rgba(246,238,226,0.5)"
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.55, 0.08],
                  scale: [0, 0.9, 0.3],
                  y: [0, -s.rise]
                }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Soft glow halo — reduced size, much lower opacity */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "min(36rem, 80vw)",
              height: "min(36rem, 80vw)",
              background: "radial-gradient(circle, rgba(217,184,115,0.10) 0%, rgba(156,230,230,0.04) 40%, transparent 68%)",
              filter: "blur(32px)"
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3.0, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />

          {/* Entry flash — very subtle, not a page-turning flare */}
          {!shouldReduceMotion && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "min(24vw, 18rem)",
                height: "min(24vw, 18rem)",
                background: "radial-gradient(circle, rgba(255,230,180,0.25) 0%, transparent 65%)",
                filter: "blur(24px)",
              }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.2, 2.4] }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              aria-hidden
            />
          )}

          {/* Content */}
          <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              {flow === "reading" && (
                <motion.div
                  key="reading"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -32, filter: "blur(12px)" }}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Eyebrow — appears first, very quiet */}
                  <motion.p
                    className="mb-10 md:mb-14 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.45em] text-pearl/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Dear{" "}
                    <span className="font-semibold text-champagne drop-shadow-[0_0_8px_rgba(217,184,115,0.4)]">
                      {config.name}
                    </span>
                  </motion.p>

                  {/* Headline — letters arrive slowly, one by one */}
                  <h1
                    className="relative font-display leading-[1.08] md:leading-[0.88] tracking-[0.16em] md:tracking-[0.14em] text-pearl text-[clamp(1.6rem,7.5vw,2.5rem)] md:text-[clamp(3.5rem,5.5vw,5.8rem)] font-light text-center"
                  >
                    {(() => {
                      let flatIndex = 0;
                      return config.finalWishTitle.split(" ").map((word, wordIndex) => (
                        <span key={wordIndex} className="mr-[0.5em] inline-block last:mr-0">
                          {word.split("").map((letter, letterIndex) => {
                            const globalIndex = flatIndex++;
                            return (
                              <motion.span
                                key={`${letter}-${globalIndex}`}
                                className="happy-letter inline-block"
                                initial={{ opacity: 0, y: 24, rotateX: -20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                                transition={{
                                  delay: 1.2 + globalIndex * 0.07,
                                  duration: 1.2,
                                  ease: [0.22, 1, 0.36, 1]
                                }}
                              >
                                {letter}
                              </motion.span>
                            );
                          })}
                        </span>
                      ));
                    })()}
                  </h1>

                  {/* Subtitle */}
                  {config.finalWishSubtitle && (
                    <motion.p
                      className="mt-6 md:mt-8 font-sans text-[0.6rem] font-medium uppercase tracking-[0.35em] text-pearl/40"
                      initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 2.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {config.finalWishSubtitle}
                    </motion.p>
                  )}

                  {/* Body copy — delayed to let headline breathe fully */}
                  <motion.p
                    className="relative mx-auto max-w-[285px] md:max-w-lg text-balance text-[0.85rem] md:text-[clamp(0.82rem,1.5vw,1.05rem)] font-light leading-[1.95] md:leading-[1.9] text-pearl/50 md:text-pearl/60 mt-10 md:mt-16"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.06, delayChildren: 3.2 }
                      }
                    }}
                  >
                    {words.map((word, index) => (
                      <motion.span
                        key={`${word}-${index}`}
                        className="mr-[0.34em] inline-block"
                        variants={{
                          hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
                          visible: {
                            opacity: 1, y: 0, filter: "blur(0px)",
                            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                          }
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.p>

                  {/* Elegant delay indicator */}
                  <motion.p
                    className="mt-14 md:mt-18 font-sans text-[0.58rem] font-medium uppercase tracking-[0.35em] text-pearl/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.45, 0.45, 0] }}
                    transition={{
                      delay: 6.5,
                      duration: 3.2,
                      times: [0, 0.15, 0.85, 1],
                      ease: "easeInOut"
                    }}
                  >
                    wait for it...
                  </motion.p>
                </motion.div>
              )}

              {flow === "wishing" && (
                <motion.div
                  key="wishing"
                  initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center gap-8 w-full max-w-[280px]"
                >
                  <p className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-light tracking-[0.06em] text-pearl/85">
                    Make a wish.
                  </p>
                  
                  <div className="flex flex-col gap-5 w-full">
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name…"
                      className="w-full border-t-0 border-x-0 border-b border-pearl/[0.03] bg-transparent pb-2 text-center text-sm font-light text-pearl/65 placeholder-pearl/15 transition-all duration-500 focus:border-pearl/20 focus:text-pearl/95 focus:outline-none focus:ring-0"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && senderName.trim() && wishText.trim() && submitWish()}
                      placeholder="Whisper your wish here…"
                      className="w-full border-t-0 border-x-0 border-b border-pearl/[0.03] bg-transparent pb-2 text-center text-sm font-light text-pearl/65 placeholder-pearl/15 transition-all duration-500 focus:border-pearl/20 focus:text-pearl/95 focus:outline-none focus:ring-0"
                    />
                  </div>

                  {(() => {
                    const isValid = senderName.trim().length > 0 && wishText.trim().length > 0;
                    return (
                      <button
                        onClick={submitWish}
                        disabled={!isValid}
                        className={`text-[0.65rem] font-medium uppercase tracking-[0.3em] transition-all duration-500 mt-2 ${
                          isValid
                            ? "text-pearl/60 hover:text-pearl cursor-pointer"
                            : "text-pearl/20 cursor-not-allowed"
                        }`}
                      >
                        Send it to the stars →
                      </button>
                    );
                  })()}
                </motion.div>
              )}

              {flow === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center w-full max-w-md px-6"
                >
                  <p className="font-display text-[clamp(1.1rem, 2.5vw, 1.6rem)] font-light tracking-[0.05em] text-pearl/75 mb-6">
                    Your wish is among the stars now.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shooting Star */}
            <div
              ref={shootingStarRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_14px_3px_rgba(255,255,255,0.7)]"
            >
              <div className="absolute top-1/2 h-px w-24 -translate-y-1/2 -translate-x-full bg-gradient-to-r from-transparent to-white/70" />
            </div>
          </div>

          {/* Downside center-aligned bottom Personal Message */}
          <AnimatePresence>
            {flow === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
                className="absolute left-6 right-6 z-20 flex flex-col items-center text-center max-w-[75vw] md:max-w-xl mx-auto pointer-events-none"
                style={{ bottom: "max(8vh, calc(env(safe-area-inset-bottom) + 1.5rem))" }}
              >
                {(() => {
                  const displayMessage = config.personalMessage || "Wishing you a year filled with magic, happiness, and beautiful dreams!";
                  const displaySender = config.senderName || "Utkarsh";
                  return (
                    <>
                      <p className="text-pearl/80 font-display text-[0.95rem] md:text-[clamp(0.9rem,2.0vw,1.25rem)] font-light leading-relaxed tracking-wide text-balance italic">
                        "{displayMessage}"
                      </p>
                      <p className="text-champagne/70 text-[0.62rem] md:text-[0.65rem] uppercase tracking-[0.25em] mt-4 font-semibold">
                        — {displaySender}
                      </p>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
