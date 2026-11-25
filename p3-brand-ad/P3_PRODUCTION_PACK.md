# Project 3: Real Estate Brand Promotional Ad. Production Pack

> **Self-initiated sample portfolio project** by Maria Zha-Zha C Bio. "Verane" is a fictional property brand. This is not commissioned client work. All footage is Pexels stock under the Pexels licence. Sources are listed in `footage/LICENCES.txt` (added once downloaded) and in Project 1's licence file.

| | |
|---|---|
| Runtime | **40.8 s** (17 bars at 100 BPM, bar = 2.4 s) |
| Master | 16:9, 1920×1080, 25 fps → `exports/P3_Verane_Brand_Ad_1920x1080.mp4` |
| Cutdown | 9:16, 1080×1920, 25 fps (same edit, vertical titles) → `node build.mjs --config shotlist_9x16.json` |
| Loudness | -14 LUFS / ≤ -1 dBTP |
| Status | Structure, titles and timing are locked. 6 of 15 shots use real footage (Project 1 clips). 9 lifestyle and aerial shots are placeholders until you approve the download |

> **Music fit (2026-11-23):** *Piano And Strings* by AtlasAudio (Pixabay Content License, see `music/LICENCE.txt`). It measured 114.8 BPM and plays 0.5% faster to give a 0.52 s beat (13 frames at 25 fps). Every shot length is a whole number of beats (8/4/2/6), so the **runtime is now 35.36 s** in both orientations. The track starts at 19.16 s so that its quiet breath falls just before the dip to black into "Life", and the strings swell carries the lifestyle act. The table below shows the original 100 BPM plan; `make_configs.mjs` holds the current timings.

## 1. Creative brief
**What it sells:** the brand, not one listing. Verane positions itself as a developer and agency whose homes are *composed*, with architecture, light and life in balance. That is the tone of high-end Australian property marketing: understated, coastal light, long lunches, no hard sell.
**Audience:** prospective buyers and vendors of premium homes on YouTube pre-roll, agency websites, Meta in-feed (16:9 and 9:16), and screens in display suites.
**Message architecture:** three short brand lines, one per act, then the sign-off.
1. *Architecture is the frame.*
2. *Light is the material.*
3. *Life is the reason.*
4. *Homes, composed.* Then the end card: VERANE RESIDENCES, *Private viewings by appointment*.

**Why it works for the Hunt St role:** it shows brand storytelling, lifestyle pacing, typography consistency and sound design, which are skills beyond a room-by-room walkthrough. It also shares Projects 1 and 2's type and colour system, so the three pieces read as one brand family.

## 2. Script and shot list (16:9 master)
| # | Time | Len | Act | Shot (Pexels ID, creator) | Speed | Transition in | Text | Sound |
|---|---|---|---|---|---|---|---|---|
| B01 | 0.0–4.8 | 4.8 | Architecture | Aerial, coastal residence at dusk (39024321, Alef Morais) | 100%, +3% push | Fade from black 1 s | VERANE / *Architecture is the frame.* | Ocean ambience, piano enters |
| B02 | 4.8–7.2 | 2.4 | Architecture | Contemporary home and terrace (36532059, LayG Traveller) | 50% (50 fps) | Dissolve 0.4 s | | Soft wind |
| B03 | 7.2–9.6 | 2.4 | Architecture | Facade with sun flare (7578541, Kindel Media) | 83% | Cut | | |
| B04 | 9.6–12.0 | 2.4 | Light | Light across open-plan living (7578546, Kindel Media) | 83%, +4% | Dip to black 0.6 s | VERANE / *Light is the material.* | Whoosh at 9.2 s |
| B05 | 12.0–14.4 | 2.4 | Light | Dining and chandelier (7578552, Kindel Media) | 83% | Cut | | |
| B06 | 14.4–16.8 | 2.4 | Light | Bathroom, frosted-glass light (7578551, Kindel Media) | 83% | Cut | | |
| B07 | 16.8–19.2 | 2.4 | Light | Brass spout macro (19228419, Curtis Adams) | 83%, +4% | Cut | | Running water |
| B08 | 19.2–21.6 | 2.4 | Life | Morning coffee (7394006, Max Vakhtbovych) | 50% (60 fps) | Dip to black 0.6 s | VERANE / *Life is the reason.* | Coffee pour; strings and percussion build |
| B09 | 21.6–24.0 | 2.4 | Life | Reading by the window (4778794, cottonbro studio) | 100%, +3% | Cut | | Page turn |
| B10 | 24.0–25.2 | 1.2 | Life | Wine pour close-up (8764576, Pavel Danilyuk) | 100% | Cut on half-bar | | Wine pour |
| B11 | 25.2–27.6 | 2.4 | Life | Dinner served by candlelight (6289666, cottonbro studio) | 100% | Cut | | Room tone, cutlery |
| B12 | 27.6–31.2 | 3.6 | Life | Friends raising a glass (8922354, Ron Lach) | 100% | Cut | | Glass clink at 28.6 s, music peak |
| B13 | 31.2–33.6 | 2.4 | Brand | Pool and palm view (39576513, Alef Morais) | 100%, +3% | Dissolve 0.6 s | *Homes, composed.* | Music opens out |
| B14 | 33.6–36.0 | 2.4 | Brand | Waterfront aerial (36868096, David Pickup) | 50% (60 fps) | Cut | | |
| B15 | 36.0–40.8 | 4.8 | Outro | Blurred waterfront behind the end card | 50% | Dissolve 0.8 s | VERANE RESIDENCES, *Private viewings by appointment*, credit, disclaimer | Low boom, final piano chord, 1.2 s fade |

