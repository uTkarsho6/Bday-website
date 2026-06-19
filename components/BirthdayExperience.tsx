"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useRef } from "react";
import AgeRevealOverlay from "@/components/AgeRevealOverlay";
import FinalReveal from "@/components/FinalReveal";
import SceneCanvas, { ExperiencePhase } from "@/components/SceneCanvas";
import { playSwell, playExplosion } from "@/lib/audio";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";

type BirthdayExperienceProps = {
  recipientName: string;
  age: number;
};

export default function BirthdayExperience({ recipientName, age }: BirthdayExperienceProps) {
  const [phase, setPhase] = useState<ExperiencePhase>("landing");
  const [isMuted, setIsMuted] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Load mute state from localStorage on mount
  useEffect(() => {
    const savedMute = localStorage.getItem("birthday_muted");
    if (savedMute !== null) {
      setIsMuted(savedMute === "true");
    }
  }, []);

  // Update localStorage when mute changes
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("birthday_muted", String(next));
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  };

  // Skip button timer
  useEffect(() => {
    if (phase === "landing") {
      const skipTimer = window.setTimeout(() => setShowSkip(true), 3000);
      return () => window.clearTimeout(skipTimer);
    } else {
      setShowSkip(false);
    }
  }, [phase]);

  const beginExperience = useCallback(() => {
    if (phase !== "landing") return;
    if (!isMuted) playSwell();
    setPhase("ignition");
  }, [phase, isMuted]);

  const skipIntro = useCallback(() => {
    if (phase !== "landing") return;
    setPhase("finale");
  }, [phase]);

  useEffect(() => {
    if (phase !== "ignition") return;
    const countdown = window.setTimeout(() => setPhase("countdown"), 1050);
    return () => window.clearTimeout(countdown);
  }, [phase]);

  useEffect(() => {
    if (phase !== "explosion") return;
    if (!isMuted) playExplosion();
    const finale = window.setTimeout(() => setPhase("finale"), 1200);
    return () => window.clearTimeout(finale);
  }, [phase, isMuted]);

  // Audio fade-in for finale
  useEffect(() => {
    if (phase === "finale" && audioRef.current) {
      const audio = audioRef.current;
      audio.volume = 0;
      audio.muted = isMuted;
      audio.play().catch((err) => console.warn("Audio autoplay blocked:", err));
      
      gsap.to(audio, { volume: 1, duration: 2, ease: "power2.inOut" });
    }
  }, [phase, isMuted]);

  return (
    <main className="experience-shell film-grain relative h-dvh w-screen overflow-hidden">
      <SceneCanvas phase={phase} />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_38%,transparent_0,rgba(0,0,0,.08)_30%,rgba(0,0,0,.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Global Mute Toggle */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        className="pointer-events-auto absolute bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-pearl/5 text-pearl/60 shadow-lg backdrop-blur-md transition hover:bg-pearl/10 hover:text-pearl/90 focus:outline-none focus:ring-2 focus:ring-champagne/50"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/assets/audio/reveal-theme.mp3"
        loop
        className="hidden"
      />

      <AnimatePresence>
        {phase === "landing" && (
          <motion.section
            className="absolute inset-0 z-20 flex flex-col items-center justify-end px-6 pb-[9vh] text-center sm:pb-[7vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="max-w-[22rem] font-display text-[clamp(2.1rem,5vw,4.7rem)] font-medium leading-[0.94] tracking-normal text-pearl"
              initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.45, duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Something is waiting for you.
            </motion.p>

            <motion.button
              aria-label="Begin birthday reveal"
              className="pointer-events-auto mt-8 min-h-12 rounded-full border border-pearl/18 bg-pearl/[0.065] px-7 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-pearl/90 shadow-aureole backdrop-blur-xl transition duration-500 hover:border-champagne/60 hover:bg-champagne/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-champagne/50"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: 0.95, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              onClick={beginExperience}
            >
              Begin
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "landing" && showSkip && (
          <motion.button
            aria-label="Skip to final reveal"
            className="pointer-events-auto absolute bottom-7 left-6 z-50 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-pearl/40 transition hover:text-pearl/80 focus:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={skipIntro}
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>

      <AgeRevealOverlay
        active={phase === "countdown"}
        age={age}
        onExplode={() => setPhase("explosion")}
        onComplete={() => setPhase("finale")}
        isReducedMotion={!!shouldReduceMotion}
      />

      <FinalReveal active={phase === "finale"} recipientName={recipientName} />
    </main>
  );
}
