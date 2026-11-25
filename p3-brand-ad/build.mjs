// Project 3 - Real Estate Brand Ad - reproducible FFmpeg assembly (16:9 master + 9:16 cutdown)
//   node build.mjs [--final] [--config shotlist_9x16.json]
// Usage from this folder:
//   node build.mjs            -> draft (DRAFT label, timecode, Instagram safe-zone guides)
//   node build.mjs --final    -> clean export for upload
//   node build.mjs --guides   -> draft with safe-zone guides only (no label)
// Footage is read from shotlist.json "footage_dir" (shared with Project 1). Each shot is a moving 9:16 crop of the 16:9 source.
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const FINAL = process.argv.includes("--final");
const ci = process.argv.indexOf("--config");
const cfg = JSON.parse(fs.readFileSync(ci > 0 ? process.argv[ci + 1] : "shotlist.json", "utf8"));
const TAG = cfg.tag || "P3";
const { w: W, h: H, fps: FPS, duration: DUR } = cfg.format;
const TMP = "build";
for (const d of [TMP, "titles", "drafts", "exports"]) fs.mkdirSync(d, { recursive: true });

function run(args, label) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.status !== 0) { console.error(`\nFFmpeg failed (${label}):\n${r.stderr}`); process.exit(1); }
}
function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate:format=duration", "-of", "json", file], { encoding: "utf8" });
  const j = JSON.parse(r.stdout || "{}"); const s = (j.streams || [])[0] || {};
  const [n, d] = (s.r_frame_rate || "0/1").split("/").map(Number);
  return { w: s.width, h: s.height, fps: d ? n / d : 0, dur: Number(j.format?.duration || 0) };
}
const find = (base, exts) => exts.map(e => base + e).find(f => fs.existsSync(f));
const track = s => s.split("").join(" ").replace(/   /g, "     ");
const tf = (name, text, raw) => { const p = `${TMP}/${name}.txt`; fs.writeFileSync(p, raw ? text : text.replace(/\\/g, "\\\\").replace(/%/g, "\\%"), "utf8"); return p; };
const srtT = t => { const ms = Math.round(t * 1000); return [Math.floor(ms / 3600000), Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60].map(v => String(v).padStart(2, "0")).join(":") + "," + String(ms % 1000).padStart(3, "0"); };
const WARM = "0xF4EFE6";

// ---------- 1. Title PNGs (transparent 1080x1920; importable as CapCut overlays) ----------
for (const t of cfg.titles) {
  const parts = [];
  if (t.scrim === "bottom") parts.push(`geq=r=0:g=0:b=0:a='if(gt(Y\\,H*0.5)\\,160*pow((Y-H*0.5)/(H*0.5)\\,1.3)\\,0)'`);
  if (t.scrim === "full") parts.push(`geq=r=0:g=0:b=0:a='75+60*hypot(X-W/2\\,Y-H/2)/hypot(W/2\\,H/2)'`);
  if (t.scrim === "center") parts.push(`geq=r=0:g=0:b=0:a='165*exp(-pow((Y-H*0.47)/(H*0.2)\\,2))'`);
  if (t.rule) parts.push(`drawbox=x=(iw-${t.rule.w})/2:y=${t.rule.y}:w=${t.rule.w}:h=2:color=0xC8B48A@0.9:t=fill:replace=1`);
  t.lines.forEach((l, i) => {
    const file = tf(`${t.id}_${i}`, l.track ? track(l.text) : l.text);
    const x = l.align === "center" ? "(w-text_w)/2" : (l.x ?? 90);
    parts.push(`drawtext=fontfile=fonts/${l.font}:textfile=${file}:fontsize=${l.size}:fontcolor=${l.color || WARM}:x=${x}:y=${l.y}:shadowcolor=black@0.45:shadowx=0:shadowy=3`);
  });
  run(["-f", "lavfi", "-i", `color=c=black@0.0:s=${W}x${H},format=rgba`, "-vf", parts.join(","), "-frames:v", "1", `titles/${t.id}.png`], `title ${t.id}`);
}
console.log(`Titles: ${cfg.titles.length} PNGs -> titles/`);

