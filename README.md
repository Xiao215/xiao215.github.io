# xiao215.github.io

Personal website for Xiao Zhang, live at https://xiao215.github.io.

## Stack

- Next.js App Router (static export)
- TypeScript
- Tailwind CSS
- three.js for the travel globe

## Commands

```bash
npm run dev
npm run lint
npm run build
```

`npm run build` writes the static site to `out/`, which the GitHub Pages
workflow in `.github/workflows/nextjs.yml` deploys on every push to `main`.

## Layout

- `src/app/` – routes (`/`, `/resume`, `/travel`, `/sport`, 404)
- `src/components/` – UI, companions, the globe, and the slime playdate
- `src/lib/toy-physics.ts` – throwable-ball physics for the sport page
- `src/lib/piano-synth.ts` – Web Audio notes used by the sport page
- `src/lib/site-data.ts` – contact links, resumes, work, research
- `src/lib/travel-data.ts` – cities and routes shown on the globe
- `public/assets/` – images and decorations
