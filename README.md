# FaithCards 🕊️

A premium Christian Scripture-meditation app. Each day it serves up to **5
personalised Scripture cards** chosen by a deterministic (no-AI) recommendation
engine using your **mood**, **spiritual need**, **personality type**, reading
**history** and **favourites**.

Built with Expo SDK 54, Expo Router, TypeScript, NativeWind, React Query,
Zustand, React Hook Form + Zod, Reanimated, and Supabase.

---

## Features

- **Auth** — splash, intro carousel, register, login, forgot password, email verification (Supabase Auth).
- **Onboarding** — name, gender (optional), and a personality quiz that maps to one of five personas (Faith Builder, Peace Seeker, Wisdom Seeker, Purpose Seeker, Encouragement Seeker).
- **Home** — greeting, streak, cards remaining today, mood + need selectors, "Generate My Daily Cards".
- **Scripture cards** — Tinder-style swipe deck (Reanimated + Gesture Handler) with Listen (TTS), Favorite, Share, Reflect, and Next actions.
- **Reflection** — journal "What is God saying to you today?" per verse.
- **Favorites** — search, filter by theme, remove.
- **Journal** — list, search, edit and delete reflections.
- **Profile** — identity, persona, streak/stats, notification + dark-mode + reminder settings, logout.
- **Streak system** & **daily reminder** notification ("Your FaithCards are ready for today.").

## Project structure

```
app/                       # Expo Router routes
  _layout.tsx              # providers (Query, SafeArea, GestureHandler) + Stack
  index.tsx                # animated splash + auth-guard entry
  (auth)/                  # onboarding intro, login, register, forgot, verify
  (onboarding)/            # name / gender / personality quiz wizard
  (tabs)/                  # home, favorites, journal, profile
  cards.tsx                # swipe deck (full screen)
  reflection.tsx           # reflection modal
components/                # ScriptureCardView, CardStack, selectors, Logo, ui/*
hooks/                     # React Query hooks + useAuthRedirect guard
lib/                       # supabase, api, queryClient, notifications, speech, schemas, utils
stores/                    # Zustand: auth, onboarding, preferences, daily
constants/                 # theme, moods, needs, personality, quiz
types/                     # API/domain types (mirror openapi.yaml)
```

## Backend

The API contract lives in [`openapi.yaml`](./openapi.yaml) (Supabase + PostgREST
+ Edge Functions). All calls go through the typed wrappers in
[`lib/api.ts`](./lib/api.ts) using `@supabase/supabase-js`, which attaches the
`apikey` + `Authorization: Bearer` headers and respects Row Level Security.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment — copy `.env.example` to `.env` and paste your Supabase
   **publishable/anon key** (the project URL is already set):
   ```bash
   cp .env.example .env
   ```
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://kqstctmmbxajikdxonwz.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-publishable-anon-key>
   ```
3. Run:
   ```bash
   npx expo start
   ```
   Open in Expo Go or a dev build (iOS/Android).

## Notes

- **Production builds** use Hermes (the SDK 54 default) via **EAS Build**.
- A local `npx expo export` **on Windows** may fail at the Hermes bytecode step
  on a React Native core file (`DOMRectReadOnly`, which uses ES private fields)
  because the bundled Windows `hermesc` lags. This does **not** affect
  `expo start` (Expo Go / dev client run the JS directly on a current Hermes) or
  EAS production builds (Linux `hermesc`). The full JS bundle is verified to
  compile cleanly.

---

Built with care — *"Be still, and know that I am God."* (Psalm 46:10)