// ---------- 2. Per-shot vertical segments (moving 9:16 crop + push-in + grade) ----------
const shots = cfg.shots;
const grade = fs.existsSync(cfg.grade.lut) ? `lut3d=file=${cfg.grade.lut}` : cfg.grade.builtin;
const report = [];
let missing = 0;
shots.forEach((s, i) => {
  const next = shots[i + 1];
  const overlap = next ? (next.trans_in === "cut" ? 1 / FPS : next.trans_dur) : 0;
  const segDur = s.dur + overlap;
  const out = `${TMP}/${s.id}.mp4`;
  const enc = ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p", "-r", String(FPS), "-t", segDur.toFixed(4), out];
  const src = `${cfg.footage_dir}/${s.src}`;
  if (!fs.existsSync(src)) {
    missing++;
    const sz = Math.round(Math.min(W, H) / 30);
    run(["-f", "lavfi", "-i", `color=c=0x23211E:s=${W}x${H}:r=${FPS}`, "-vf", [
      `drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${tf(s.id + "_m1", s.id + "   " + s.section)}:fontsize=${sz}:fontcolor=0xC8B48A:x=(w-text_w)/2:y=h/2-${sz * 3}`,
      `drawtext=fontfile=fonts/georgia.ttf:textfile=${tf(s.id + "_m2", s.shot || "")}:fontsize=${sz}:fontcolor=0xF4EFE6:x=(w-text_w)/2:y=h/2-${sz}`,
      `drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${tf(s.id + "_m3", "PLACEHOLDER - awaiting approved download: " + s.src.split("/").pop())}:fontsize=${Math.round(sz * 0.7)}:fontcolor=0xD98C6A:x=(w-text_w)/2:y=h/2+${sz * 2}`].join(","), ...enc], s.id);
    report.push(`${s.id}  MISSING ${src}`); return;
  }
  const p = probe(src);
  const speed = Math.max(s.speed || 1, FPS / (p.fps || FPS)); // never slow 30fps footage below real time
  const cw = Math.round(p.h * 9 / 16 / 2) * 2;                 // 9:16 window inside 16:9 source
  const cx1 = s.cx ?? 0.5, cx2 = s.cx2 ?? cx1;
  const push = s.push || 0;
  const chain = [
    `setpts=(PTS-STARTPTS)/${speed}`, `fps=${FPS}`,
    W > H ? `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}`
          : `crop=w=${cw}:h=ih:x='(iw-ow)*(${cx1}+(${cx2 - cx1})*min(t/${segDur}\\,1))':y=0,scale=${W}:${H}:flags=lanczos`,
    push ? `scale=w='trunc(${W}*(1+${push}*t/${segDur})/2)*2':h=-2:eval=frame,crop=${W}:${H}` : null,
    s.type === "blur" ? "boxblur=luma_radius=40:luma_power=2,eq=brightness=-0.18:saturation=0.7" : grade,
    "tpad=stop_mode=clone:stop_duration=3", "setsar=1"
  ].filter(Boolean).join(",");
  run(["-ss", String(s.src_in || 0), "-i", src, "-vf", chain, ...enc], s.id);
  const need = segDur * speed + (s.src_in || 0);
  report.push(`${s.id}  ${s.src} in ${s.src_in}s  crop ${cx1}->${cx2}  ${s.type || ""}${p.dur < need ? `  WARNING clip ends at ${p.dur.toFixed(2)}s, needs ${need.toFixed(2)}s` : ""}`);
});
console.log("Shots:\n  " + report.join("\n  "));
if (FINAL && missing) { console.error(`--final refused: ${missing} missing clip(s).`); process.exit(1); }

