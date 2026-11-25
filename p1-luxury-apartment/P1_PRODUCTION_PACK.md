# Project 1: Luxury Apartment Showcase. Production Pack

> **Self-initiated sample portfolio project.** "Verane Residences" is a fictional brand made up for this sample. This is not commissioned client work. All footage, music and SFX must be legally licensed or your own.

| | |
|---|---|
| Runtime | **52.8 s** (22 bars at 100 BPM) |
| Format | 16:9, 1920×1080, 25 fps (Australian PAL standard), H.264 High, AAC 48 kHz 320 kbps |
| 4K option | If every source clip is UHD, set `"w": 3840, "h": 2160` in `shotlist.json` and double the title `size`, `x` and `y` values |
| Delivery loudness | -14 LUFS integrated, true peak ≤ -1 dBTP (web and social) |
| Status | **Draft v02 cut with licensed Pexels stock** (see `footage/LICENCES.txt`). Still needs licensed music and optional SFX before `--final` |

> **v03 music fit (2026-11-23):** The music is *Cinematic Piano* by AtlasAudio (Pixabay Content License, see `music/LICENCE.txt`). It measured 79.5 BPM, so it plays 0.7% slower to give a 0.76 s beat (19 frames at 25 fps). The edit was re-timed to that beat: hero wides are 6 beats (4.56 s), supporting shots 4 beats (3.04 s) and details 2 beats (1.52 s). The **runtime is now 57.76 s**. Title and SFX timings follow their shots automatically. The second-by-second table below shows the original 100 BPM plan; `shotlist.json` holds the current timings.
>
> **v02 footage update (2026-11-22):** The footage is one modern house filmed by Kindel Media (Pexels), plus one tap close-up by Curtis Adams. Because of that:
> - The piece is now a **"Luxury Residence Showcase"**. Room captions were adjusted to match the footage: *An entertainer's kitchen* and *Indoor-outdoor living*. The highlights line is now *Open-plan living, alfresco terrace, landscaped garden*.
> - S09 is now an **ensuite reveal**, and S12–S16 cover the view, terrace, garden and dining.
> - The source is 30 fps, so every clip plays at **83% (30→25 fps conform)**, not the planned 50%. Treat the 50% values in the tables below as the ideal for a future shoot at 50/60 fps.
> - The in-points for each clip (`src_in`) are in `shotlist.json`.
> - A soft gradient was added behind the titles so they stay readable over bright skies.

---

## 1. Creative brief

**Objective:** Show a premium buyer the feeling of living in the apartment within 50 seconds, then hand off to a clear call to action. For the employer, it shows restraint, rhythm, clean typography and a consistent grade.

**Audience:** Owner-occupiers and investors aged 35–65 who are cash-rich and time-poor. They watch on desktop listings, YouTube pre-roll and agency websites.

**Tone:** Quiet confidence. Slow, deliberate camera moves and no flashy transitions. Light and texture do the selling.

**Structure, mirroring an inspection walk-through:**
Arrival (aerial and facade) → threshold (door) → living → kitchen → bedroom → bathroom → view → amenities montage (rhythm lifts) → highlights card → brand close.

**Pacing logic:** Hero wides hold for 2 bars (4.8 s). Supporting shots hold for 1 bar (2.4 s). Details get a 1.5 + 0.5 bar split (3.6 + 1.2 s) so they cut on the off-beat accent. The amenities montage drops to half-bar cuts (1.2 s) to lift energy before the calm close.

**Brand system:**
- Typefaces: **Georgia / Georgia Italic** (serif, editorial) with **Montserrat Regular** (tracked caps for labels). CapCut equivalents: *Playfair Display* or *Cormorant* plus *Montserrat*.
- Colours: warm white `#F4EFE6` for text, champagne `#C8B48A` for accents and rules, charcoal `#141312` for the end card.
- Lower-left room captions sit at x 120 / y 900 (inside the 1080p title-safe area), Georgia Italic 58 px, with a soft 2 px drop shadow.

---

## 2. Storyboard and second-by-second shot list

