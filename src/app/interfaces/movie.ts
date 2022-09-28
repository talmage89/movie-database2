import { MovieGenre } from "./movie-genre";
import { ProductionCompany } from "./production-company";

export interface Movie {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: object | null
    budget: number | null;
    genre_ids: number[] | null;
    genres: MovieGenre[] | null;
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    production_companies: ProductionCompany[] | null;
    production_countries: object[] | null;
    release_date: string;
    revenue: number | null;
    runtime: number | null;
    spoken_languages: object[] | null;
    status: string | null;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}