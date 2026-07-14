# Takumi Auto Detailing — scroll-world build handoff

A scroll-scrubbed "fly through the world" landing page (scroll-world skill) for **Takumi
Auto Detailing** — a mobile auto-detailing brand. Japanese-inspired, clean minimal luxury,
black & white.

The page (`index.html`) and the scrub engine (`scrub-engine.js`) are **done and fully
wired**. What's missing is the generated media. This session couldn't finish it because of
a network blocker (below); pick this up in a session that can reach the Higgsfield CDN.

## Why this stopped

Generation via the Higgsfield MCP works, but the generated files live on
`d8j0ntlcm91z4.cloudfront.net`, and **this environment's egress policy blocks that host**
(proxy returns 403 on every download). The pipeline needs the raw bytes locally to extract
seam frames, encode for scrubbing, make mobile encodes, and commit self-hosted assets.
End-user browsers can reach those URLs fine — only the build container is blocked.

**To resume:** run in a Claude Code web session whose environment network policy allows the
Higgsfield CDN (or "all traffic"). See https://code.claude.com/docs/en/claude-code-on-the-web.

## Decisions already locked (with the user)

- **Art direction:** realistic cinematic → **architecture A** (one continuous forward take,
  no connectors). Reuse the *style preamble* below verbatim in every prompt.
- **Mobile:** desktop **+ mobile (beta)** → produce `-m.mp4` encodes and wire `clipMobile`.
- **Palette / theme (already in `index.html`):** ink `#0A0A0A`, paper `#F5F3EF`,
  mist grey `#8A8A8A`, platinum accent `#E8E4DB`. Dark, monochrome.
- **Video model:** `seedance_2_0_mini` (720p, ~12.5 cr/5s, frame-locks seams — good realism
  on a starter budget). Fallback for NSFW false-positives: `kling3_0` (~7.5 cr/5s) with the
  same start frame. **Do not mix models mid-chain** except for a single stubborn leg.
- **Sections & copy:** final, already written into `index.html` (arrival, wash, correction,
  interior, protection, reveal). Don't re-derive — just generate media to match.

## Credit budget (starter plan; check `balance` first)

- Stills: **already generated** (6 × 7 cr ≈ 42 cr spent — reuse them, see URLs below).
- Chain: 6 legs × ~12.5 cr = ~75 cr + re-rolls. Total remaining ≈ 90–130 cr. Rate limit:
  **max 4 concurrent jobs**; the chain is sequential anyway.

## The 6 scene stills (ALREADY GENERATED — download, don't regenerate)

2688×1520 PNG, `gpt_image_2`, monochrome. Order = section order.

| # | id | url |
|---|----|-----|
| arrival | be97ae17 | https://d8j0ntlcm91z4.cloudfront.net/user_3EEp6ZtlEuocGgQChoORTTgz9x8/hf_20260714_052620_be97ae17-6d98-47c7-9c76-b52c35a3a1eb.png |
| wash | b2545378 | https://d8j0ntlcm91z4.cloudfront.net/user_3EEp6ZtlEuocGgQChoORTTgz9x8/hf_20260714_052635_b2545378-4cb7-4180-ba67-32ffb1656fdb.png |
| correction | 9cd60337 | https://d8j0ntlcm91z4.cloudfront.net/user_3EEp6ZtlEuocGgQChoORTTgz9x8/hf_20260714_052638_9cd60337-aa0f-4af7-a3ef-f3194467f55b.png |
| interior | 8d8027fb | https://d8j0ntlcm91z4.cloudfront.net/user_3EEp6ZtlEuocGgQChoORTTgz9x8/hf_20260714_052641_8d8027fb-dcee-4f82-8cca-032a96ae08c5.png |
| protection | 05cd01b0 | https://d8j0ntlcm91z4.cloudfront.net/user_3EEp6ZtlEuocGgQChoORTTgz9x8/hf_20260714_052914_05cd01b0-6e47-4821-8f0d-583c227a4ecd.png |
| reveal | 159d5e3a | https://d8j0ntlcm91z4.cloudfront.net/user_3EEp6ZtlEuocGgQChoORTTgz9x8/hf_20260714_052917_159d5e3a-2fef-4551-a83d-10c2c118a06f.png |

