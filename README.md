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

- `src/app/` – routes (`/`, `/resume`, `/travel`, 404)
- `src/components/` – UI, companions, and the globe
- `src/lib/site-data.ts` – contact links, resumes, work, research
- `src/lib/travel-data.ts` – cities and routes shown on the globe
- `public/assets/` – images and decorations
