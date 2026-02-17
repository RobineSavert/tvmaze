import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useShowDetailStore } from "./store-show-details";
import type { TvMazeShow } from "../api/tvmaze.types";

vi.mock("../api/tvmaze.client", () => {
  return {
    getShow: vi.fn(
      async (id: number, _signal?: AbortSignal) =>
        ({
          id,
          name: "Mock Show",
          genres: [],
          rating: { average: 8 },
          premiered: null,
          ended: null,
          status: null,
          runtime: null,
          language: null,
          officialSite: null,
          summary: null,
          image: null,
        }) as TvMazeShow,
    ),
    getShowCast: vi.fn(async (_signal?: AbortSignal) => [
      { person: { id: 1, name: "Actor" }, character: { name: "Role" } },
    ]),
    getShowEpisodes: vi.fn(async (_signal?: AbortSignal) => [
      { id: 1, season: 1, number: 1, name: "Ep1", airdate: "2020-01-01" },
    ]),
  };
});

describe("store-show-detail", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("loads show, cast, episodes and updates state", async () => {
    const store = useShowDetailStore();

    await store.load(123);

    expect(store.error).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.show?.id).toBe(123);
    expect(store.show?.name).toBe("Mock Show");
    expect(store.cast.length).toBe(1);
    expect(store.episodes.length).toBe(1);
  });
});
