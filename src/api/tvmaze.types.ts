export type TvMazeImage = {
    medium?: string | null;
    original?: string | null;
} | null;

export type TvMazeRating = {
    average: number | null;
};

export type TvMazeShow = {
    id: number;
    name: string;
    genres: string[];
    premiered: string | null;
    ended: string | null;
    status: string | null;
    runtime: number | null;
    averageRuntime?: number | null;
    language: string | null;
    officialSite: string | null;
    summary: string | null;
    image: TvMazeImage;
    rating: TvMazeRating;
    network?: { name: string | null } | null;
    webChannel?: { name: string | null } | null;
};

export type TvMazePerson = {
    id: number;
    name: string;
    image?: TvMazeImage;
};

export type TvMazeCharacter = {
    id?: number;
    name: string;
    image?: TvMazeImage;
};

export type TvMazeCastMember = {
    person: TvMazePerson;
    character: TvMazeCharacter;
    self?: boolean;
    voice?: boolean;
};

export type TvMazeEpisode = {
    id: number;
    url?: string;
    name: string;
    season: number;
    number: number | null;
    type?: string;
    airdate: string | null;
    airtime: string | null;
    runtime: number | null;
    rating?: TvMazeRating;
    image?: TvMazeImage;
    summary: string | null;
};
