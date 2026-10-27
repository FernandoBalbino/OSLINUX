# Prototype Instructions

## OSLINUX visual contract

- The user's Ubuntu screenshots are the visual source of truth. Keep Portuguese labels and the original Yaru icons, Ubuntu fonts, wallpaper and cursor assets.
- Use the original Yaru cursors at 32 px: left_ptr hotspot 5 5, hand2 hotspot 10 6, xterm hotspot 14 15.
- The top panel and dock use #131313, as verified against meuLinux on 2026-10-26.
- Folder labels must wrap fully and remain readable when windows shrink; never crop the second line.
- Target PC and Chromebook at 1366x768, plus the supplied reference resolutions. Keep app state shared and all runtime assets local.
- The beginner trail has exactly 20 sequential missions, the original OSLab robot, event/state validation, and a three-option review with explained red/green feedback. Do not replace practice with direct completion buttons.
- The /slide presentation follows Aula-TCP-UDP, introduces Linux and Ubuntu with Windows comparisons, and ends by highlighting the exact trail icon. The five added missions cover Wi-Fi, brightness, a sum, App Center and a simulated Chrome .deb download.
- System context menus must replace the browser menu inside the desktop. Preserve smooth transitions and reduced-motion support.
- Before every normal simulator session, show an Ubuntu GDM-style greeter with the single Aluno profile, no password field, and only an Entrar action. Request browser fullscreen directly in that click. Keep /slide independent; its final link goes through login before opening the trail. Deterministic desktop QA scenes may bypass login; ?qa=login captures it.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

- Missions 16–20 use Calendar, Clocks, Characters, Images and Help from the existing app grid, with real interactive tasks and sequential event validation. Preserve all first 15 missions and saved learner progress.
- Add image-led Windows 11/Ubuntu desktop comparisons to /slide, preserving the original slides and using clear arrows that point to the Ubuntu app dock and app-grid button.
