export function playSwell() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const mainGain = ctx.createGain();

    carrier.type = "sine";
    modulator.type = "sine";

    carrier.frequency.setValueAtTime(110, now);
    modulator.frequency.setValueAtTime(5.5, now);
    modGain.gain.setValueAtTime(8, now);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.22, now + 0.8);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    carrier.connect(mainGain);
    mainGain.connect(ctx.destination);

    carrier.start(now);
    modulator.start(now);

    carrier.stop(now + 2.3);
    modulator.stop(now + 2.3);

    const playCrystal = (freq: number, delay: number, dur: number) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      oscGain.gain.setValueAtTime(0, now + delay);
      oscGain.gain.linearRampToValueAtTime(0.06, now + delay + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.1);
    };

    playCrystal(440, 0.0, 1.5);
    playCrystal(554.37, 0.15, 1.8);
    playCrystal(659.25, 0.3, 2.0);
  } catch (error) {
    console.warn("Failed to play swell sound:", error);
  }
}

export function playExplosion() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 2.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.setValueAtTime(1, now);
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(20, now + 1.5);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 2.0);

    const sparkNoise = ctx.createBufferSource();
    sparkNoise.buffer = buffer;

    const sparkFilter = ctx.createBiquadFilter();
    sparkFilter.type = "highpass";
    sparkFilter.frequency.setValueAtTime(3500, now);

    const sparkGain = ctx.createGain();
    sparkGain.gain.setValueAtTime(0.12, now);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    sparkNoise.connect(sparkFilter);
    sparkFilter.connect(sparkGain);
    sparkGain.connect(ctx.destination);

    sparkNoise.start(now);
    sparkNoise.stop(now + 0.7);

    const playChime = (freq: number, delay: number, dur: number) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      oscGain.gain.setValueAtTime(0, now + delay);
      oscGain.gain.linearRampToValueAtTime(0.07, now + delay + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.1);
    };

    playChime(523.25, 0.0, 1.4);
    playChime(659.25, 0.08, 1.6);
    playChime(783.99, 0.16, 1.5);
    playChime(987.77, 0.24, 1.8);
    playChime(1174.66, 0.32, 2.0);
  } catch (error) {
    console.warn("Failed to play explosion sound:", error);
  }
}