TC = timeline position. "Speed 50%" means the clip must be **shot at 50 fps** (or 60) and conformed to 25 fps for smooth slow motion. The build script checks this automatically and raises the speed if the source frame rate is too low.

| # | TC in–out | Len | Section | Shot / framing | Camera move | Speed | Transition in | On-screen text | Audio cue |
|---|---|---|---|---|---|---|---|---|---|
| S01 | 0:00.0–0:04.8 | 4.8 | Establishing | Aerial at blue hour, building on right third | Drone push-in / slow orbit, +4% digital push | 100% | Fade from black 1.0 s | **VERANE / RESIDENCES** (1.0–4.4) | Soft riser, music in |
| S02 | 0:04.8–0:07.2 | 2.4 | Establishing | Street facade, symmetrical, straight verticals | Gimbal tilt-up | 50% | Cut on bar | SYDNEY NSW lower third (5.0–7.0) | |
| S03 | 0:07.2–0:09.6 | 2.4 | Entrance | Door opens / walk into lobby | Gimbal walk-in | 50% | Cut | | Door SFX at 7.3 |
| S04 | 0:09.6–0:14.4 | 4.8 | Living | Hero wide, 16–24 mm, reveal windows | Slider truck L→R | 50% | Cross-dissolve 0.5 s | *Light-filled living* (10.2–14.1) | Whoosh at 9.35 (very low) |
| S05 | 0:14.4–0:16.8 | 2.4 | Living | Light across cushion / art / stone | Push +3% or rack focus | 50% | Cut | | |
| S06 | 0:16.8–0:20.4 | 3.6 | Kitchen | Island as leading line, low-ish | Slow push +4% | 50% | Cut | *Stone and brass kitchen* (17.2–21.4) | |
| S07 | 0:20.4–0:21.6 | 1.2 | Kitchen | Tapware / stone edge macro | Static or micro slide | 50% | Cut on off-beat | | |
| S08 | 0:21.6–0:26.4 | 4.8 | Bedroom | Bed centred from doorway | Slow push +5% | 50% | Cross-dissolve 0.5 s | *A private retreat* (22.3–28.5) | Music drops to a softer section if available |
| S09 | 0:26.4–0:28.8 | 2.4 | Bedroom | Linen / lamp / sheer curtain | Slow slide | 50% | Cut | | |
| S10 | 0:28.8–0:32.4 | 3.6 | Bathroom | Vanity + freestanding bath, no camera in mirror | Lateral slide | 50% | Cut | *Spa-inspired bathrooms* (29.2–33.4) | |
| S11 | 0:32.4–0:33.6 | 1.2 | Bathroom | Water from tap / rain shower, macro | Static | 40% (shoot 60+ fps) | Cut | | Water SFX at 32.4 |
| S12 | 0:33.6–0:36.0 | 2.4 | View | Balcony doors open onto view, frame-in-frame | Gimbal push through door | 50% | Cut | | |
| S13 | 0:36.0–0:38.4 | 2.4 | Amenities | Pool, top-down or wide | Drone top-down / slide | 50% | Cut | *Resort-style amenities* (36.3–42.9) | Rhythm lifts |
| S14 | 0:38.4–0:39.6 | 1.2 | Amenities | Gym / wellness | Static or slide | 50% | Cut on beat | | |
| S15 | 0:39.6–0:40.8 | 1.2 | Amenities | Residents lounge / rooftop | Static or slide | 50% | Cut on beat | | |
| S16 | 0:40.8–0:43.2 | 2.4 | Amenities | Lobby / concierge / garden | Push +3% | 50% | Cut | | Whoosh at 42.95 |
| S17 | 0:43.2–0:48.0 | 4.8 | Highlights | Twilight exterior / balcony view, clean lower half | Very slow push +3% | 100% | Cross-dissolve 0.75 s | **3 BED \| 2 BATH \| 2 CAR** + *Harbour views, rooftop pool, 24-hour concierge* (43.8–47.8) | |
| S18 | 0:48.0–0:52.8 | 4.8 | Close | Charcoal brand card | — | — | Dip to black 0.8 s | **VERANE / RESIDENCES**, *Private inspections by appointment*, editor credit, sample-project disclaimer (48.6–52.8) | Low hit at 48.0, music resolves, 1 s fade out |

