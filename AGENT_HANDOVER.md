# Josh Gier portfolio: agent handover

## Start here

Josh wants the current portfolio put into his GitHub account so he can update it, and connected to **josh-gier.com**. He has paused design changes. Complete the repository and domain setup using the existing site. Do not restart the design or make additional standalone HTML mock-ups.

The accompanying `Josh_Gier_Portfolio_Complete_v6.zip` contains the complete current site source and all 122 Git-tracked files. This is a working website, not a design brief. The production entry point is **`dist/index.html`**.

The source snapshot is byte-for-byte from commit:

`2f2fe5af98fa0a6d8635a1b025b8f505a83ed93d`

The ZIP contains a source snapshot, not a `.git` directory or full Git history. It includes development configuration, asset provenance, licenses, review notes and DNS instructions. `SOURCE_MANIFEST.json` records the original source file sizes and SHA-256 hashes. `HANDOVER_PACKAGE.json` records the packaging and audio-backup status. No account credentials are included.

## Verified state at handover

| Item | State |
| --- | --- |
| Current design | Published version 6; Josh asked to leave the design as it is for now |
| Hosted Site | https://josh-gier-after-hours.joshuagier.chatgpt.site |
| Current audience | Owner-only review access; public launch has not been enabled |
| GitHub account | `Josh-Gi3r` |
| GitHub repository for this site | Not created by this agent; no GitHub remote configured in the checkout |
| Proposed repository | `Josh-Gi3r/josh-gier-portfolio`, private initially |
| Custom domain | `josh-gier.com` is attached to the hosting project |
| DNS changes | Not performed by this agent |
| Domain validation | `pending`; provider `pending`; SSL `pending_validation` |
| Last domain refresh | 2026-09-06T22:06:18.703695+00:00 |
| Automatic GitHub deployment | Not configured |

The previous environment could edit existing GitHub repositories but could not create one, and had no usable DNS-management connection. These were capability limits of that environment, not a request for Josh to do the technical work himself. Check your own available capabilities before assuming the same limitations.

Josh has asked for the upload, domain configuration and launch work to be handled for him. Preserve that intent while following your own account access and approval rules. Ask only for an account login or missing access that is actually necessary after completing the available preparation.

## Site and source identifiers

Preserve these exact identifiers if continuing with Sites:

| Identifier | Value |
| --- | --- |
| Site project | `appgprj_6a9d8815a2d4819183adbcff0d0d8866` |
| Domain binding | `appgdom_6a9dcf36dcf08191993fd2b056767ba4` |
| Published version | `appgprj_6a9d8815a2d4819183adbcff0d0d8866~appgver_f75c22a44e588191a51ce6affedfa404` |
| Successful v6 deployment | `appgdep_6a9de20c1a888191990adce8d4c43938` |
| Source branch | `main` |
| Original local checkout | `/workspace/sites/josh-gier-bedroom` |

Existing Sites source Git endpoint:

`https://git.chatgpt-team.site/d536f545-4920-4c2f-8acd-4c05bc6b75b9/appgprj_6a9d8815a2d4819183adbcff0d0d8866.git`

This endpoint is not Josh's GitHub and is not the website URL. It requires a fresh authorized Sites source credential. Its history remains available there if your environment can access it. Do not copy authentication tokens into the new repository, handover or remote URL.

The existing `.openai/hosting.json` selects this project and `dist` as the static directory. **Do not create a second Site.** Use native Sites tools and the applicable hosting skill when operating in an environment that provides them.

## Run the site locally

This is plain HTML, CSS and browser JavaScript. `dist/` is the authored source and deployed site; it is not disposable build output. No application backend, Railway service or database is required to run this portfolio. The showcased products' full codebases and databases are separate projects and are not part of this ZIP.

Unzip, open a terminal inside `josh-gier-portfolio`, and use:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173/`. Serve it from the domain root: assets use paths such as `/assets/bedroom.webp`. Opening the HTML using a `file://` URL or deploying it under an arbitrary subdirectory will not provide a reliable equivalent.

For the existing Vite development workflow:

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

Use a Node version supported by the locked Vite dependency. Vite is only a development dependency. There is no `npm run build` script and no production build step is required for the current static site. The optional `/__review` development route is a viewport-review helper, not a production page.

## Put the complete site into GitHub

