/* Synthesized royalty-free SFX via WebAudio — no audio files, no copyrighted material. */

export type SfxName =
  | "click" | "flip" | "correct" | "wrong" | "streak" | "levelup"
  | "achievement" | "complete" | "hover" | "tick";

class Sfx {
  private ctx: AudioContext | null = null;
  muted = false;

  private ensure(): AudioContext | null {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(
    freq: number, at: number, dur: number,
    type: OscillatorType = "sine", vol = 0.16, slideTo?: number
  ) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  private noise(at: number, dur: number, vol = 0.08) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + at;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 2400;
    src.connect(f).connect(g).connect(ctx.destination);
    src.start(t0);
  }

  play(name: SfxName) {
    try {
      switch (name) {
        case "click": this.tone(660, 0, 0.07, "triangle", 0.12, 880); break;
        case "hover": this.tone(520, 0, 0.04, "sine", 0.04); break;
        case "flip": this.tone(300, 0, 0.12, "triangle", 0.1, 620); this.noise(0, 0.08, 0.04); break;
        case "correct":
          this.tone(523, 0, 0.11, "triangle", 0.16);
          this.tone(659, 0.09, 0.11, "triangle", 0.16);
          this.tone(784, 0.18, 0.2, "triangle", 0.16);
          this.tone(1047, 0.27, 0.3, "sine", 0.12);
          break;
        case "wrong":
          this.tone(220, 0, 0.16, "sawtooth", 0.1, 150);
          this.tone(150, 0.12, 0.24, "sawtooth", 0.09, 90);
          break;
        case "streak":
          this.tone(587, 0, 0.08, "square", 0.07);
          this.tone(740, 0.07, 0.08, "square", 0.07);
          this.tone(988, 0.14, 0.16, "square", 0.08);
          break;
        case "levelup":
          [392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.09, 0.16, "triangle", 0.14));
          this.noise(0.1, 0.3, 0.05);
          break;
        case "achievement":
          this.tone(880, 0, 0.1, "sine", 0.12);
          this.tone(1175, 0.08, 0.1, "sine", 0.12);
          this.tone(1568, 0.16, 0.3, "sine", 0.1);
          this.tone(1760, 0.2, 0.34, "sine", 0.06);
          break;
        case "complete":
          [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, i * 0.11, 0.2, "triangle", 0.13));
          this.noise(0.5, 0.4, 0.04);
          break;
        case "tick": this.tone(940, 0, 0.04, "sine", 0.05); break;
      }
    } catch {
      /* audio unavailable */
    }
  }
}

export const sfx = new Sfx();