Review them for cohesion first; re-roll any off-style one (they should read as one B&W world).

## Style preamble (reuse verbatim, then append the per-leg subject)

> Ultra-photorealistic cinematic photograph, moody high-end black-and-white monochrome film
> look. Clean minimal luxury with subtle Japanese design influence: raw concrete, warm wood,
> soft shoji-screen light, smooth stone, raked gravel. Dramatic soft directional lighting,
> deep blacks and controlled highlights, shallow depth of field, fine cinematic grain,
> editorial magazine quality. The recurring hero is a single flawless dark luxury car.
> No people, no text, no letters, no logos, no captions.

## Remaining steps (scroll-world SKILL, architecture A)

Tooling note: no `higgsfield` CLI here — drive it via the **higgs MCP** (`generate_video`,
`media_upload` + `media_confirm`, `job_display`). `ffmpeg` isn't preinstalled; use the
imageio static build: `python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`
then symlink to `/usr/local/bin/ffmpeg` (no `ffprobe` — use ffmpeg for frame extraction).

1. **Download the 6 stills** to `sw-work/still_<name>.png`; convert to `assets/<name>.webp`
   (posters / reduced-motion fallbacks).
2. **Render the chain (sequential, arch A)** on `seedance_2_0_mini`, 16:9, `--mode std`,
   `--resolution 720p`, `--duration 5`:
   - Leg 0 (`arrival`): `start_image` = arrival still (pass the image **job_id** as the
     `medias` value, role `start_image` — or upload the PNG via `media_upload`).
   - Legs 1–5: `start_image` = the **previous leg's actual last frame**
     (`ffmpeg -sseof -0.4 -i leg_prev.mp4 -frames:v 1 last.png`), uploaded via `media_upload`
     → `media_confirm` → use the returned media_id. **No end_image** (an end-image forces a
     pull-back = stutter). Prompt = style preamble + "Continue the same slow, steady forward
     glide … into [scene] toward [focal point] … In the final second settle back into a slow
     steady forward glide toward [next scene]." Mid-leg moves per prompts.md
     (wash: low lateral track; correction/protection: push-in + ease back; reveal: slow
     half-orbit around the finished car).
   - **Eyeball each leg's last frame before chaining** — it must look like a calm forward
     glide. Re-roll if not (a bad handoff frame poisons every later leg). Interiors trip the
     NSFW filter; re-roll or fall back to `kling3_0` with the same start frame.
3. **Encode** (native 720p, crf 20, `-g 8`, unsharp, faststart) → `assets/vid/<name>.mp4`,
   and **mobile** (720p, `-g 4`, crf 23) → `assets/vid/<name>-m.mp4`. Scripts: pipeline.md §5–6.
4. **Posters:** extract each leg's first frame → `assets/<name>.webp` (matches the video better
   than the standalone still for legs 1–5).
5. **Wire:** `index.html` already points at `assets/<name>.webp`, `assets/vid/<name>.mp4`,
   `assets/vid/<name>-m.mp4`, with `connectors: []` and `crossfade: 0.08`. Just drop the files
   in — no config edits needed unless a filename changes.
6. **QA** headless (Chromium/Playwright is preinstalled): screenshot just before/after each
   seam (should be near-identical), confirm `video.seekable.end(0) > 0`, check a phone
   viewport (posters show, `-m.mp4` served, no layout jump), and reduced-motion (stills only).
7. **Deploy** (optional): the `deploy-to-vercel` skill is installed in this repo.

## Reference material

Full skill + prompt templates + copy-paste pipeline scripts:
`~/.claude/skills/scroll-world/` (also vendored at `.claude/skills/scroll-world/` in this repo):
`SKILL.md`, `references/prompts.md`, `references/pipeline.md`, `references/scrub-engine.js`.