// ---------- 3. Assemble: beat-cut transitions, animated titles, audio ----------
const inputs = [], fc = [];
shots.forEach(s => inputs.push("-threads", "1", "-i", `${TMP}/${s.id}.mp4`));  // low-RAM friendly: one decoder thread per segment
shots.forEach((s, i) => fc.push(`[${i}:v]fps=${FPS},settb=AVTB,format=yuv420p[v${i}]`));
let last = "v0";
shots.slice(1).forEach((s, k) => {
  const i = k + 1, cut = s.trans_in === "cut";
  fc.push(`[${last}][v${i}]xfade=transition=${cut ? "fade" : s.trans_in}:duration=${(cut ? 1 / FPS : s.trans_dur).toFixed(4)}:offset=${s.start.toFixed(4)}[x${i}]`);
  last = `x${i}`;
});
fc.push(`[${last}]trim=0:${DUR},setpts=PTS-STARTPTS[base]`); last = "base";
let idx = shots.length;
cfg.titles.forEach(t => {
  inputs.push("-loop", "1", "-framerate", String(FPS), "-t", String(t.dur), "-i", `titles/${t.id}.png`);
  const fi = 0.25, fo = 0.2, rise = 0.35;
  fc.push(`[${idx}:v]format=rgba,fade=t=in:st=0:d=${fi}:alpha=1,fade=t=out:st=${(t.dur - fo).toFixed(3)}:d=${fo}:alpha=1,setpts=PTS-STARTPTS+${t.start}/TB[t${idx}]`);
  // "rise": text slides up 60px with an ease-out over 0.35 s (motion typography)
  const y = t.anim === "rise" ? `'60*pow(max(0\\,1-(t-${t.start})/${rise})\\,3)'` : "0";
  fc.push(`[${last}][t${idx}]overlay=x=0:y=${y}:eval=frame:eof_action=pass[o${idx}]`);
  last = `o${idx}`; idx++;
});
let vfinal = `[${last}]fade=t=in:st=0:d=${cfg.fade_in || 0.1},fade=t=out:st=${DUR - (cfg.fade_out || 0.4)}:d=${cfg.fade_out || 0.4}`;
if (!FINAL && W > H) vfinal += `,drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${tf("draft_label16", `${TAG} DRAFT  |  ${missing ? missing + " PLACEHOLDER SHOTS  |  " : ""}SAMPLE PORTFOLIO PROJECT`)}:fontsize=20:fontcolor=white@0.75:box=1:boxcolor=black@0.45:boxborderw=8:x=24:y=24,drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${tf("draft_tc16", "%{pts:hms}", true)}:fontsize=22:fontcolor=white@0.85:box=1:boxcolor=black@0.45:boxborderw=8:x=w-text_w-24:y=h-text_h-24`;
const GUIDES = !FINAL && H > W;
if (GUIDES) {
  // Instagram Reels UI zones (approx.): top 220 px, bottom 420 px (caption/buttons), right 140 px (action icons)
  vfinal += `,drawbox=x=0:y=220:w=iw-140:h=ih-640:color=yellow@0.7:t=3,drawbox=x=0:y=0:w=iw:h=220:color=black@0.25:t=fill,drawbox=x=0:y=ih-420:w=iw:h=420:color=black@0.25:t=fill`;
  const l1 = tf("draft_label", `${TAG} DRAFT  |  SAFE-ZONE GUIDES  |  SAMPLE PORTFOLIO PROJECT`);
  vfinal += `,drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${l1}:fontsize=22:fontcolor=white@0.85:box=1:boxcolor=black@0.5:boxborderw=8:x=24:y=150`;
  vfinal += `,drawtext=fontfile=fonts/Montserrat-Regular.ttf:textfile=${tf("draft_tc", "%{pts:hms}", true)}:fontsize=26:fontcolor=white@0.9:box=1:boxcolor=black@0.5:boxborderw=8:x=24:y=h-text_h-440`;
}
fc.push(vfinal + ",format=yuv420p[vout]");