1. Verify the authenticated account is Josh's `Josh-Gi3r` account. Check whether `josh-gier-portfolio` has already been created since this handover.
2. Create that repository privately if absent and your available authenticated tool supports creation. If it already contains work, inspect it first; do not overwrite it or force-push unrelated history.
3. If authorized Sites source access is available, cloning the existing Sites repository preserves the original history. Otherwise initialize a new repository from the complete ZIP snapshot and identify the original v6 SHA in the initial commit description.
4. Include `dist/`, every asset, the lockfile, development files, provenance, licenses, review documentation, DNS documentation and this handover. Keep `node_modules`, local credentials and secret files excluded. The supplied `.gitignore` already excludes `node_modules/` and `.vite/`.
5. Push to `main`, configure the GitHub remote and verify representative files and large binary assets are present. Return the actual repository URL to Josh.
6. Document how an edit reaches production. A GitHub push does **not** currently trigger a Sites deployment. Do not describe automatic deployment as working until an actual authenticated workflow has been configured and verified.

Example, only in an authenticated GitHub CLI environment, after checking the repository does not exist and from the extracted project root:

```bash
git init -b main
git add .
git commit -m "Import Josh Gier portfolio from published v6 snapshot"
gh repo create Josh-Gi3r/josh-gier-portfolio --private --source=. --remote=origin --push
```

If retaining Sites, source edits should be synced through its source/version/deployment process. Reuse the current saved version for an unchanged deployment. For changed source, push the exact source state, save the matching version and deploy to the intended audience. Do not store a short-lived source credential as a permanent GitHub deployment secret.

## Connect josh-gier.com

Keep the existing Sites hosting unless Josh explicitly chooses a migration. A second hosting service is not needed simply to attach the domain.

1. Inspect the domain's authoritative nameservers and DNS records using your connected provider or other permitted tools. The registrar and authoritative DNS provider may differ; neither Cloudflare nor Namecheap was verified as the authoritative DNS provider in the previous environment.
2. Inspect current apex website records before changing routing. Preserve mail, verification and unrelated records. Resolve conflicting apex web routing deliberately; do not change nameservers blindly.
3. Refresh the existing Sites domain binding and use its current returned records. At the last successful check, they were:

| Type | Relative name | Value |
| --- | --- | --- |
| A | `@` | `162.159.143.30` |
| A | `@` | `172.66.3.26` |
| TXT | `_openai-site-verification` | `openai-site-verification=1_q4mPZ0uDGHP03JdLtCQuV4Sqz6NRzJ74HC1LfqP7E` |
| TXT | `_cf-custom-hostname` | `e67cad15-5dc6-4847-8592-3bbc112e460b` |

The TXT fully qualified names are `_openai-site-verification.josh-gier.com` and `_cf-custom-hostname.josh-gier.com`. Avoid accidentally appending the domain twice in a provider UI. The included `josh-gier.com.dns` contains the records in zone-file format; do not use an import mode that replaces unrelated zone records.

The hosting provider returned `custom-domains.chatgpt.site.` for subdomain CNAME routing. The existing binding is for the apex, so its returned A targets above are the applicable records. A `www` binding or redirect has not been configured; do not claim it works without setting it up separately.

4. Refresh **the existing domain binding** through Sites and check for any newly returned certificate-validation records. Follow them if supplied. Confirm routing is active and the certificate is valid for `josh-gier.com`.
5. Enable the intended public portfolio audience through the hosting access controls as part of final launch. The current owner-only access means domain attachment alone is not a public launch.
6. Verify `https://josh-gier.com` from a signed-out session using your environment's permitted verification tools. Confirm there is no login wall, the certificate is valid and representative assets and navigation work.
7. Report the actual URL and verification result. If DNS editing or certificate validation remains blocked, identify the exact outstanding operation. Do not say it is merely propagating unless the records were actually applied.

## Editing map

| File or directory | Purpose |
| --- | --- |
| `dist/index.html` | Production room entry point, navigation, hotspots and audio elements |
| `dist/app.js` | Main rendering, routing and interactions |
| `dist/style.css` | Base layout and room styling |
| `dist/room-atmosphere.css` | Circular invitations, screen glitches, board illumination and atmosphere controls |
| `dist/screens.js`, `dist/screens.css` | Screen geometry and device framing; preserve the projective fitting |
| `dist/mac-desktop.js`, `dist/mac-desktop.css` | Finder-style product browser, icons, purpose labels and hover/touch descriptions |
| `dist/data.js`, `dist/catalog.js` | Base records and expanded campaign/product catalog |
| `dist/product-details.js`, `dist/open-source.js` | Product explanations, open-source cases and source links |
| `dist/showcases.js`, `dist/showcase.css`, `dist/editorial.js` | Case-study and product-preview presentation |
| `dist/sound.js` | Shared opt-in music/rain playback and audio state |
| `dist/cv.html` | Printable selected-experience CV |
| `dist/assets/` | Local production images, logos, video, font and font license |
| `asset-provenance.json`, `AUDIO_CREDITS.md` | Asset sources and attribution |
| `screen-geometry.test.js` | Existing screen-fitting regression test |

