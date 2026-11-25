// Project 1 - Luxury Apartment Showcase - reproducible FFmpeg assembly
// Usage (PowerShell or any shell, from this folder):
//   node build.mjs            -> draft (burned-in timecode + DRAFT label)
//   node build.mjs --final    -> clean export (refuses if any shot is still a placeholder)
// Reads shotlist.json. Footage goes in footage/S01.mp4 (or .mov) etc.
// Any shot without footage is rendered as a labelled placeholder slate.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const FINAL = process.argv.includes("--final");
const cfg = JSON.parse(fs.readFileSync("shotlist.json", "utf8"));
const { w: W, h: H, fps: FPS, duration: DUR } = cfg.format;
const TMP = "build";
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync("titles", { recursive: true });
fs.mkdirSync("drafts", { recursive: true });
fs.mkdirSync("exports", { recursive: true });

function run(args, label) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.status !== 0) { console.error(`\nFFmpeg failed (${label}):\n${r.stderr}`); process.exit(1); }
  return r.stderr;
}
function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate:format=duration", "-of", "json", file], { encoding: "utf8" });
  const j = JSON.parse(r.stdout || "{}");
  const s = (j.streams || [])[0] || {};
  const [n, d] = (s.r_frame_rate || "0/1").split("/").map(Number);
  return { w: s.width, h: s.height, fps: d ? n / d : 0, dur: Number(j.format?.duration || 0) };
}
const find = (base, exts) => exts.map(e => base + e).find(f => fs.existsSync(f));
const track = s => s.split("").join(" ").replace(/   /g, "     ");
const tf = (name, text, raw) => { const p = `${TMP}/${name}.txt`; fs.writeFileSync(p, raw ? text : text.replace(/\\/g, "\\\\").replace(/%/g, "\\%"), "utf8"); return p; };
const tc = t => { const f = Math.round(t * FPS); const fr = f % FPS, s = Math.floor(f / FPS); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, fr].map(v => String(v).padStart(2, "0")).join(":"); };
const srtT = t => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };

// ---------- 1. Title PNGs (transparent, 1920x1080, also importable into CapCut) ----------
const WARM = "0xF4EFE6";
for (const t of cfg.titles) {
  const parts = [];
  if (t.rule) {
    const x = t.rule.x ?? `(iw-${t.rule.w})/2`;
    parts.push(`drawbox=x=${x}:y=${t.rule.y}:w=${t.rule.w}:h=2:color=0xC8B48A@0.9:t=fill:replace=1`);
  }
  t.lines.forEach((l, i) => {
    const file = tf(`${t.id}_${i}`, l.track ? track(l.text) : l.text);
    const x = l.align === "center" ? "(w-text_w)/2" : (l.x ?? 120);
    parts.push(`drawtext=fontfile=fonts/${l.font}:textfile=${file}:fontsize=${l.size}:fontcolor=${l.color || WARM}:x=${x}:y=${l.y}:shadowcolor=black@0.35:shadowx=0:shadowy=2`);
  });
  // Scrim for legibility over bright footage: soft bottom gradient for lower-third text, gentle full-frame dim for centred brand titles
  const scrim = t.scrim === "full" ? `geq=r=0:g=0:b=0:a='70+60*hypot(X-W/2,Y-H/2)/hypot(W/2,H/2)'`
    : t.scrim === "bottom" ? `geq=r=0:g=0:b=0:a='if(gt(Y,H*0.55),150*pow((Y-H*0.55)/(H*0.45),1.4),0)'` : null;
  if (scrim) parts.unshift(scrim);
  run(["-f", "lavfi", "-i", `color=c=black@0.0:s=${W}x${H},format=rgba`, "-vf", parts.join(","), "-frames:v", "1", `titles/${t.id}.png`], `title ${t.id}`);
}
console.log(`Titles: ${cfg.titles.length} PNGs -> titles/`);