**Vertical cutdown:** same shots and timing. Each act shows one large word (*Architecture* / *Light* / *Life*) with the full line as a small tracked label above it, then a two-line *Homes, / composed.* and a stacked end card inside the Instagram safe zone.

## 3. Music and sound design
- **Track:** cinematic neo-classical at about 100 BPM: solo piano for acts 1–2, strings and light percussion entering at the "Life" act (19.2 s), the widest point at 28–34 s, and a resolve on the end card. Search for "elegant cinematic piano strings 100 bpm", "luxury brand film score" or "inspiring minimal piano". Licensed sources: CapCut commercial-use library, Pixabay Music, YouTube Audio Library, Artlist or Epidemic Sound. Save it as `music/P3_music.*` with the licence.
- **Sound design (`sfx/`):** `ocean_ambience` 0.0 s (-24 dB), `wind_soft` 4.8 s, `whoosh_soft` 9.2 s and 18.8 s (-22 dB), `water_tap` 16.8 s, `coffee_pour` 19.3 s, `page_turn` 22.4 s, `wine_pour` 24.0 s, `glass_clink` 28.6 s (-16 dB), `low_boom` 36.0 s (-14 dB). Keep the effects felt rather than heard, sitting 6–10 dB under the music. CapCut's sound library or freesound.org (CC0) covers all of these.

## 4. Grade
"Coastal warm": contrast +7%, saturation -12%, warm highlights and slightly cool shadows, and a soft vignette. Mixed sources need **matching first**: bring the cottonbro and Ron Lach interiors (warm, tungsten) and the Alef Morais aerials (teal, dusk) toward neutral whites before applying the look. In CapCut, set *Adjust → White balance* per clip, then apply the shared preset. In the build script, add per-clip grades with `luts/P3_look.cube`.

## 5. Finishing in CapCut
1. Create a 16:9, 25 fps project. Place music first and mark bars every 2.4 s (every 4th beat marker).
2. Lay B01–B15 as per the table. Use *Speed 0.5x* on the 50/60 fps clips (B02, B08, B14, B15).
3. Transitions: *Mix* 0.4–0.8 s at act changes within a mood, and *Black fade* 0.6 s between acts.
4. Titles: import `titles/T1–T5.png` (they include their own soft shadow band) with *Fade up* in 0.35 s and *Fade out* 0.2 s, or rebuild them in Playfair Display Italic and Montserrat and save as a template shared with Projects 1–2.
5. End card: duplicate B14, apply *Blur* (strong) and *Brightness* -20, then add T5 on top.
6. For the vertical version, set the canvas to 9:16, duplicate the timeline, and reposition each clip (keyframe X if needed). Use the vertical title PNGs from `--config shotlist_9x16.json`.
7. Export 1080p 25 fps, then run the QC checks (duration 40.8 s, loudness, no black frames except the planned dips).

## 6. Rebuilding
```powershell
node make_configs.mjs
```
```powershell
node build.mjs
```
```powershell
node build.mjs --config shotlist_9x16.json
```
Edit `make_configs.mjs` to change shots, timing or copy. It regenerates both orientation files.
