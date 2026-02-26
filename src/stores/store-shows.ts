import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { TvMazeShow } from "../api/tvmaze.types";
import { getShowsPage, searchShows } from "../api/tvmaze.client";


// this is a store-specific helper type, not an API type and keeping it inside this file improves clarity and reduces unnecessary coupling.
export type GenreSection = {
    genre: string;
    shows: TvMazeShow[];
};

export const useTvShowsStore = defineStore("tvShows", () => {
    const searchQuery = ref("");
    const selectedGenre = ref<string>("");
    const indexShows = ref<TvMazeShow[]>([]);
    const searchResults = ref<TvMazeShow[]>([]);
    const isLoadingIndex = ref(false);
    const isLoadingSearch = ref(false);
    const error = ref<string | null>(null);

    const isLoading = computed(
        () => isLoadingIndex.value || isLoadingSearch.value,
    );

    async function loadShows(pages: number[] = [0, 1]) {
        error.value = null;
        isLoadingIndex.value = true;

        try {
            // no loop, just starting all requests at once (faster)
            const pageResults = await Promise.all(
                pages.map((pageNumber) => getShowsPage(pageNumber))
            );

            const mergedShows = pageResults.flat(); // flat cleans up the result array

            // Remove duplicates by show ID because ui needs to be stable
            const showByIdMap = new Map<number, TvMazeShow>();
            for (const show of mergedShows) {
                showByIdMap.set(show.id, show);
            }

            indexShows.value = Array.from(showByIdMap.values());

        } catch (errorObject: unknown) {
            if (errorObject instanceof Error) {
                error.value = errorObject.message;
            } else {
                error.value = "Failed to load show index.";
            }
        } finally {
            isLoadingIndex.value = false;
        }
    }

    // Call this when searchQuery changes (debounced in component)
    async function runSearch(nextQuery?: string) {
        const trimmedQuery = (nextQuery ?? searchQuery.value).trim();
        searchQuery.value = trimmedQuery; // clean query

        // When query is cleared or users types only spaces → return to index mode
        if (!trimmedQuery) {
            searchResults.value = [];
            error.value = null;
            selectedGenre.value = "";
            return;
        }

        error.value = null;
        isLoadingSearch.value = true;

        try {
            searchResults.value = await searchShows(trimmedQuery);

            // If selected genre no longer exists in search results, reset it. Can also be a seperate function, but this is easier to understand.
            if (
                selectedGenre.value &&
                !allGenres.value.includes(selectedGenre.value)
            ) {
                selectedGenre.value = "";
            }

        } catch (errorObject: unknown) {
            if (errorObject instanceof Error) {
                error.value = errorObject.message;
            } else {
                error.value = "Something went wrong while searching shows..";
            }
            searchResults.value = [];
        } finally {
            isLoadingSearch.value = false;
        }
    }

    // Decide which dataset is currently active (index or search)
    const activeShows = computed(() => {
        const trimmedQuery = searchQuery.value.trim();
        return trimmedQuery ? searchResults.value : indexShows.value;
    });

    // Extract all unique genres from the active dataset
    const allGenres = computed(() => {
        const uniqueGenres = new Set<string>();

        for (const show of activeShows.value) {
            for (const genre of show.genres ?? []) {
                uniqueGenres.add(genre);
            }
        }

        return Array.from(uniqueGenres).sort((a, b) =>
            a.localeCompare(b)
        );
    });

    const sections = computed<GenreSection[]>(() => {
        // Group shows by genre
        const showsByGenreMap = new Map<string, TvMazeShow[]>();

        for (const show of activeShows.value) {
            for (const genre of show.genres ?? []) {
                if (!showsByGenreMap.has(genre)) {
                    showsByGenreMap.set(genre, []);
                }
                showsByGenreMap.get(genre)!.push(show);
            }
        }

        // If a single genre is selected, I only keep that genre
        const genresToInclude = selectedGenre.value
            ? [selectedGenre.value]
            : Array.from(showsByGenreMap.keys());

        return genresToInclude
            .map((genre) => {
                const showsInGenre = showsByGenreMap.get(genre) ?? [];

                // Sort shows descending by rating
                showsInGenre.sort(
                    (a, b) => (b.rating?.average ?? -1) - (a.rating?.average ?? -1)
                );

                return {
                    genre,
                    shows: showsInGenre,
                };
            })
            // Always sort sections alphabetically by genre
            .sort((a, b) => a.genre.localeCompare(b.genre));
    });

    return {
        searchQuery,
        selectedGenre,

        indexShows,
        searchResults,

        isLoadingIndex,
        isLoadingSearch,
        isLoading,
        error,

        activeShows,
        allGenres,
        sections,

        loadShows,
        runSearch,
    };
});
