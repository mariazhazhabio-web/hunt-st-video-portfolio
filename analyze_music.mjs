// Tempo + beat-phase + loudness-profile analyser (FFmpeg decode, pure Node maths).
// Usage: node analyze_music.mjs <file.mp3> [targetBPM]
import { spawnSync } from "node:child_process";
const [file, targetArg] = process.argv.slice(2);
const target = Number(targetArg || 0);
const SR = 22050, HOP = 256, WIN = 1024;
const r = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 1 << 30 });
const pcm = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length / 4);
const fr = HOP / SR, n = Math.floor((pcm.length - WIN) / HOP);

// Onset envelope: half-wave rectified difference of log energy in a crude high-passed signal (emphasises transients)
const env = new Float32Array(n), lev = new Float32Array(n);
let prev = 0;
for (let i = 0; i < n; i++) {
  let e = 0, e2 = 0;
  for (let j = 1; j < WIN; j++) { const s = pcm[i * HOP + j], d = s - pcm[i * HOP + j - 1]; e += d * d; e2 += s * s; }
  const le = Math.log(1e-9 + e / WIN);
  env[i] = Math.max(0, le - prev); prev = le; lev[i] = 10 * Math.log10(1e-12 + e2 / WIN);
}
// normalise and remove local mean
const k = Math.round(0.5 / fr);
const on = new Float32Array(n);
for (let i = 0; i < n; i++) { let s = 0, c = 0; for (let j = Math.max(0, i - k); j < Math.min(n, i + k); j++) { s += env[j]; c++; } on[i] = Math.max(0, env[i] - s / c); }

// Autocorrelation over 60–180 BPM
const score = bpm => { const lag = 60 / bpm / fr; const l0 = Math.floor(lag), a = lag - l0; let s = 0;
  for (let i = 0; i + l0 + 1 < n; i++) s += on[i] * ((1 - a) * on[i + l0] + a * on[i + l0 + 1]); return s; };
const cands = [];
for (let b = 60; b <= 180; b += 0.25) cands.push([b, score(b) + 0.5 * score(b * 2 > 180 ? b : b * 2)]);
cands.sort((x, y) => y[1] - x[1]);
let bpm = cands[0][0];
// resolve octave ambiguity toward the edit's target tempo
if (target) for (const m of [0.5, 2, 2 / 3, 1.5]) if (Math.abs(bpm * m - target) < Math.abs(bpm - target) && cands.some(c => Math.abs(c[0] - bpm * m) < 1)) bpm = bpm * m;
// refine
let best = [bpm, -1]; for (let b = bpm - 1.5; b <= bpm + 1.5; b += 0.05) { const s = score(b); if (s > best[1]) best = [b, s]; } bpm = +best[0].toFixed(2);

// Beat phase: offset (s) of the beat grid that best lines up with onsets
const period = 60 / bpm / fr; let bp = [0, -1];
for (let ph = 0; ph < period; ph += 0.25) { let s = 0; for (let t = ph; t < n; t += period) s += on[Math.round(t)] || 0; if (s > bp[1]) bp = [ph, s]; }
const phase = +(bp[0] * fr).toFixed(3);

// Loudness per 2 s block (for picking sections)
const blocks = []; const bl = Math.round(2 / fr);
for (let i = 0; i < n; i += bl) { let s = 0, c = 0; for (let j = i; j < Math.min(n, i + bl); j++) { s += Math.pow(10, lev[j] / 10); c++; } blocks.push(Math.round(10 * Math.log10(s / c))); }
console.log(JSON.stringify({ file, duration: +(n * fr).toFixed(2), bpm, phase, top: cands.slice(0, 5).map(c => c[0]), blocks_2s_db: blocks }));
