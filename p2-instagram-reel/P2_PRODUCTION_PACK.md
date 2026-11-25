# Project 2: Premium Property Instagram Reel. Production Pack

> **Self-initiated sample portfolio project** by Maria Zha-Zha C Bio. "Verane Residences" is a fictional brand. This is not commissioned client work. The footage is licensed Pexels stock (see `../p1-luxury-apartment/footage/LICENCES.txt`), shared with Project 1 so the brand reads as one property across both pieces.

| | |
|---|---|
| Runtime | **24.0 s** (12 bars at 120 BPM, beat = 0.5 s = 15 frames) |
| Format | 9:16, **1080×1920**, 30 fps, H.264 High 4.2 (≤ 12 Mbps), AAC 256 kbps 48 kHz |
| Loudness | -14 LUFS integrated, ≤ -1 dBTP |
| Status | Draft cut from real footage. Needs licensed music (and optional SFX) before `node build.mjs --final` |

> **Music (2026-11-23):** *Luxury Life* by Kulakovka (Pixabay Content License, see `music/LICENCE.txt`). It measured 123.0 BPM and plays 2.5% slower to sit on the 120 BPM cut grid. It starts at 15.9 s in the track, so the full beat is already running under the hook.

## 1. Creative brief
**Goal:** Stop the scroll in under 2 seconds, show the home's best moments to the beat, and finish with one clear action: *Book a private inspection, link in bio*.
**Audience:** Instagram users aged 28–55 browsing property and interiors. Most watch with the sound **off**, so every message is also written on screen.
**Tone:** Fast but never frantic. Hard cuts land on the beat. Motion comes from moving the crop across the frame and slow push-ins, not flashy effects. Only four motion transitions in 24 s.
**Hook (0–2 s):** First-person framing, *"POV: you just got the keys"*, over the brightest, deepest glide through the open-plan living area. The text rises in on frame 3 (0.1 s), so the hook is readable before most viewers decide to swipe.

## 2. Beat map and shot list
Bars are 2 s. ● = cut on a downbeat, ○ = cut on an off-beat (half-beat accents).

| # | Time | Len | Shot (source, in-point, 9:16 crop pan) | Transition in | On-screen text (motion) |
|---|---|---|---|---|---|
| R01 | 0.0–2.0 | 2.0 | Living glide (7578546 @8 s, crop 0.50→0.56, +6% push) | — | **HOOK:** POV / *you just got the keys* (rise) |
| R02 | 2.0–3.0 | 1.0 | Exterior facade (7578541 @2 s) | Smooth-up 0.2 s ● (whip feel) | VERANE / RESIDENCES (rise) |
| R03 | 3.0–4.0 | 1.0 | Kitchen island (7578540 @8 s, pan R→L) | Cut ● | |
| R04 | 4.0–4.5 | 0.5 | Sink detail (7578549 @12 s) | Cut ○ | |
| R05 | 4.5–5.0 | 0.5 | Bar island (7578549 @15.5 s) | Cut ○ | |
| R06 | 5.0–7.0 | 2.0 | Dining + chandelier (7578552 @2 s, pan, +4%) | Zoom-in 0.3 s ● | MADE FOR / *entertaining* |
| R07 | 7.0–8.0 | 1.0 | Lounge + marble table (7578554 @4 s) | Cut ● | |
| R08 | 8.0–10.0 | 2.0 | Master bedroom (7578550 @0 s, pan L, +4%) | Slide-left 0.3 s ● | *Wake up to this* |
| R09 | 10.0–11.0 | 1.0 | Ensuite reveal (7578550 @6.5 s) | Cut ● | |
| R10 | 11.0–12.0 | 1.0 | Bathroom wide (7578551 @8 s) | Cut ● | |
| R11 | 12.0–14.0 | 2.0 | Brass spout macro (19228419 @4 s, +5%) | Dissolve 0.2 s ● | IT IS ALL IN / *the details* |
| R12 | 14.0–15.0 | 1.0 | Window, palms (7578535 @5 s, pan) | Smooth-left 0.2 s ● | |
| R13 | 15.0–16.0 | 1.0 | Alfresco terrace (7578555 @4 s) | Cut ● | |
| R14 | 16.0–17.0 | 1.0 | Garden (7578536 @0 s) | Cut ● | |
| R15 | 17.0–19.0 | 2.0 | Exterior with sun flare (7578541 @14.5 s) | Cut ● | *Indoor-outdoor living* |
| R16 | 19.0–21.0 | 2.0 | Living lounge (7578546 @15 s, +5%) | Dissolve 0.3 s ● | 3 BED / 2 BATH / 2 CAR (stacked) |
| R17 | 21.0–24.0 | 3.0 | Blurred, darkened lounge (CTA background) | Dissolve 0.4 s ● | **CTA:** VERANE, *Book a private inspection*, LINK IN BIO, credit, sample disclaimer |

