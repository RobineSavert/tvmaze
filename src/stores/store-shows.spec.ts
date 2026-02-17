import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTvShowsStore } from "./store-shows";
import type { TvMazeShow } from "../api/tvmaze.types";

function makeShow(
  partial: Partial<TvMazeShow> & Pick<TvMazeShow, "id" | "name">,
): TvMazeShow {
  return {
    id: partial.id,
    name: partial.name,
    genres: partial.genres ?? [],
    premiered: partial.premiered ?? null,
    ended: partial.ended ?? null,
    status: partial.status ?? null,
    runtime: partial.runtime ?? null,
    averageRuntime: partial.averageRuntime ?? null,
    language: partial.language ?? null,
    officialSite: partial.officialSite ?? null,
    summary: partial.summary ?? null,
    image: partial.image ?? null,
    rating: partial.rating ?? { average: null },
    network: partial.network ?? null,
    webChannel: partial.webChannel ?? null,
  };
}

describe("store-shows", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("groups shows by genre and sorts each genre by rating desc", () => {
    const store = useTvShowsStore();

    store.indexShows = [
      makeShow({
        id: 1,
        name: "A",
        genres: ["Drama"],
        rating: { average: 7.0 },
      }),
      makeShow({
        id: 2,
        name: "B",
        genres: ["Drama"],
        rating: { average: 9.5 },
      }),
      makeShow({
        id: 3,
        name: "C",
        genres: ["Comedy"],
        rating: { average: 8.0 },
      }),
      makeShow({
        id: 4,
        name: "D",
        genres: ["Comedy"],
        rating: { average: null },
      }),
      makeShow({ id: 5, name: "E", genres: [], rating: { average: 10 } }),
    ];

    // Ensure no search filter blocks results
    store.searchQuery = "";

    const drama = store.sections.find((s) => s.genre === "Drama");
    const comedy = store.sections.find((s) => s.genre === "Comedy");

    expect(drama?.shows.map((s) => s.name)).toEqual(["B", "A"]); // 9.5 then 7.0
    expect(comedy?.shows.map((s) => s.name)).toEqual(["C", "D"]); // 8.0 then null (treated as -1)

    // Show with no genres should not appear in sections
    const allNamesInSections = store.sections.flatMap((sec) =>
      sec.shows.map((x) => x.name),
    );
    expect(allNamesInSections).not.toContain("E");
  });

  it("filters by searchQuery before grouping", () => {
    const store = useTvShowsStore();

    const data = [
      makeShow({
        id: 1,
        name: "Breaking Bad",
        genres: ["Drama"],
        rating: { average: 9.5 },
      }),
      makeShow({
        id: 2,
        name: "The Office",
        genres: ["Comedy"],
        rating: { average: 8.8 },
      }),
      makeShow({
        id: 3,
        name: "Office Girls",
        genres: ["Drama"],
        rating: { average: 7.0 },
      }),
    ];

    // browse dataset (not used in search mode, but fine)
    store.indexShows = data;

    // search mode uses searchResults
    store.searchQuery = "office";
    store.searchResults = data.filter((show) =>
      show.name.toLowerCase().includes("office"),
    );

    const genres = store.sections.map((s) => s.genre);
    expect(genres.sort()).toEqual(["Comedy", "Drama"]);

    const comedy = store.sections.find((s) => s.genre === "Comedy");
    expect(comedy?.shows.map((s) => s.name)).toEqual(["The Office"]);

    const drama = store.sections.find((s) => s.genre === "Drama");
    expect(drama?.shows.map((s) => s.name)).toEqual(["Office Girls"]);
  });

  it("optional: selectedGenre filters sections to one genre (if implemented)", () => {
    const store = useTvShowsStore();

    store.indexShows = [
      makeShow({ id: 1, name: "A", genres: ["Drama"], rating: { average: 7 } }),
      makeShow({
        id: 2,
        name: "B",
        genres: ["Comedy"],
        rating: { average: 8 },
      }),
    ];

    store.searchQuery = "";
    store.selectedGenre = "Comedy";
    expect(store.sections).toHaveLength(1);

    const [first] = store.sections;
    expect(first).toBeDefined();

    expect(first!.genre).toBe("Comedy");
    expect(first!.shows.map((s) => s.name)).toEqual(["B"]);
  });
});
