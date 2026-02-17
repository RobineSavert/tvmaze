# TV Shows Dashboard

A responsive TV show dashboard built with Vue 3 that:

- loads TV shows from the TVMaze **Show Index** endpoint,
- **groups** shows by genre,
- **sorts** each genre row by rating (highest first!),
- supports **search by show name**,
  includes a **detail page** with show info

## Tech stack

- **Vue 3** (Composition API)
- **TypeScript**
- **Pinia** for state management
- **Tailwind CSS** for styling
- **Vitest** for unit tests

## Architecture

### Vue 3 + Composition API

Vue 3 provides a clean component model and reactivity system; Composition API keeps logic modular and readable (especially with stores + computed derived state).

### Pinia

Pinia is the recommended store for Vue 3. It keeps state centralized and makes it easy to:

- load & cache data
- derive presentation-ready data via computed getters
- keep components mostly “dumb” and reusable

### TVMaze Show Index endpoint

TVMaze does not expose a “by genre” endpoint. The assignment states that the **Show Index** endpoint contains the needed data.  
This project therefore loads a dataset from `/shows?page=N`, then derives:

- the list of genres,
- grouped sections per genre,
- sorted lists per genre (by rating)

### Files

- `src/api/tvmaze.types.ts` contains **only TypeScript types**
- `src/api/tvmaze.client.ts` contains **only HTTP calls**
- `src/stores/*` contains **state + business rules** (grouping, sorting, filtering)
- `src/components/*` contains **presentational UI components**
- `src/views/*` contains **templates**

## Features

- Genre dashboard with **horizontal scrolling rows**
- Sorting by rating within each genre
- Search by show name (filters the index dataset and updates genre sections)
- Show detail page (show + cast + episodes)
- Mobile friendly / responsive UI

## Lessons learned

The TVMaze /search/shows endpoint is not strict substring matching.
It uses fuzzy matching; so it does token similarity, partial match, relevance scoring and it may return phonetically similar results.

## Live demo

A live demo is available at https://abnamro-tvmaze.netlify.app/

## Project setup

### Requirements

- **Node.js**: >= 20 (recommended)
- **npm**: >= 10

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Test

```bash
npm run test
```
