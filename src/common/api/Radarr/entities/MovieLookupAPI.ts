import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

// Define types for movie lookup results
export interface MovieLookupResult {
  title: string;
  originalTitle: string;
  originalLanguage: { id: number; name: string };
  alternateTitles: { sourceType: string; movieMetadataId: number; title: string }[];
  secondaryYearSourceId: number;
  sortTitle: string;
  status: string;
  overview: string;
  inCinemas: string;
  releaseDate: string;
  images: { coverType: string; url: string; remoteUrl: string }[];
  website: string;
  remotePoster: string;
  year: number;
  studio: string;
  movieFileId: number;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  folder: string;
  certification: string;
  genres: string[];
  added: string;
  ratings: {
    imdb: { votes: number; value: number; type: string };
    tmdb: { votes: number; value: number; type: string };
  };
  collection?: {
    title: string;
    tmdbId: number;
  };
  popularity: number;
}

export class MovieLookupAPI extends BaseEntityAPI {
  // Method to search for a movie by title
  async get(term: string) {
    return await this._get<MovieLookupResult[], any>("movie/lookup", { term })
  }
  async tmdb(tmdbId: number) {
    return await this._get<MovieLookupResult, any>(`movie/lookup/tmdb`, { tmdbId })
  }
}