## 3. Design system (shared with Project 1)
- **Type:** Georgia Italic for emotive lines (100–110 px), Montserrat tracked caps for labels (42–62 px), Georgia tracked for the wordmark. CapCut equivalents: Playfair Display Italic + Montserrat.
- **Colour:** warm white `#F4EFE6` and champagne `#C8B48A`. Grade: contrast +8%, saturation -5%, warm highlights and cool shadows, light vignette.
- **Motion typography ("rise"):** each title slides up 60 px with a cubic ease-out over 0.35 s while fading in over 0.25 s, then fades out over 0.2 s just before the next cut.
- **Legibility:** a soft horizontal dark band (Gaussian scrim) sits behind the centre text, so titles read over bright windows without a hard box.
- **Safe zones:** all text sits between y = 680 and y = 1500 and away from the right-hand 140 px (where Instagram puts its like, comment and share icons). Draft renders show the safe area as a yellow outline, with the top and bottom UI zones darkened.

## 4. Music and sound direction
- **Track:** 118–122 BPM modern luxury: deep-house or chill-pop instrumental, warm sub bass, clean claps, no vocals in the first 2 s (so the hook text gets attention). Search for "luxury real estate reel 120 bpm", "minimal deep house instrumental", or "chic fashion beat". Licensed sources: CapCut commercial-use library, Pixabay Music, YouTube Audio Library, Artlist or Epidemic Sound. Save the licence next to `music/P2_music.*`.
- **Instagram tip:** if you post from a business account, only Instagram's own *commercial-use* sounds are cleared. If you add trending audio inside the app, upload the video **without** music baked in.
- **SFX (`sfx/`):** `whoosh_short.wav` at 1.9, 4.85, 7.85 and 13.9 s (just before each motion transition), `tap_water.wav` at 12.0 s, and `low_hit.wav` at 21.0 s under the CTA.

## 5. Caption and posting copy (sample)
> POV: you just got the keys to Verane. 🗝️
> Open-plan living, an entertainer's kitchen, a spa ensuite and a garden made for long lunches.
> Book a private inspection via the link in bio.
> .
> *Sample portfolio project. Fictional brand, edited by Maria Zha-Zha C Bio. Footage: Pexels (Kindel Media, Curtis Adams).*
> #luxuryrealestate #propertyvideo #realestatevideo #interiordesign #sydneyproperty #dreamhome #househunting #reels

- **Cover frame:** `drafts/P2_cover_frame.jpg` (1.2 s, hook text over the living room). For a cleaner grid tile, export a frame from 0.6 s instead.
- **On-screen text for CapCut auto-captions:** `exports/P2_onscreen_text.srt`.

## 6. Finishing in CapCut (desktop or mobile)
1. Start a new project with the **9:16** ratio at 30 fps. Import the clips from `../p1-luxury-apartment/footage/_src/` and the music.
2. Add the music first, then use *Beat → Auto-generate (Melody)* to place markers. Check that they're 0.5 s apart.
3. Place R01–R17 per the table and snap every cut to a marker. Trim R04 and R05 to half a beat each.
4. **Reframe:** each clip opens at full 16:9. Scale it to 133% to fill 9:16, then add Position keyframes from the "crop pan" start to end values (for example, slide slightly right on R01) for parallax-style motion. Add a 104–106% scale keyframe at the end for the push-ins.
5. **Transitions:** use *Whip/Swipe up* (0.2 s) into R02, *Zoom in* (0.3 s) into R06, *Slide left* (0.3 s) into R08, *Mix* (0.2 s) into R11, *Swipe left* (0.2 s) into R12, and *Mix* into R16 and R17. Everything else is a hard cut.
6. **Text:** use the PNGs in `titles/` as overlays with *In animation → Rise / Fade up* (0.35 s) and *Out → Fade out* (0.2 s), or rebuild them in CapCut text and save as a template.
7. **CTA card:** duplicate the R16 clip, add *Effects → Blur* (strong) and lower *Adjust → Brightness* to about -20. Keep the end card at least 2.5 s so viewers can act on it.
8. **Grade:** apply the Project 1 adjustment preset (or `P1_look.cube`) so both pieces match.
9. **Export:** 1080p, 30 fps, *Recommended* bitrate. In the preview, check that no text sits under the Instagram buttons.

## 7. QC checklist
Duration 24.0 s · 1080×1920 · 30 fps · 720 frames · hook text visible by 0.1 s · every cut on a 0.5 s beat · no text in the top 220 px, bottom 420 px or right 140 px · -14 LUFS / ≤ -1 dBTP · disclaimer on the CTA card.