// ---------- 2. Per-shot segments ----------
const shots = cfg.shots;
const lut = fs.existsSync(cfg.grade.lut) ? cfg.grade.lut : null;
const grade = lut ? `lut3d=file=${lut}` : cfg.grade.builtin;
const report = [];
let placeholders = 0;
shots.forEach((s, i) => {
  const next = shots[i + 1];
  const overlap = next ? (next.trans_in === "cut" ? 1 / FPS : next.trans_dur) : 0;
  const segDur = s.dur + overlap;
  const out = `${TMP}/${s.id}.mp4`;
  const enc = ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p", "-r", String(FPS), "-t", segDur.toFixed(3), out];
  const src = find(`footage/${s.id}`, [".mp4", ".mov", ".MP4", ".MOV", ".mkv", ".jpg", ".png"]);

  if (s.type === "card") {
    run(["-f", "lavfi", "-i", `color=c=${s.card_color}:s=${W}x${H}:r=${FPS}`, ...enc], s.id);
    report.push(`${s.id}  card`);
    return;
  }
  if (!src) {
    placeholders++;
    const f1 = tf(`${s.id}_a`, `${s.id}   ${s.section}`), f2 = tf(`${s.id}_b`, s.shot),
          f3 = tf(`${s.id}_c`, `Framing: ${s.framing}`), f4 = tf(`${s.id}_d`, `Move: ${s.move}    Speed: ${Math.round(s.speed * 100)}%    Length: ${s.dur}s`),
          f5 = tf(`${s.id}_e`, `PLACEHOLDER  -  FOOTAGE REQUIRED:  footage/${s.id}.mp4`);
    const dt = (f, font, size, y, col) => `drawtext=fontfile=fonts/${font}:textfile=${f}:fontsize=${size}:fontcolor=${col}:x=160:y=${y}`;
    const vf = [`drawbox=x=120:y=120:w=${W - 240}:h=${H - 240}:color=0x3A3631:t=2`,
      dt(f1, "Montserrat-Regular.ttf", 44, 200, "0xC8B48A"), dt(f2, "georgia.ttf", 46, 300, WARM),
      dt(f3, "Montserrat-Regular.ttf", 28, 400, "0xBDB6AA"), dt(f4, "Montserrat-Regular.ttf", 28, 450, "0xBDB6AA"),
      dt(f5, "Montserrat-Regular.ttf", 26, 840, "0xD98C6A")].join(",");
    run(["-f", "lavfi", "-i", `color=c=0x23211E:s=${W}x${H}:r=${FPS}`, "-vf", vf, ...enc], s.id);
    report.push(`${s.id}  PLACEHOLDER (no footage/${s.id}.*)`);
    return;
  }
  const isStill = /\.(jpg|png)$/i.test(src);
  const p = isStill ? { fps: FPS, dur: 999 } : probe(src);
  // Slow motion only works cleanly if the source has enough frames: 50/60fps -> 50%, 25/30fps -> 100%.
  let speed = s.speed;
  const minSpeed = FPS / (p.fps || FPS);
  let note = "";
  if (!isStill && speed < minSpeed - 0.01) { note = ` (speed raised ${Math.round(speed * 100)}%->${Math.round(minSpeed * 100)}%: source is ${p.fps.toFixed(2)}fps)`; speed = minSpeed; }
  const need = segDur * speed + (s.src_in || 0);
  if (!isStill && p.dur && p.dur < need) note += ` (WARNING: clip ${p.dur.toFixed(2)}s, needs ${need.toFixed(2)}s - last frame will hold)`;
  const push = s.push || 0;
  const chain = [
    isStill ? null : `setpts=(PTS-STARTPTS)/${speed}`,
    `fps=${FPS}`,
    `scale=${W}:${H}:force_original_aspect_ratio=increase`, `crop=${W}:${H}`,
    push ? `scale=w='trunc(${W}*(1+${push}*t/${segDur})/2)*2':h=-2:eval=frame,crop=${W}:${H}` : null,
    grade, "tpad=stop_mode=clone:stop_duration=5", "setsar=1"
  ].filter(Boolean).join(",");
  const inArgs = isStill ? ["-loop", "1", "-framerate", String(FPS), "-i", src] : ["-ss", String(s.src_in || 0), "-i", src];
  run([...inArgs, "-vf", chain, ...enc], s.id);
  report.push(`${s.id}  ${src}  ${p.w}x${p.h}@${(p.fps || 0).toFixed(2)}  speed ${Math.round(speed * 100)}%${note}`);
});
console.log("Shots:\n  " + report.join("\n  "));
if (FINAL && placeholders) { console.error(`\n--final refused: ${placeholders} shot(s) still placeholders.`); process.exit(1); }