**Storyboard frames:** [drafts/P1_contact_sheet.png](drafts/P1_contact_sheet.png) shows one frame every 2.5 s of the current animatic. When you drop footage in and re-run the build, it is regenerated from real frames.

---

## 3. Post-production spec

### Music direction
- **Feel:** Modern cinematic or neo-classical. Felt piano or soft pulsing synth, light strings, subtle percussion entering around 0:36 for the amenities lift. Avoid vocals, EDM drops and "epic trailer" hits.
- **Tempo:** 100 BPM is ideal because the edit grid is built on it. Anything from 95–105 BPM works if you trim to the downbeat.
- **Search terms:** "luxury real estate cinematic piano", "elegant corporate ambient", "minimal piano strings 100 bpm".
- **Licensed sources:** CapCut's commercial-use music filter (only tracks marked for commercial use), Pixabay Music, YouTube Audio Library, or a paid licence (Artlist, Epidemic Sound, Musicbed). **Save the licence or receipt** in `music/` next to the track.

### Title design (already built: `titles/T01–T09.png`, transparent 1920×1080)
| ID | Use | Style |
|---|---|---|
| T01 / T09 | Brand open / close | Georgia 110–120 px, tracked caps, champagne 2 px rule, Montserrat tracked sub-line |
| T02 | Location lower third | Montserrat 30 px tracked caps, 60 px champagne rule above |
| T03–T07 | Room captions | Georgia Italic 58 px, lower left |
| T08 | Property highlights | Montserrat 34 px champagne + Georgia Italic 50 px, centred lower third |

All titles fade in and out over 0.6 s. Captions arrive about 0.4–0.6 s after the cut, so the eye reads the image first and then the text.

### Transitions
Mostly **straight cuts on the beat**. A dissolve appears only at the three "chapter" changes (S04 living, S08 bedroom, S17 highlights). Dip to black is used only for the open and the end card. No zoom, spin or glitch transitions, because they cheapen premium property content.

### Colour grade ("warm neutral luxury")
1. **Correct first:** white balance to neutral whites (walls), exposure so windows hold detail, and straight verticals (lens correction or crop).
2. **Look:** contrast +6%, saturation -10%, gamma 1.02, warm highlights (+R, -B) and slightly cool shadows, with a gentle vignette.
3. Built-in FFmpeg version: `eq=contrast=1.06:saturation=0.90:gamma=1.02,colorbalance=rs=-0.01:bs=0.02:rh=0.03:gh=0.01:bh=-0.03,vignette=PI/7`.
4. To use your own look, export a `.cube` LUT from CapCut or Resolve as `luts/P1_look.cube`. The script uses it automatically.
5. Keep skin tones (if any people appear) and timber natural. Never push whites yellow.

### Speed adjustments
Interiors are shot at **50 fps and conformed to 50%** (smooth, floaty movement). Water is shot at 60–120 fps for 40% or slower. The aerial and the S17 twilight shot play at 100%. Do not slow down 25/30 fps footage, because it stutters. The script refuses to and logs a warning.

### Sound design (place files in `sfx/` with these names; the script mixes them at the listed times)
| File | Time | Level | Purpose |
|---|---|---|---|
| `riser_soft.wav` | 0.0 | -18 dB | Lift into the title |
| `door_open.wav` | 7.3 | -16 dB | Threshold moment |
| `whoosh_soft.wav` | 9.35, 42.95 | -20 dB | Barely-there air under the dissolves |
| `tap_water.wav` | 32.4 | -18 dB | Sync to the S11 macro |
| `low_hit.wav` | 48.0 | -16 dB | Weight under the end card |

Sources: CapCut's built-in sound effects, Pixabay Sound Effects or freesound.org (CC0 only, so check each file's licence).

---

## 4. How the reproducible build works

