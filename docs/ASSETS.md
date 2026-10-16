# Asset provenance

The three mockups were supplied by the project owner on 2026-10-16:

- `references/desktop.png` — desktop composition and materials
- `references/tablet.png` — tablet menu and grid adaptation
- `references/mobile.png` — mobile rails, timeline, menu, sticky CTA

These references are excluded from the deployed website. Their illustrated
partner logos and outcome numbers are not evidence of actual relationships/results.

## Owner-supplied SUT ecosystem logo (2026-10-16)

The owner supplied `codex-clipboard-52c87913-326a-4775-a714-390ebbdd5101.png`
and requested it first, before Chula. The original transparent PNG is 1211 × 946,
55,420 bytes, SHA-256
`f7100e3cd3859dabfdca02f3ce22d949359a0dda3a1042bf3f667597d793a70c`.
It was uploaded unchanged through authenticated CMS to `cms-media`, saved/reopened
and published as revision 6. The record is named Suranaree University of Technology,
uses a dark surface, and links to <https://www.sut.ac.th/>. Public read-back confirms
it precedes Chula and the prior seven records/other content are unchanged.
The logo and ordering remain CMS-owned; no seed or component embeds this record.

## Owner-supplied hero animation

On 2026-10-16 the owner supplied `DeepX_Hero_AI_4K.mp4` from
`Downloads/DeepX_Animated_Images/DeepX_Hero_AI_4K/`. The original is 3840 × 2160,
10 seconds, 24 fps / 240 frames, H.264, 13,780,074 bytes, with no audio stream.
It animates the DeepX wordmark and neural X; this is an owner-supplied visual,
not a generated or sourced replacement.

| Prepared file | Dimensions | Size | Encoding / use |
| --- | --- | --- | --- |
| `public/videos/deepx-hero.mp4` | 1920 × 1080 | 2,633,405 bytes | H.264 High level 4.1, 10 seconds / 24 fps |
| `public/videos/deepx-hero-mobile.mp4` | 960 × 540 | 927,714 bytes | Optional smaller rendition, H.264 High level 3.1, same duration and frames |
| `public/images/deepx-hero-poster.webp` | 1920 × 1080 | 42,230 bytes | Exact opening frame; WebP quality 85 / method 6 |

Both MP4s preserve the complete 16:9 composition, timeline and frame rate. They
use Lanczos scaling, x264 slow / CRF 24 / four reference frames, `yuv420p`, and
faststart (`moov` before `mdat`), with no audio or carried source metadata. No
crop, recoloring, retiming, text alteration or generative editing was performed.
The 1080p rendition is about 81% smaller than the source; the mobile rendition
is about 93% smaller. Keep the embedded wordmark visible when positioning it.

Full decode, 240-frame count, 10-second duration, no-audio streams and faststart
were verified for both outputs. Source frames at 0, 3, 6 and 9 seconds, encoded
frames at 3 and 9 seconds, and the poster were visually inspected. Source/output
SHA-256 hashes, encoding and byte sizes are in ignored
`artifacts/hero-video-manifest.json`; review frames are in
`artifacts/hero-video-review/`. These are file-level checks; actual webpage
playback, responsive placement and reduced-motion behavior need separate runtime
verification. Prepared files do not by themselves establish CMS publication.

## Owner-supplied industry replacements

On 2026-10-16 the owner supplied four replacement PNG images for the industry
cards. These are the supplied Thai-context visuals; their origin is the owner's
chat attachments, not the stock-photo sources listed below. No claim is made
that the pictured factory, port, people or institution are DeepX clients.

| New file | Original attachment filename | Optimized output |
| --- | --- | --- |
| `public/images/industries/manufacturing-thailand.webp` | `codex-clipboard-66f393b1-b0b6-4db4-8ce1-697a98805a96.png` | 1200 × 900; 181,086 bytes |
| `public/images/industries/logistics-thailand.webp` | `codex-clipboard-24a699f2-2ffd-42d3-977c-3a7697dc6671.png` | 1200 × 900; 195,332 bytes |
| `public/images/industries/agriculture-thailand.webp` | `codex-clipboard-30d01dbc-0983-4aec-aece-27e15886e9e5.png` | 1200 × 900; 219,282 bytes |
| `public/images/industries/research-thailand.webp` | `codex-clipboard-57ed53ff-192e-4de8-a8e1-c89261ccfc23.png` | 1200 × 900; 167,094 bytes |

Each source is 1448 × 1086 RGB. Processing only resized the full 4:3 frame to
1200 × 900 with Lanczos and encoded WebP at quality 85 / method 6. No crop,
recoloring, generative edit, text removal or composition change was performed.
Together the files are 762,794 bytes versus 10,091,221 source bytes (about 92%
smaller). All four outputs decode successfully. Source paths, dimensions, byte
sizes and output SHA-256 hashes are in ignored `artifacts/industry-image-manifest.json`.

These fresh local paths preserve the earlier files and migrations. The CMS
`industries` record selects these bundled paths, both-language alt text and focal
points; publication revision 5 and production rendering were verified. Future
uploads through the CMS create separate immutable Storage URLs, which editors
can select without changing the renderer. See [RELEASE.md](RELEASE.md) for evidence.

## Initial bootstrap media (retained)