const music = find(cfg.music.file_glob, [".wav", ".mp3", ".m4a", ".aac", ".flac"]);
const aParts = [];
if (music) {
  inputs.push("-ss", String(cfg.music.start_in_track), "-i", music);
  fc.push(`[${idx}:a]atempo=${cfg.music.tempo_ratio || 1},atrim=0:${DUR},asetpts=PTS-STARTPTS,volume=${cfg.music.gain_db}dB,afade=t=out:st=${DUR - 1.5}:d=1.5[mus]`);
} else {
  const beat = 60 / cfg.music.bpm, bar = beat * 4;
  inputs.push("-f", "lavfi", "-t", String(DUR), "-i", `aevalsrc='0.18*sin(2*PI*if(lt(mod(t\\,${bar})\\,0.05)\\,1320\\,880)*t)*exp(-55*mod(t\\,${beat}))':s=48000:c=stereo`);
  fc.push(`[${idx}:a]anull[mus]`);
}
aParts.push("[mus]"); idx++;
const sfxUsed = [];
cfg.sfx.forEach(s => {
  if (!fs.existsSync(s.file)) return;
  inputs.push("-i", s.file); const ms = Math.round(s.at * 1000);
  fc.push(`[${idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${s.gain_db}dB,adelay=${ms}|${ms}[s${idx}]`);
  aParts.push(`[s${idx}]`); sfxUsed.push(`${s.file}@${s.at}s`); idx++;
});
fc.push(`${aParts.join("")}amix=inputs=${aParts.length}:normalize=0:duration=first,atrim=0:${DUR},loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[aout]`);

const outFile = (FINAL ? "exports/" : "drafts/") + `${cfg.out_name}_${W}x${H}${FINAL ? "" : "_draft"}.mp4`;
fs.writeFileSync(`${TMP}/filtergraph.txt`, fc.join(";\n"));
run(["-filter_complex_threads", "1", ...inputs, "-/filter_complex", `${TMP}/filtergraph.txt`, "-map", "[vout]", "-map", "[aout]",
  "-c:v", "libx264", "-threads", "2", "-preset", FINAL ? "slow" : "medium", "-crf", FINAL ? "17" : "20", "-profile:v", "high", "-level", "4.2", "-pix_fmt", "yuv420p", "-r", String(FPS),
  "-maxrate", "12M", "-bufsize", "24M", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", "-t", String(DUR), outFile], "assemble");

const meas = s => { const m = spawnSync("ffmpeg", ["-hide_banner", "-i", s, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr.split("Summary:").pop().match(/I:\s+(-?[\d.]+) LUFS[\s\S]*Peak:\s+(-?[\d.]+)/); return m ? [+m[1], +m[2]] : [NaN, NaN]; };
let [lufs] = meas(outFile);
if (Math.abs(lufs + 14) > 0.5) {
  run(["-i", outFile, "-c:v", "copy", "-af", `volume=${(-14 - lufs).toFixed(2)}dB,alimiter=limit=0.84:level=false`, "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", `${TMP}/loud_fix.mp4`], "loudness fix");
  fs.renameSync(`${TMP}/loud_fix.mp4`, outFile);
}
const [l2, p2] = meas(outFile);
console.log(`QC loudness: ${l2} LUFS, peak ${p2} dBFS (target -14 / <= -1)`);
console.log(`Audio: ${music || "TEMP CLICK TRACK @" + cfg.music.bpm + " BPM (no music supplied)"}${sfxUsed.length ? " + " + sfxUsed.join(", ") : ""}`);
console.log(`Rendered -> ${outFile}`);

// ---------- 4. Sidecars: on-screen text SRT, cover frame, contact sheet ----------
let srt = ""; cfg.titles.forEach((t, i) => { srt += `${i + 1}\n${srtT(t.start)} --> ${srtT(t.start + t.dur)}\n${t.lines.map(l => l.text).join("\n")}\n\n`; });
fs.writeFileSync(`exports/${cfg.out_name}_${W}x${H}_onscreen_text.srt`, srt);
run(["-ss", "1.2", "-i", outFile, "-frames:v", "1", (FINAL ? "exports" : "drafts") + `/${cfg.out_name}_${W}x${H}_cover.jpg`], "cover");
run(["-i", outFile, "-vf", W > H ? "fps=1/2,scale=384:-1,tile=5x5:padding=4:color=0x141312" : "fps=1,scale=216:-1,tile=12x4:padding=4:color=0x141312", "-frames:v", "1", (FINAL ? "exports" : "drafts") + `/${cfg.out_name}_${W}x${H}_contact_sheet.png`], "contact");
console.log(`Sidecars -> exports/${cfg.out_name}_${W}x${H}_onscreen_text.srt, cover frame, contact sheet`);
