import { defineStore } from "pinia";
import { ref } from "vue";
import type { TvMazeShow, TvMazeCastMember, TvMazeEpisode } from "../api/tvmaze.types";
import { getShow, getShowCast, getShowEpisodes } from "../api/tvmaze.client";

export const useShowDetailStore = defineStore("showDetail", () => {
    const show = ref<TvMazeShow | null>(null);
    const cast = ref<TvMazeCastMember[]>([]);
    const episodes = ref<TvMazeEpisode[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    let controller: AbortController | null = null;

    async function load(id: number) {
        if (!id) {
            return;
        }

        controller?.abort();
        controller = new AbortController();

        const signal = controller.signal;

        error.value = null;
        isLoading.value = true;

        try {
            const [s, c, e] = await Promise.all([
                getShow(id, signal),
                getShowCast(id, signal),
                getShowEpisodes(id, signal),
            ]);

            if (signal.aborted) return;

            show.value = s;
            cast.value = c;
            episodes.value = e;
        } catch (err: unknown) {
            // Abort errors are expected behavior.
            // I don’t want to show an error message when the user simply navigated quickly

            if (err instanceof DOMException && err.name === "AbortError") {
                return;
            }
            if (err instanceof Error) {
                error.value = err.message;
            }
            else error.value = "Failed to load show.";
        } finally {
            if (!signal.aborted) {
                isLoading.value = false;
            }
        }
    }

    function reset() {
        controller?.abort();
        controller = null;
        show.value = null;
        cast.value = [];
        episodes.value = [];
        error.value = null;
        isLoading.value = false;
    }

    return {
        show,
        cast,
        episodes,
        isLoading,
        error,
        load,
        reset
    };
});
