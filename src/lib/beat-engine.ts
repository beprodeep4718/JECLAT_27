/**
 * A tiny Web Audio boom-bap loop (88 BPM, swung 16ths) with a tanpura-style drone
 * and a sparse Bhairav-flavoured pluck. Everything is synthesised; no audio files.
 * `drain()` returns the strongest hit that has played since the last call, so the
 * visuals can pulse in time with the kick and snare.
 */
type Hit = [time: number, level: number];

const BPM = 88;
const SWING = 0.14;
const STEPS = 32; // two bars of 16ths
const KICKS = [0, 7, 10, 16, 22, 26];
const SNARES = [4, 12, 20, 28];
const OPEN_HATS = [14, 30];
const SUB: Record<number, number> = { 0: 41.2, 10: 49.0, 16: 36.7, 26: 41.2 };
const PLUCK: Record<number, number> = { 2: 329.6, 3: 349.2, 6: 415.3, 8: 329.6, 18: 493.9, 19: 440.0, 22: 415.3, 24: 349.2 };

export class BeatEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private droneGain!: GainNode;
  private noise!: AudioBuffer;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private next = 0;
  private queue: Hit[] = [];
  on = false;

  start() {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    if (!this.ctx) this.setup(new AC());
    const ctx = this.ctx!;
    void ctx.resume();
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0.75, now);
    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
    this.droneGain.gain.linearRampToValueAtTime(0.03, now + 2);
    this.step = 0;
    this.next = now + 0.06;
    this.queue.length = 0;
    this.timer = setInterval(() => this.schedule(), 25);
    this.schedule();
    this.on = true;
    return true;
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.on = false;
    this.queue.length = 0;
    const ctx = this.ctx;
    if (!ctx) return;
    this.master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    setTimeout(() => {
      if (!this.on) void ctx.suspend();
    }, 500);
  }

  toggle() {
    if (this.on) this.stop();
    else this.start();
    return this.on;
  }

  drain() {
    const ctx = this.ctx;
    if (!this.on || !ctx) return 0;
    let level = 0;
    while (this.queue.length && this.queue[0][0] <= ctx.currentTime) {
      level = Math.max(level, this.queue.shift()![1]);
    }
    return level;
  }

  dispose() {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }

  private setup(ctx: AudioContext) {
    this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor();
    this.master = ctx.createGain();
    this.master.gain.value = 0.75;
    this.master.connect(comp);
    comp.connect(ctx.destination);

    this.noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    // drone: E2 / B2 / E3 saws through a slowly breathing low-pass
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 700;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.13;
    lfoGain.gain.value = 280;
    lfo.connect(lfoGain);
    lfoGain.connect(lp.frequency);
    lfo.start();
    [82.4, 123.5, 164.8].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.detune.value = (i - 1) * 6;
      o.connect(lp);
      o.start();
    });
    lp.connect(this.droneGain);
    this.droneGain.connect(this.master);
  }

  private env(g: GainNode, t: number, attack: number, peak: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    this.env(g, t, 0.003, 1, 0.42);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.5);
  }

  private snare(t: number, level: number) {
    const ctx = this.ctx!;
    const n = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    n.buffer = this.noise;
    hp.type = "highpass";
    hp.frequency.value = 1400;
    this.env(g, t, 0.002, level, 0.17);
    n.connect(hp).connect(g).connect(this.master);
    n.start(t);
    n.stop(t + 0.25);
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(210, t);
    o.frequency.exponentialRampToValueAtTime(150, t + 0.08);
    this.env(og, t, 0.002, level * 0.6, 0.09);
    o.connect(og).connect(this.master);
    o.start(t);
    o.stop(t + 0.15);
  }

  private hat(t: number, open: boolean) {
    const ctx = this.ctx!;
    const n = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    n.buffer = this.noise;
    hp.type = "highpass";
    hp.frequency.value = 7500;
    this.env(g, t, 0.001, open ? 0.15 : 0.1, open ? 0.22 : 0.04);
    n.connect(hp).connect(g).connect(this.master);
    n.start(t);
    n.stop(t + (open ? 0.3 : 0.08));
  }

  private sub(t: number, freq: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    this.env(g, t, 0.01, 0.5, 0.9);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 1);
  }

  private pluck(t: number, freq: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(freq * 0.94, t); // a small meend into the note
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.07);
    lp.type = "lowpass";
    lp.Q.value = 6;
    lp.frequency.setValueAtTime(3200, t);
    lp.frequency.exponentialRampToValueAtTime(500, t + 0.4);
    this.env(g, t, 0.003, 0.08, 0.5);
    o.connect(lp).connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.6);
  }

  private schedule() {
    const ctx = this.ctx!;
    const s16 = 60 / BPM / 4;
    while (this.next < ctx.currentTime + 0.12) {
      const st = this.step % STEPS;
      const t = this.next;
      if (KICKS.includes(st)) {
        this.kick(t);
        this.queue.push([t, 1]);
      }
      if (SNARES.includes(st)) {
        this.snare(t, 0.55);
        this.queue.push([t, 0.7]);
      }
      if (st === 31) this.snare(t, 0.16); // ghost note into the loop
      if (st % 2 === 0) this.hat(t, OPEN_HATS.includes(st));
      else if (st % 4 === 3) this.hat(t, false);
      if (SUB[st]) this.sub(t, SUB[st]);
      if (PLUCK[st]) this.pluck(t, PLUCK[st]);
      this.next += s16 * (st % 2 === 0 ? 1 + SWING : 1 - SWING);
      this.step++;
    }
  }
}
