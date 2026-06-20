"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useRef } from "react";
import AgeRevealOverlay from "@/components/AgeRevealOverlay";
import FinalReveal from "@/components/FinalReveal";
import SceneCanvas, { ExperiencePhase } from "@/components/SceneCanvas";
import { playSwell, playExplosion } from "@/lib/audio";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";
import { db, isFirebaseConfigured } from "@/lib/firebase";

export interface BirthdayConfig {
  name: string;
  age: number;
  landingMessage: string;
  revealMessage: string;
  finalWishTitle: string;
  finalWishSubtitle: string;
  birthdayParagraph: string;
  musicEnabled: boolean;
  musicUrl: string;
  senderName?: string;
  personalMessage?: string;
}

type BirthdayExperienceProps = {
  initialName: string;
  initialAge: number;
  configId: string;
};

export default function BirthdayExperience({ initialName, initialAge, configId }: BirthdayExperienceProps) {
  const [phase, setPhase] = useState<ExperiencePhase>("landing");
  const [isMuted, setIsMuted] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [config, setConfig] = useState<BirthdayConfig>({
    name: initialName,
    age: initialAge,
    landingMessage: "Something is *waiting* for you.",
    revealMessage: "A MOMENT MADE FOR YOU",
    finalWishTitle: "HAPPY BIRTHDAY",
    finalWishSubtitle: "to an extraordinary soul",
    birthdayParagraph: "May this year meet you with wonder, impossible light, and the kind of joy that stays.",
    musicEnabled: true,
    musicUrl: "/assets/audio/reveal-theme.mp3",
    senderName: "",
    personalMessage: ""
  });

  // Load configuration from Firestore if available
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      console.log("Firebase is not configured, running with static defaults.");
      return;
    }

    const fetchConfig = async () => {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db!, "birthdayConfigs", configId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig({
            name: data.name || initialName,
            age: Number(data.age) || initialAge,
            landingMessage: data.landingMessage || "Something is *waiting* for you.",
            revealMessage: data.revealMessage || "A MOMENT MADE FOR YOU",
            finalWishTitle: data.finalWishTitle || "HAPPY BIRTHDAY",
            finalWishSubtitle: data.finalWishSubtitle || "to an extraordinary soul",
            birthdayParagraph: data.birthdayParagraph || "May this year meet you with wonder, impossible light, and the kind of joy that stays.",
            musicEnabled: data.musicEnabled !== undefined ? data.musicEnabled : true,
            musicUrl: data.musicUrl || "/assets/audio/reveal-theme.mp3",
            senderName: data.senderName || data.sender_name || data.sender || data.from || "Utkarsh",
            personalMessage: data.personalMessage || data.personalMsg || data.personalmsg || data.personal_message || data.personal_msg || data.message || data.specialMessage || ""
          });
        } else {
          console.warn(`No configuration document found for id: "${configId}". Using defaults.`);
        }
      } catch (err) {
        console.error("Failed to load configuration from Firestore:", err);
      }
    };

    fetchConfig();
  }, [configId, initialName, initialAge]);

  // Load mute state from localStorage on mount
  useEffect(() => {
    const savedMute = localStorage.getItem("birthday_muted");
    if (savedMute !== null) {
      setIsMuted(savedMute === "true");
    } else {
      setIsMuted(false);
    }
  }, []);

  // Update localStorage when mute changes
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("birthday_muted", String(next));
      if (audioRef.current && config.musicEnabled) {
        audioRef.current.muted = next;
        if (!next && phase !== "landing") {
          if (audioRef.current.currentTime < 21) {
            audioRef.current.currentTime = 21;
          }
          audioRef.current.play().catch((err) => console.warn("Audio autoplay blocked:", err));
        }
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
    if (!isMuted && config.musicEnabled) {
      playSwell();
      if (audioRef.current) {
        audioRef.current.muted = false;
        if (audioRef.current.currentTime < 21) {
          audioRef.current.currentTime = 21;
        }
        audioRef.current.play().catch((err) => console.warn("Audio play blocked:", err));
      }
    }
    setPhase("ignition");
  }, [phase, isMuted, config.musicEnabled]);

  const skipIntro = useCallback(() => {
    if (phase !== "landing") return;
    if (!isMuted && config.musicEnabled) {
      if (audioRef.current) {
        audioRef.current.muted = false;
        if (audioRef.current.currentTime < 21) {
          audioRef.current.currentTime = 21;
        }
        audioRef.current.play().catch((err) => console.warn("Audio play blocked:", err));
      }
    }
    setPhase("finale");
  }, [phase, isMuted, config.musicEnabled]);

  useEffect(() => {
    if (phase !== "ignition") return;
    const countdown = window.setTimeout(() => setPhase("countdown"), 1050);
    return () => window.clearTimeout(countdown);
  }, [phase]);

  useEffect(() => {
    if (phase !== "explosion") return;
    if (!isMuted && config.musicEnabled) playExplosion();
    const finale = window.setTimeout(() => setPhase("finale"), 1200);
    return () => window.clearTimeout(finale);
  }, [phase, isMuted, config.musicEnabled]);

  // Integrated background music coordinator
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!config.musicEnabled || phase === "landing") {
      audio.muted = true;
      audio.pause();
      return;
    }

    audio.muted = isMuted;

    if (isMuted) return;

    // Trigger play if paused and not muted
    if (audio.paused) {
      if (audio.currentTime < 21) {
        audio.currentTime = 21;
      }
      audio.play().catch((err) => console.warn("Audio play blocked by browser:", err));
    }

    if (phase === "finale") {
      // Swell to full cinematic prominence
      gsap.to(audio, { volume: 0.82, duration: 4.0, ease: "power2.out", overwrite: "auto" });
    } else {
      // Gentle ambient low volume during introduction phases
      gsap.to(audio, { volume: 0.16, duration: 1.5, ease: "power1.inOut", overwrite: "auto" });
    }
  }, [phase, isMuted, config.musicEnabled, config.musicUrl]);

  // Manual loop/replay mechanism starting from 21s
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!config.musicEnabled) return;
      audio.currentTime = 21;
      audio.play().catch((err) => console.warn("Audio replay blocked:", err));
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [config.musicEnabled]);

  // Bloom intensity class changes with phase
  const bloomActive = phase === "ignition" || phase === "countdown";
  const bloomFinale = phase === "finale";

  return (
    <main className="experience-shell film-grain relative h-dvh w-screen overflow-hidden">
      {/* Canvas wrapper — CSS contrast + saturation for richer output */}
      <div className="scene-grade absolute inset-0">
        <SceneCanvas phase={phase} />
      </div>

      {/* ── POST PROCESSING LAYER ────────────────────────────────────────── */}

      {/* Bloom simulation — mix-blend-mode:screen glow over the scene center.
           Intensifies during ignition/countdown to match the candle flame burst. */}
      <div
        aria-hidden
        className="pp-bloom pointer-events-none absolute inset-0 z-[11] flex items-center justify-center"
      >
        <div
          className="rounded-full transition-all"
          style={{
            width: "min(55vw, 42rem)",
            height: "min(55vw, 42rem)",
            // Warm candle-bloom cone — screen blend punches light upward
            background: bloomActive
              ? "radial-gradient(circle, rgba(255,180,80,0.22) 0%, rgba(255,140,50,0.10) 30%, transparent 68%)"
              : "radial-gradient(circle, rgba(217,184,115,0.10) 0%, transparent 60%)",
            mixBlendMode: "screen",
            filter: "blur(28px)",
            // Pushed up slightly to align with flame position
            marginTop: "-8%",
            transition: "background 1.4s ease, opacity 1.4s ease",
          }}
        />
      </div>

      {/* Chromatic tone — warm bottom / cool top lens falloff.
           Mimics the natural color grading of luxury product photography. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[12]"
        style={{
          background: [
            // Cool blue cast at the top — depth recession
            "linear-gradient(180deg, rgba(80,100,140,0.07) 0%, transparent 28%)",
            // Warm amber lift at the bottom — ground warmth
            "linear-gradient(0deg, rgba(120,80,30,0.06) 0%, transparent 30%)",
          ].join(", "),
        }}
      />

      {/* Cinematic vignette — tighter ellipse, harder outer falloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[13]"
        style={{
          background: "radial-gradient(ellipse 58% 52% at 50% 44%, transparent 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.58) 72%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      {/* Top edge darkening */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[13] h-40 bg-gradient-to-b from-black/72 to-transparent" />
      {/* Bottom dark well — text lives here */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[13] h-60 bg-gradient-to-t from-black/94 to-transparent" />

      {/* Subtle atmospheric haze — inward fog that increases perceived depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[14]"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 42%, transparent 30%, rgba(5,5,12,0.18) 70%, rgba(2,2,6,0.36) 100%)",
        }}
      />

      {/* Global Mute Toggle */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        className="pointer-events-auto absolute z-50 flex h-10 w-10 items-center justify-center rounded-full bg-pearl/5 text-pearl/60 shadow-lg backdrop-blur-md transition hover:bg-pearl/10 hover:text-pearl/90 focus:outline-none focus:ring-2 focus:ring-champagne/50"
        style={{
          bottom: "max(1.5rem, env(safe-area-inset-bottom))",
          right: "max(1.5rem, env(safe-area-inset-right))"
        }}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={config.musicUrl}
        className="hidden"
      />

      <AnimatePresence>
        {phase === "landing" && (
          <motion.section
            className="absolute inset-0 z-20 flex flex-col justify-end items-center sm:items-start text-center sm:text-left px-8 pb-[10vh] sm:pb-[5vh] sm:px-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12, filter: "blur(14px)" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Editorial eyebrow — ultra-quiet, centered on mobile */}
            <motion.span
              className="mb-4 mx-auto sm:mx-0 font-sans text-[0.6rem] font-medium uppercase tracking-[0.38em] text-pearl/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {config.revealMessage}
            </motion.span>

            {/* Refined headline — small, anchored low, centered on mobile */}
            <motion.p
              className="mb-7 max-w-[16rem] mx-auto sm:mx-0 font-display text-[clamp(1.45rem,3.2vw,2.6rem)] font-light leading-[1.15] tracking-[0.03em] text-pearl/80"
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.75, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {config.landingMessage.split(/(\*[^*]+\*)/g).map((part, i) => {
                if (part.startsWith("*") && part.endsWith("*")) {
                  return (
                    <em key={i} className="font-normal not-italic text-champagne/70">
                      {part.slice(1, -1)}
                    </em>
                  );
                }
                return part;
              })}
            </motion.p>

            {/* CTA — clean pill, centered on mobile */}
            <motion.button
              aria-label="Begin birthday reveal"
              className="pointer-events-auto inline-flex w-fit items-center gap-3 rounded-full border border-pearl/12 bg-pearl/[0.05] px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-pearl/70 backdrop-blur-xl transition-all duration-700 hover:border-champagne/40 hover:bg-champagne/10 hover:text-pearl/95 focus:outline-none focus:ring-1 focus:ring-champagne/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 1.1, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              onClick={beginExperience}
            >
              <span>Begin</span>
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "landing" && showSkip && (
          <motion.button
            aria-label="Skip to final reveal"
            className="pointer-events-auto absolute z-50 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-pearl/40 transition hover:text-pearl/80 focus:outline-none"
            style={{
              top: "max(2.5rem, env(safe-area-inset-top))",
              right: "max(1.5rem, env(safe-area-inset-right))"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={skipIntro}
          >
            Skip
          </motion.button>
        )}
      </AnimatePresence>

      <AgeRevealOverlay
        active={phase === "countdown"}
        age={config.age}
        onExplode={() => setPhase("explosion")}
        onComplete={() => setPhase("finale")}
        isReducedMotion={!!shouldReduceMotion}
      />

      <FinalReveal active={phase === "finale"} config={config} configId={configId} />
    </main>
  );
}
