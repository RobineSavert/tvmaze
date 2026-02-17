import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { TvMazeShow } from "../api/tvmaze.types";
import { getShowsPage, searchShows } from "../api/tvmaze.client";

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

    async function loadIndex(pages: number[] = [0, 1]) {
        error.value = null;
        isLoadingIndex.value = true;

        try {
            const pageResults = await Promise.all(
                pages.map((pageNumber) => getShowsPage(pageNumber))
            );

            const mergedShows = pageResults.flat();

            // Remove duplicates by show ID
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
        searchQuery.value = trimmedQuery;

        // When query is cleared → return to index mode
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

            // If selected genre no longer exists in search results, reset it
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
        const showsByGenreMap = new Map<string, TvMazeShow[]>();

        for (const show of activeShows.value) {
            for (const genre of show.genres ?? []) {
                if (!showsByGenreMap.has(genre)) {
                    showsByGenreMap.set(genre, []);
                }

                showsByGenreMap.get(genre)!.push(show);
            }
        }

        // If a single genre is selected → filter to only that genre
        if (selectedGenre.value) {
            const selectedGenreShows =
                showsByGenreMap.get(selectedGenre.value) ?? [];

            selectedGenreShows.sort(
                (showA, showB) =>
                    (showB.rating?.average ?? -1) -
                    (showA.rating?.average ?? -1),
            );

            return selectedGenreShows.length
                ? [{ genre: selectedGenre.value, shows: selectedGenreShows }]
                : [];
        }

        // Otherwise return all genres sorted alphabetically
        return Array.from(showsByGenreMap.entries())
            .map(([genre, showsInGenre]) => {
                showsInGenre.sort(
                    (showA, showB) =>
                        (showB.rating?.average ?? -1) -
                        (showA.rating?.average ?? -1),
                );

                return {
                    genre,
                    shows: showsInGenre,
                };
            })
            .sort((sectionA, sectionB) =>
                sectionA.genre.localeCompare(sectionB.genre),
            );
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

        loadIndex,
        runSearch,
    };
});