// ---------- 3. Assemble: transitions, titles, grade-safe fades, audio ----------
const inputs = [], fc = [];
shots.forEach(s => inputs.push("-threads", "1", "-i", `${TMP}/${s.id}.mp4`));
shots.forEach((s, i) => fc.push(`[${i}:v]fps=${FPS},settb=AVTB,format=yuv420p[v${i}]`));
let last = "v0";
shots.slice(1).forEach((s, k) => {
  const i = k + 1;
  const type = s.trans_in === "cut" ? "fade" : s.trans_in;
  const d = s.trans_in === "cut" ? 1 / FPS : s.trans_dur;
  fc.push(`[${last}][v${i}]xfade=transition=${type}:duration=${d.toFixed(3)}:offset=${s.start.toFixed(3)}[x${i}]`);
  last = `x${i}`;
});
fc.push(`[${last}]fade=t=in:st=0:d=${shots[0].trans_dur || 0.5},trim=0:${DUR},setpts=PTS-STARTPTS[base]`);
last = "base";
let idx = shots.length;
cfg.titles.forEach(t => {
  inputs.push("-loop", "1", "-framerate", String(FPS), "-t", String(t.dur), "-i", `titles/${t.id}.png`);
  const fd = 0.6;
  fc.push(`[${idx}:v]format=rgba,fade=t=in:st=0:d=${fd}:alpha=1,fade=t=out:st=${(t.dur - fd).toFixed(2)}:d=${fd}:alpha=1,setpts=PTS-STARTPTS+${t.start}/TB[t${idx}]`);
  fc.push(`[${last}][t${idx}]overlay=0:0:eof_action=pass[o${idx}]`);
  last = `o${idx}`; idx++;
});
let vfinal = `[${last}]fade=t=out:st=${DUR - 1}:d=1`;
if (!FINAL) {
  const l1 = tf("draft_label", `P1 DRAFT  |  ${placeholders ? placeholders + " PLACEHOLDER SHOTS  |  " : ""}SAMPLE PORTFOLIO PROJECT`);
  const l2 = tf("draft_tc", "%{pts:hms}", true);
  vfinal += `,drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${l1}:fontsize=20:fontcolor=white@0.75:box=1:boxcolor=black@0.45:boxborderw=8:x=24:y=24`;
  vfinal += `,drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${l2}:fontsize=22:fontcolor=white@0.85:box=1:boxcolor=black@0.45:boxborderw=8:x=w-text_w-24:y=h-text_h-24`;
}
fc.push(vfinal + ",format=yuv420p[vout]");

// Audio: licensed music if supplied, otherwise a labelled temp click track at the edit tempo
const music = find(cfg.music.file_glob, [".wav", ".mp3", ".m4a", ".aac", ".flac"]);
const aParts = [];
if (music) {
  inputs.push("-ss", String(cfg.music.start_in_track), "-i", music);
  fc.push(`[${idx}:a]atempo=${cfg.music.tempo_ratio || 1},atrim=0:${DUR},asetpts=PTS-STARTPTS,volume=${cfg.music.gain_db}dB,afade=t=in:d=0.5,afade=t=out:st=${DUR - 3}:d=3[mus]`);
} else {
  const beat = 60 / cfg.music.bpm, bar = beat * 4;
  inputs.push("-f", "lavfi", "-t", String(DUR), "-i", `aevalsrc='0.18*sin(2*PI*if(lt(mod(t\\,${bar})\\,0.05)\\,1320\\,880)*t)*exp(-55*mod(t\\,${beat}))':s=48000:c=stereo`);
  fc.push(`[${idx}:a]anull[mus]`);
}
aParts.push("[mus]"); idx++;
const sfxUsed = [];
cfg.sfx.forEach(s => {
  if (!fs.existsSync(s.file)) return;
  inputs.push("-i", s.file);
  const ms = Math.round(s.at * 1000);
  fc.push(`[${idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${s.gain_db}dB,adelay=${ms}|${ms}[s${idx}]`);
  aParts.push(`[s${idx}]`); sfxUsed.push(`${s.file}@${s.at}s`); idx++;
});
fc.push(`${aParts.join("")}amix=inputs=${aParts.length}:normalize=0:duration=first,atrim=0:${DUR},loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[aout]`);