| File | Source and license | Use / crop |
| --- | --- | --- |
| `public/images/manufacturing.jpg` | Simon Kadula, [Unsplash](https://unsplash.com/photos/a-factory-filled-with-lots-of-orange-machines-8gr6bObQLOI), [Unsplash License](https://unsplash.com/license) | Automotive industrial robots; center 50% 45% |
| `public/images/logistics.jpg` | [Pexels: Traffic on a Highway](https://www.pexels.com/photo/traffic-on-a-highway-7204179/), [Pexels License](https://www.pexels.com/license/) | Freight trucks; center 49% 52% |
| `public/images/agriculture.jpg` | DRONE EFT, [Unsplash](https://unsplash.com/photos/drone-spraying-green-crop-field-nMDwrS1NsIE), [Unsplash License](https://unsplash.com/license) | Drone over crops; center 50% 43% |
| `public/images/research.jpg` | Elijah Mears, [Unsplash](https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-E94nZORR5qc), [Unsplash License](https://unsplash.com/license) | US Capitol as sector illustration, not a customer; center 50% 48% |

Images were downloaded as deployment assets (1000px wide) rather than left as
third-party hotlinks. Their paths, alt text and crop positions are stored in
the `industries` content record and can be changed through the CMS.
No image implies the pictured organization is a DeepX customer or partner.

## Brand and interface

- Neural X and favicon: original vector reconstruction of the supplied visual
  direction; not an official supplied logo master. Replace with an approved
  brand master if one is provided.
- Icons: Lucide, ISC license, through `lucide-react`.
- Manrope and Noto Sans Thai variable fonts: self-hosted Fontsource packages,
  SIL Open Font License. Browser loading requires no Google Fonts request.
- Initial hero network, glow and CTA globe: local SVG/CSS. The separately
  supplied hero video and exact-frame poster are documented above; no raster
  generation or WebGL was used to prepare them.

## Our Ecosystem logos

The owner explicitly requested the seven organizations shown in the supplied
mockups on 2026-10-16. These files come from official institutional/company
websites or the official CDN linked by those sites. They identify the requested
ecosystem; their presence is **not verification of a commercial partnership,
client relationship, endorsement or measured result**. Trademark ownership stays
with the respective organizations; official provenance is not a blanket logo-use
license. Keep any separate usage permissions with the project owner's records.

| Local file | Official source page | Exact asset source / treatment |
| --- | --- | --- |
| `public/images/ecosystem/chula.svg` | [CU brand resources](https://www.chula.ac.th/about/symbols/identity/) | [Official website secondary logo](https://www.chula.ac.th/wp-content/themes/phrakieo/assets/images/logo-secondary.svg); original pink SVG |
| `public/images/ecosystem/kmutt.svg` | [KMUTT corporate identity](https://www.kmutt.ac.th/corporate_identity/kmutt-logo/) | [Official site white vision mark](https://www.kmutt.ac.th/wp-content/themes/kmutt/inc/assets/img/icons/kmutt-logo.svg); original white SVG |
| `public/images/ecosystem/nstda.svg` | [NSTDA logo resource](https://www.nstda.or.th/home/nstda_post/nstda-logo/) | [Official white logo](https://www.nstda.or.th/home/wp-content/themes/nstda/assets/images/logo-white.svg); original white SVG |
| `public/images/ecosystem/nrct.png` | [NRCT official emblem](https://www.nrct.go.th/about/detail/227) | [Standalone NRCT emblem](https://www.nrct.go.th/ckeditor/upload/files/id28/emblem_brand_g_1.png); original 360 × 360 PNG including its white disc and green brand panel |
| `public/images/ecosystem/aws.png` | [AWS website](https://aws.amazon.com/) and [trademark guidelines](https://aws.amazon.com/trademark-guidelines/) | [Official CDN white logo at 2×](https://a0.awsstatic.com/libra-css/images/logos/aws_smile-header-desktop-en-white_59x35@2x.png); original 118 × 70 transparent PNG, intended to display at approximately 59 × 35 CSS pixels |
| `public/images/ecosystem/microsoft.png` | [Microsoft white-text logo resource](https://news.microsoft.com/fr-fr/microsoft-logo_rgb_c-wht/) | [Image linked by Microsoft News](https://msftstories.thesourcemediaassets.com/sites/113/2017/06/Microsoft-logo_rgb_c-wht-768x344.png); original transparent 768 × 344 PNG, colored symbol and white wordmark |
| `public/images/ecosystem/google-cloud.svg` | [Google Cloud](https://cloud.google.com/) | [Official footer logo](https://www.gstatic.com/cgc/google-cloud-logo-fullcolor.svg); original full-color SVG with dark wordmark, requiring a quiet light surface |

Files are copied unchanged: no redrawing, recoloring, CSS inversion, cropping or
distortion. Use `object-fit: contain` and preserve the built-in clear space. The
current official NRCT mark differs from the stylized blue/white mockup; use the
official asset rather than reconstructing that mockup mark. White variants for
KMUTT, NSTDA, AWS and Microsoft are supplied by the owners, not generated filters.
Chula uses its original pink. Google Cloud's dark wordmark must remain legible.

The initial seven CMS records were prepared in ignored
`artifacts/ecosystem-records.json`, in this order: Chula, KMUTT, NSTDA, NRCT, AWS,
Microsoft, Google Cloud. Migration `20261016090500_official_ecosystem.sql`
bootstraps them only when the initial workspace is unchanged, preserving the
distinction from an authenticated editor publication. The frontend reads stored
records, not a hardcoded list. Deployed asset checks remain separate from
source/download and migration verification.
