import type { TvMazeShow, TvMazeCastMember, TvMazeEpisode } from "./tvmaze.types";

const baseURL = "https://api.tvmaze.com";

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) throw new Error(`TVMaze error ${res.status}: ${res.statusText}`);
    return (await res.json()) as T;
}

export async function getShowsPage(
    page = 0,
    signal?: AbortSignal,
): Promise<TvMazeShow[]> {
    return getJSON<TvMazeShow[]>(`${baseURL}/shows?page=${page}`, signal);
}

export async function searchShows(
    query: string,
    signal?: AbortSignal,
): Promise<TvMazeShow[]> {
    const data = await getJSON<Array<{ show: TvMazeShow }>>(
        `${baseURL}/search/shows?q=${encodeURIComponent(query)}`,
        signal,
    );
    return data.map((r) => r.show);
}

export async function getShow(
    id: number,
    signal?: AbortSignal,
): Promise<TvMazeShow> {
    return getJSON<TvMazeShow>(`${baseURL}/shows/${id}`, signal);
}

export async function getShowCast(
    id: number,
    signal?: AbortSignal,
): Promise<TvMazeCastMember[]> {
    return getJSON<TvMazeCastMember[]>(`${baseURL}/shows/${id}/cast`, signal);
}

export async function getShowEpisodes(
    id: number,
    signal?: AbortSignal,
): Promise<TvMazeEpisode[]> {
    return getJSON<TvMazeEpisode[]>(`${baseURL}/shows/${id}/episodes`, signal);
}
