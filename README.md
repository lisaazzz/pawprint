# PawPrint

PawPrint is a mobile-first Next.js web app that helps dog owners discover a TCVM-inspired element, Yin-Yang energy tendency, personality archetype, ideal food profile, and matching Holistic PawFood recipes.

This is an educational wellness assessment, not a diagnostic veterinary tool.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Framer Motion
- Lucide Icons
- Local browser storage

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Vercel Deployment

1. Push this project to a Git repository.
2. Import the repository into Vercel.
3. Keep the default framework preset as Next.js.
4. Use the default install command:

```bash
npm install
```

5. Use the default build command:

```bash
npm run build
```

6. Deploy.

No environment variables or authentication providers are required.

## App Structure

- `app/page.tsx` contains the quiz flow, homepage, and results interface.
- `lib/scoring.ts` contains the TCVM-inspired scoring and recommendation engine.
- `lib/quiz-data.ts` contains traits, wellness options, recipe data, and base recommendations.
- `lib/types.ts` contains shared TypeScript types.
- `components/ui` contains lightweight shadcn/ui-style primitives.

## Notes

Uploaded photos are stored only in the browser as local quiz progress. PawPrint does not perform image analysis.

Disclaimer used throughout the app:

> This assessment is inspired by Traditional Chinese Veterinary Medicine (TCVM) constitutional theory and is intended for educational purposes only. It is not a veterinary diagnosis.
