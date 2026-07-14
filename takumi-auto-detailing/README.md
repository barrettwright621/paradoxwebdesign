# Takumi Auto Detailing — scroll-world landing page

A scroll-scrubbed "fly through the world" landing page for **Takumi Auto Detailing**, a
mobile auto-detailing brand. As you scroll, the camera glides forward through six
cinematic black-and-white scenes — arrival → wash → paint correction → interior → ceramic
protection → the reveal — with a dark, Japanese-minimal luxury look (匠 = *master artisan*).

Built with the [scroll-world skill](../.claude/skills/scroll-world), architecture A
(continuous forward take). Scenes generated with Higgsfield.

## Run it

Static page — serve the folder and open `index.html`:

```bash
python3 -m http.server 8000   # then open http://localhost:8000/takumi-auto-detailing/
```

`index.html` + `scrub-engine.js` are the whole site. No build step.

## How this build works (and its trade-offs)

The scene clips are **hotlinked** from Higgsfield's public CloudFront CDN (the URLs are in
`index.html`). The engine runs in `directSrc` mode — it points `<video src>` straight at
those URLs instead of Blob-fetching them, so cross-origin clips play and scrub via the
CDN's HTTP range support without needing CORS headers.

This was done because the build environment's egress policy blocked the CDN, so the media
couldn't be downloaded, frame-extracted, and self-hosted. Consequences vs. the skill's
"full" build:

- **Transitions are cross-dissolves, not frame-locked seams.** Each scene is an independent
  clip; the engine cross-fades between them (`crossfade: 0.09`). Cinematic, but not the
  invisible-seam continuity of a frame-chained take.
- **No mobile-specific encodes.** Phones get the same clips (the engine still hardens phone
  scrubbing — seek-coalescing, iOS priming, safe-area CSS). Heavier on cellular.
- **Media lives on Higgsfield's CDN**, not in this repo. The URLs are unsigned/public and
  appear durable, but they are not under your control.

### Scene sources

| Scene | Video model | Notes |
|-------|-------------|-------|
| arrival, correction, protection | `seedance_2_0_mini` | 720p, image-to-video from the stills |
| wash, interior, reveal | `kling3_0` | re-rolled here after seedance's content filter false-flagged them |

Both are 720p, 5s, 16:9, seeded by the matching still. All six stills were made with
`gpt_image_2` (monochrome, one shared style preamble for cohesion).

## Upgrading to the full seamless, self-hosted build

In an environment that **can reach the Higgsfield CDN** (network policy = all traffic, or
the CDN host allowlisted), you can turn this into the skill's top-tier build:

1. Download the six clips + six stills (URLs are in `index.html`) into `assets/`.
2. Re-render as a **frame-chained** forward take: each leg's start image = the previous
   leg's actual last frame (`ffmpeg -sseof`), no end image — so seams are frame-identical.
   See `../.claude/skills/scroll-world/references/pipeline.md` (arch A).
3. Encode for scrubbing: desktop (`crf 20 -g 8 +faststart`) and mobile (`-m.mp4`, 720p
   `-g 4`).
4. Point the config at the local `assets/…` paths, drop `directSrc`, and add
   `clipMobile` + set `crossfade` back to ~0.08.

## Deploy

The `deploy-to-vercel` skill is installed in this repo (`../.agents/skills/deploy-to-vercel`).
It's a static folder, so any static host works.
