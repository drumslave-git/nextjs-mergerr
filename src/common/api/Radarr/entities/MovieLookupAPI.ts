import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

// Define types for movie lookup results
export interface MovieLookupResult {
  tmdbId: number;
  title: string;
  year: number;
  overview: string;
  images: Array<{
    coverType: string;
    url: string;
  }>;
  runtime: number;
  genres: string[];
  ratings: {
    votes: number;
    value: number;
  };
}

export class MovieLookupAPI extends BaseEntityAPI {
  // Method to search for a movie by title
  async searchByTitle(title: string) {
    return await this._get<MovieLookupResult[]>("movie/lookup", { term: title })
  }

  // Method to look up a movie by TMDb ID
  async lookupByTmdbId(tmdbId: number | string) {
    return await this._get<MovieLookupResult>('movie/lookup/tmdb', {tmdbId})
  }

  async lookupByImdbId(imdbId: number | string) {
    return await this._get<MovieLookupResult>('movie/lookup/imdb', {imdbId})
  }
}
