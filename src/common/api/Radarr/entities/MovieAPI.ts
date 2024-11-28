import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

// Define types for movie-related data
export interface Movie {
  title: string;
  year: number;
  tmdbId: number;
  imdbId?: string;
  id?: number;
  qualityProfileId: number;
  rootFolderPath: string;
  monitored: boolean;
  addOptions?: {
    searchForMovie: boolean;
  };
  images: {
    coverType: string;
    remoteUrl: string;
  }[];
}

export interface MovieResponse extends Movie {
  id: number;
}

// Define a type for a paginated movie response (optional, if needed for advanced listing)
export interface MoviePagingResponse {
  page: number;
  pageSize: number;
  records: number;
  movies: MovieResponse[];
}

export class MovieAPI extends BaseEntityAPI {

  // Method to get all movies
  async get(id?: number | string) {
    return await this._get<MovieResponse[] | Movie, any>("movie" + (id ? `/${id}` : ''))
  }

  // Method to add a new movie
  async add(movie: Movie) {
    return await this._post<MovieResponse>("movie", movie)
  }

  // Method to delete a movie by ID
  async delete(movieId: number, deleteFiles: boolean = false) {
    await this._delete(`movie/${movieId}`, { deleteFiles })
  }

  // Method to update an existing movie
  async update(movie: Movie) {
    return await this._put<MovieResponse>(`movie/${movie.id}`, movie)
  }
}