const outFile = FINAL ? "exports/P1_Luxury_Residence_Showcase_1080p25.mp4" : "drafts/P1_Luxury_Apartment_draft.mp4";
fs.writeFileSync(`${TMP}/filtergraph.txt`, fc.join(";\n"));
run(["-filter_complex_threads", "1", ...inputs, "-/filter_complex", `${TMP}/filtergraph.txt`, "-map", "[vout]", "-map", "[aout]",
  "-c:v", "libx264", "-threads", "2", "-preset", "slow", "-crf", FINAL ? "16" : "20", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", String(FPS),
  "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", "-t", String(DUR), outFile], "assemble");
// Loudness QC: measure, then correct to -14 LUFS (social/web target) with a -1 dBTP limiter if more than 0.5 LU off
const meas = s => { const m = spawnSync("ffmpeg", ["-hide_banner", "-i", s, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr.split("Summary:").pop().match(/I:\s+(-?[\d.]+) LUFS[\s\S]*Peak:\s+(-?[\d.]+)/); return m ? [+m[1], +m[2]] : [NaN, NaN]; };
let [lufs] = meas(outFile);
if (Math.abs(lufs + 14) > 0.5) {
  const tmp = `${TMP}/loud_fix.mp4`;
  run(["-i", outFile, "-c:v", "copy", "-af", `volume=${(-14 - lufs).toFixed(2)}dB,alimiter=limit=0.84:level=false`, "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", tmp], "loudness fix");
  fs.renameSync(tmp, outFile);
}
const [lufs2, peak2] = meas(outFile);
console.log(`QC loudness: ${lufs2} LUFS integrated, true peak ${peak2} dBFS (target -14 LUFS / <= -1 dBTP)`);
console.log(`Audio: ${music ? music : "TEMP CLICK TRACK (no music supplied)"}${sfxUsed.length ? " + sfx " + sfxUsed.join(", ") : ""}`);
console.log(`Rendered -> ${outFile}`);

// ---------- 4. Sidecar files: EDL for DaVinci Resolve, SRT of on-screen text, contact sheet ----------
let edl = `TITLE: P1_LUXURY_APARTMENT\nFCM: NON-DROP FRAME\n\n`;
shots.forEach((s, i) => {
  const n = String(i + 1).padStart(3, "0");
  const srcIn = s.src_in || 0, srcOut = srcIn + s.dur * (s.speed || 1);
  edl += `${n}  ${s.id.padEnd(8)} V     C        ${tc(srcIn)} ${tc(srcOut)} ${tc(3600 + s.start)} ${tc(3600 + s.start + s.dur)}\n`;
  edl += `* FROM CLIP NAME: ${s.id}.mp4\n* COMMENT: ${s.section} - ${s.shot} - speed ${Math.round((s.speed || 1) * 100)}% - transition in: ${s.trans_in}\n`;
  if ((s.speed || 1) !== 1) edl += `M2   ${s.id.padEnd(8)}      ${(FPS * s.speed).toFixed(1).padStart(5)}                ${tc(srcIn)}\n`;
  edl += `\n`;
});
fs.writeFileSync("exports/P1_timeline.edl", edl);
let srt = "";
cfg.titles.forEach((t, i) => { srt += `${i + 1}\n${srtT(t.start)} --> ${srtT(t.start + t.dur)}\n${t.lines.map(l => l.text).join("\n")}\n\n`; });
fs.writeFileSync("exports/P1_onscreen_text.srt", srt);
run(["-i", outFile, "-vf", `fps=1/2.5,scale=384:-1,tile=6x4:padding=6:color=0x141312`, "-frames:v", "1", (FINAL ? "exports" : "drafts") + "/P1_contact_sheet.png"], "contact sheet");
console.log("Sidecars -> exports/P1_timeline.edl, exports/P1_onscreen_text.srt, contact sheet");