```
p1-luxury-apartment/
  shotlist.json   <- single source of truth (timings, text, grade, SFX)
  build.mjs       <- node build.mjs  (draft)  |  node build.mjs --final  (clean export)
  footage/        <- S01.mp4 ... S17.mp4  (or .mov / .jpg / .png)
  music/          <- P1_music.wav|mp3|m4a  (+ licence)
  sfx/  luts/  fonts/  titles/
  drafts/         <- P1_Luxury_Apartment_draft.mp4, contact sheet
  exports/        <- final MP4, P1_timeline.edl (Resolve), P1_onscreen_text.srt
```
- `src_in` in `shotlist.json` sets the in-point (seconds) inside each source clip. Change it to choose the best part of a take.
- `--final` refuses to render while any placeholder is still in the timeline, removes the DRAFT/timecode burn-in, and encodes at CRF 16.
- Every run prints a QC report: per-clip resolution, frame rate, effective speed, short-clip warnings, and integrated loudness and true peak.

---

## 5. Finishing in CapCut Desktop (your main tool)

Use this route if you want hands-on finishing such as keyframed reframing, speed ramps and CapCut's own text animations. The FFmpeg draft is your reference.

1. **New project.** Set Ratio to 16:9 and frame rate to 25 fps (Project settings). Import `footage/`, `music/`, `sfx/`, `titles/`.
2. **Music first.** Drop the track on the audio lane. Right-click → *Beat detection* (Auto beats) and check that the markers sit at 0.6 s spacing (100 BPM).
3. **Rough cut to the table.** Place S01–S17 in order and trim each to the *Len* column. Snap cuts to beat markers, using every 4th marker for bar cuts.
4. **Speed.** Select each 50 fps clip → *Speed* → *Normal* 0.5x and turn off "Pitch". For S11 use 0.4x. Leave S01 and S17 at 1x.
5. **Reframe / push.** On S01, S05, S06, S08, S16 and S17, add *Scale* keyframes from 100% at the start to 103–105% at the end. Set ease to linear or "ease in-out" in the curve menu.
6. **Transitions.** Apply *Mix* (cross dissolve) at 0.5 s into S04 and S08, and 0.75 s into S17. Use *Black fade* into S18. Everything else stays a hard cut.
7. **Colour.** Open *Adjust* on S01, set the basics (Temp, Exposure, Contrast +6, Saturation -10, Highlights warm, Vignette 10–15), then *Save as preset* and apply it to all clips. Fine-tune each clip so the whites match. Optionally use *Adjust → Export LUT* and save it to `luts/P1_look.cube` so the FFmpeg build matches.
8. **Titles.** Either place `titles/T01–T09.png` on an overlay track at the times in the table (add *Fade in / Fade out* 0.6 s animations), or rebuild them as CapCut text (Playfair Display / Montserrat, letter spacing 8–12 for caps) and save them as a *Text template* for re-use in Projects 2 and 3. `exports/P1_onscreen_text.srt` can be imported as captions to get exact timing.
9. **Sound.** Add the SFX at the listed times. Duck the music by about 3 dB under the door and water sounds. Fade the music out over the last 3 s.
10. **Export.** 1080p, 25 fps, H.264, bitrate *Higher*, AAC. Then run the QC check below on the exported file.

### Finishing in DaVinci Resolve (free) via EDL
1. Create a 1080p 25 fps project and import the `footage/` folder.
2. *File → Import → Timeline → `exports/P1_timeline.edl`*. Resolve relinks by clip name (S01.mp4 …). Speed (M2) entries come through.
3. Add the three dissolves listed above, then grade on the Color page and add titles as PNGs.
*(This is offered as an option only. Don't list Resolve as a skill on your resume unless you have actually used it.)*

### QC on any export (PowerShell)
```powershell
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact "exports\P1_Luxury_Apartment_Showcase_1080p25.mp4"
```
```powershell
ffmpeg -hide_banner -i "exports\P1_Luxury_Apartment_Showcase_1080p25.mp4" -af ebur128=peak=true -f null - 2>&1 | Select-String "I:|Peak:" | Select-Object -Last 2
```
Checklist: duration 52.8 s · 1920×1080 · 25 fps · no black frames between cuts · no text outside title-safe · loudness about -14 LUFS / peak ≤ -1 dBTP · sample-project disclaimer visible on the end card.
