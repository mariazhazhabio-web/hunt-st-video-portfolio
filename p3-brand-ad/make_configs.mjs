// Generates shotlist.json (16:9 master) and shotlist_9x16.json (vertical cutdown) from one edit decision list.
import fs from "node:fs";
const K = id => `../../p1-luxury-apartment/footage/_src/pexels-${id}.mp4`;   // Kindel Media / Curtis Adams clips from Project 1
const N = id => `_src/pexels-${id}.mp4`;                                    // Project 3 lifestyle clips (footage/_src)
// id, start, dur, act, src, in, speed, push, trans_in, trans_dur, cx(vertical), shot description
const E = [
  ["B01", 0.0, 4.8, "ARCHITECTURE", N(39024321), 1.0, 1.0, 0.03, "cut", 0, 0.50, "Aerial: coastal residence at dusk"],
  ["B02", 4.8, 2.4, "ARCHITECTURE", N(36532059), 0.5, 0.5, 0.0, "fade", 0.4, 0.55, "Contemporary home and terrace (50 fps slow motion)"],
  ["B03", 7.2, 2.4, "ARCHITECTURE", K(7578541), 14.5, 0.834, 0.03, "cut", 0, 0.50, "Facade and terrace with sun flare"],
  ["B04", 9.6, 2.4, "LIGHT", K(7578546), 8.0, 0.834, 0.04, "fadeblack", 0.6, 0.52, "Light across open-plan living"],
  ["B05", 12.0, 2.4, "LIGHT", K(7578552), 2.0, 0.834, 0.0, "cut", 0, 0.50, "Dining room and chandelier"],
  ["B06", 14.4, 2.4, "LIGHT", K(7578551), 8.0, 0.834, 0.0, "cut", 0, 0.42, "Bathroom: light through frosted glass"],
  ["B07", 16.8, 2.4, "LIGHT", K(19228419), 4.0, 0.834, 0.04, "cut", 0, 0.70, "Brass spout macro"],
  ["B08", 19.2, 2.4, "LIFE", N(7394006), 6.0, 0.5, 0.0, "fadeblack", 0.6, 0.55, "Morning coffee in the kitchen (60 fps slow motion)"],
  ["B09", 21.6, 2.4, "LIFE", N(4778794), 0.0, 1.0, 0.03, "cut", 0, 0.55, "Reading by the window"],
  ["B10", 24.0, 1.2, "LIFE", N(8764576), 2.0, 1.0, 0.0, "cut", 0, 0.45, "Wine pour close-up"],
  ["B11", 25.2, 2.4, "LIFE", N(6289666), 6.0, 1.0, 0.0, "cut", 0, 0.50, "Dinner served at a candlelit table"],
  ["B12", 27.6, 3.6, "LIFE", N(8922354), 0.0, 1.0, 0.0, "cut", 0, 0.50, "Friends raising a glass"],
  ["B13", 31.2, 2.4, "BRAND", N(39576513), 1.0, 1.0, 0.03, "fade", 0.6, 0.40, "Pool and palm view"],
  ["B14", 33.6, 2.4, "BRAND", N(36868096), 2.0, 0.5, 0.0, "cut", 0, 0.50, "Waterfront aerial (60 fps slow motion)"],
  ["B15", 36.0, 4.8, "OUTRO", N(36868096), 6.0, 0.5, 0.0, "fade", 0.8, 0.50, "Brand end card over blurred waterfront", "blur"]
];
const shots = E.map(([id, start, dur, section, src, src_in, speed, push, trans_in, trans_dur, cx, shot, type]) =>
  ({ id, start, dur, section, shot, src, src_in, speed, push, cx, cx2: cx, trans_in, ...(trans_in !== "cut" ? { trans_dur } : {}), ...(type ? { type } : {}) }));