`dist/room-study.html`, `room-study-portable.html`, their supporting files and `review/room-circles/` are **earlier isolated review studies** retained in source. They are not the accepted production entry point. Do not switch the site to them or send Josh more separate mock-up HTML files.

## Preserve the agreed design and portfolio scope

- The experience is a 1990s university technology student's bedroom: gaming and film interests, image-based 2.5D depth, integrated screens and zoom transitions. It is not a replacement Three.js room.
- The TV opens campaigns; the computer opens products, software and open source; the corkboard opens experience/About and the CV. Preserve the direct work index and accessible navigation.
- Keep circular hotspot markers, TV and computer tracking glitches, and illumination fitted to the **entire photographed corkboard**. They have different timings. Do not bring back oversized italic "Click me" labels, floating modern cards or a rectangular glow unrelated to the photographed board.
- The TV has its small in-screen standby message and a Tiger preview on hover. The computer uses compact classic Mac Finder styling and the bundled bitmap font.
- Keep product purpose labels and helpful descriptions; keep desktop hover, touch and keyboard behavior coherent. Preserve responsive screen fitting.
- Keep opt-in music and quiet rain under one shared Sound control; keep the separate motion setting and reduced-motion handling.
- This is Josh's broad marketing, product and commercial portfolio. Neither Revolut nor Coliseum should become the anchor. Coliseum is one product/GTM example with the supplied 4M members and 200K active-user results; the acquihire and fundraising explanation does not lead the site.
- Preserve campaign responsibilities, platforms, commercial outcomes, product explanations and open-source work. Do not promote modelled budgets or draft performance figures to reported results. Preserve supplied-versus-reconstructed visual attribution and licenses.
- Josh has explicitly paused design changes. Repository and deployment work must not become an unsolicited redesign or copy rewrite.

## Audio and portability

All production images, the room video and fonts are in the source snapshot. The published `dist/index.html` references two externally hosted MP3s: music and window rain. Their URLs, credits, licenses and modifications are documented in `AUDIO_CREDITS.md`.

Both exact processed MP3 files have also been downloaded successfully and are included under `media-backup/`: `night-owl.mp3` and `window-rain.mp3`. `HANDOVER_PACKAGE.json` records their sizes and hashes. The original 122 source files retain their exact published contents; audio URLs have not been silently rewritten.

To make the site independent of that audio host, copy the backup files to `dist/assets/audio/` and change only the two audio `src` attributes in `dist/index.html` to `/assets/audio/night-owl.mp3` and `/assets/audio/window-rain.mp3`. Preserve the credits, levels and opt-in behavior, and verify playback afterwards. This is an optional portability change, not a prerequisite to viewing the current site.

The archive contains the portfolio's code and media, not the full source code or databases of every product it showcases. Its source links point to those separate repositories. Original uploaded research documents are summarized in the site's content and provenance; they are not silently represented as included in this package.

## Verification and completion

Prior v6 verification covered the actual room, TV hover, board alignment, keyboard navigation into campaigns/products, local asset references and the screen-geometry test. Previous reviews also exercised broader work routes and responsive layouts. These checks are documented in the included review files. They do not establish that every external product service is live or that the custom domain is working.

For the handover/import, verify file hashes and ZIP integrity. For deployment, check:

- The room loads with its image/video, font, three destinations and expected effects.
- TV and computer contents fit the photographed screens at desktop and narrow viewport sizes.
- Campaign switching, product details, open-source entries, Back/Escape and hash navigation still work.
- CV and contact links work; local media returns successfully.
- Sound enables/disables both tracks; motion preferences remain respected.
- GitHub contains the full source and assets, with documented update/deployment steps.
- The domain has valid HTTPS and the final public site loads for a signed-out visitor.

Existing local checks:

```bash
node --check dist/app.js
node --check dist/data.js
node --test screen-geometry.test.js
```

Finish by giving Josh the actual GitHub URL, the public portfolio URL, a short explanation of how he makes future updates, and any remaining issue supported by a concrete check.