const common = {
  project: "P3 - Real Estate Brand Promotional Ad",
  label: "Self-initiated sample portfolio project - fictional brand - not commissioned client work",
  tag: "P3", out_name: "P3_Verane_Brand_Ad", footage_dir: "footage", fade_in: 1.0, fade_out: 1.2,
  music: { bpm: 100, file_glob: "music/P3_music", start_in_track: 0.0, gain_db: 0 },
  grade: { lut: "luts/P3_look.cube", builtin: "eq=contrast=1.07:saturation=0.88:gamma=1.01,colorbalance=rs=-0.01:bs=0.03:rh=0.04:gh=0.01:bh=-0.03,vignette=angle=PI/6" },
  shots,
  sfx: [
    { file: "sfx/ocean_ambience.wav", at: 0.0, gain_db: -24 },
    { file: "sfx/wind_soft.wav", at: 4.8, gain_db: -26 },
    { file: "sfx/whoosh_soft.wav", at: 9.2, gain_db: -22 },
    { file: "sfx/water_tap.wav", at: 16.8, gain_db: -20 },
    { file: "sfx/whoosh_soft.wav", at: 18.8, gain_db: -22 },
    { file: "sfx/coffee_pour.wav", at: 19.3, gain_db: -18 },
    { file: "sfx/page_turn.wav", at: 22.4, gain_db: -20 },
    { file: "sfx/wine_pour.wav", at: 24.0, gain_db: -18 },
    { file: "sfx/glass_clink.wav", at: 28.0, gain_db: -16 },
    { file: "sfx/low_boom.wav", at: 36.0, gain_db: -14 }
  ]
};
const credit = "Edited by Maria Zha-Zha C Bio";
const discl = "Self-initiated sample portfolio project  |  Fictional brand  |  Not commissioned client work";
const msg = (id, start, dur, label, line, y, size, scrim) => ({ id, start, dur, anim: "rise", scrim, lines: [
  { text: label, font: "Montserrat-Regular.ttf", size: Math.round(size * 0.42), track: true, y: y - Math.round(size * 0.95), align: "center", color: "0xC8B48A" },
  { text: line, font: "georgiai.ttf", size, y, align: "center" }] });

const h = { ...common, format: { w: 1920, h: 1080, fps: 25, duration: 40.8 }, titles: [
  msg("T1", 1.2, 3.3, "VERANE", "Architecture is the frame.", 880, 66, "bottom"),
  msg("T2", 10.2, 3.6, "VERANE", "Light is the material.", 880, 66, "bottom"),
  msg("T3", 19.8, 3.6, "VERANE", "Life is the reason.", 880, 66, "bottom"),
  { id: "T4", start: 31.7, dur: 3.9, anim: "rise", scrim: "bottom", lines: [{ text: "Homes, composed.", font: "georgiai.ttf", size: 84, y: 860, align: "center" }] },
  { id: "T5", start: 36.6, dur: 4.2, anim: "rise", scrim: "full", rule: { y: 515, w: 140 }, lines: [
    { text: "VERANE", font: "georgia.ttf", size: 124, track: true, y: 370, align: "center" },
    { text: "RESIDENCES", font: "Montserrat-Regular.ttf", size: 30, track: true, y: 540, align: "center", color: "0xC8B48A" },
    { text: "Private viewings by appointment", font: "georgiai.ttf", size: 48, y: 640, align: "center" },
    { text: credit, font: "Montserrat-Regular.ttf", size: 24, y: 900, align: "center", color: "0xBDB6AA" },
    { text: discl, font: "Montserrat-Regular.ttf", size: 20, y: 945, align: "center", color: "0x9A9387" }] }
]};
const v = { ...common, out_name: "P3_Verane_Brand_Ad", format: { w: 1080, h: 1920, fps: 25, duration: 40.8 }, titles: [
  msg("T1", 1.2, 3.3, "VERANE", "Architecture", 900, 96, "center"), 
  msg("T2", 10.2, 3.6, "VERANE", "Light", 900, 110, "center"),
  msg("T3", 19.8, 3.6, "VERANE", "Life", 900, 120, "center"),
  { id: "T4", start: 31.7, dur: 3.9, anim: "rise", scrim: "center", lines: [
    { text: "Homes,", font: "georgiai.ttf", size: 110, y: 830, align: "center" },
    { text: "composed.", font: "georgiai.ttf", size: 110, y: 960, align: "center" }] },
  { id: "T5", start: 36.6, dur: 4.2, anim: "rise", scrim: "center", rule: { y: 830, w: 120 }, lines: [
    { text: "VERANE", font: "georgia.ttf", size: 116, track: true, y: 680, align: "center" },
    { text: "RESIDENCES", font: "Montserrat-Regular.ttf", size: 34, track: true, y: 855, align: "center", color: "0xC8B48A" },
    { text: "Private viewings", font: "georgiai.ttf", size: 62, y: 960, align: "center" },
    { text: "by appointment", font: "georgiai.ttf", size: 62, y: 1040, align: "center" },
    { text: credit, font: "Montserrat-Regular.ttf", size: 28, y: 1330, align: "center", color: "0xBDB6AA" },
    { text: "Sample portfolio project  |  Fictional brand", font: "Montserrat-Regular.ttf", size: 24, y: 1380, align: "center", color: "0x9A9387" },
    { text: "Not commissioned client work", font: "Montserrat-Regular.ttf", size: 24, y: 1418, align: "center", color: "0x9A9387" }] }
]};
// Vertical messages: one big word per act with the full line as the small label
v.titles[0].lines[0].text = "ARCHITECTURE IS THE FRAME"; v.titles[0].lines[1].text = "Architecture";
v.titles[1].lines[0].text = "LIGHT IS THE MATERIAL";
v.titles[2].lines[0].text = "LIFE IS THE REASON";
v.titles.slice(0, 3).forEach(t => { t.lines[0].size = 34; t.lines[0].y = 820; t.lines[1].y = 880; });

// ---- Fit to the music: Piano And Strings (AtlasAudio) measured 114.84 BPM, played at 1.0047x -> 0.52 s beat (13 frames @25fps)
const BEAT = 0.52, BEATS = [8, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 6, 4, 4, 8];
function fit(cfg) {
  let t = 0; cfg.shots.forEach((s, i) => { s.start = +t.toFixed(2); s.dur = +(BEATS[i] * BEAT).toFixed(2); t += BEATS[i] * BEAT; });
  cfg.format.duration = +t.toFixed(2);
  const S = Object.fromEntries(cfg.shots.map(s => [s.id, s])), end = id => S[id].start + S[id].dur;
  const span = { T1: ["B01", "B01", 1.0, 0.2], T2: ["B04", "B05", 0.5, 0.3], T3: ["B08", "B09", 0.5, 0.3], T4: ["B13", "B14", 0.4, 0.3], T5: ["B15", "B15", 0.5, 0] };
  cfg.titles.forEach(x => { const [a, b, pi, po] = span[x.id]; x.start = +(S[a].start + pi).toFixed(2); x.dur = +(end(b) - po - x.start).toFixed(2); });
  const anchor = [["B01", 0], ["B02", 0], ["B04", -0.4], ["B07", 0], ["B08", -0.4], ["B08", 0.1], ["B09", 0.8], ["B10", 0], ["B12", 0.4], ["B15", 0]];
  cfg.sfx.forEach((x, i) => { x.at = +Math.max(0, S[anchor[i][0]].start + anchor[i][1]).toFixed(2); });
  cfg.music = { ...cfg.music, bpm: 115.38, file_glob: "music/P3_music", start_in_track: 19.161, tempo_ratio: 1.0047, gain_db: 0 };
  return cfg;
}
fit(h); fit(v);
fs.writeFileSync("shotlist.json", JSON.stringify(h, null, 2));
fs.writeFileSync("shotlist_9x16.json", JSON.stringify(v, null, 2));
console.log("wrote shotlist.json (16:9) and shotlist_9x16.json (9:16)");
