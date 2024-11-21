import { AxiosInstance } from "axios"

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

export class MovieAPI {
  private axiosInstance: AxiosInstance

  constructor(private sharedAxiosInstance: AxiosInstance) {
    this.axiosInstance = sharedAxiosInstance
  }

  // Method to get all movies
  public async get(): Promise<MovieResponse[]> {
    try {
      const response = await this.axiosInstance.get<MovieResponse[]>("/movie")
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch movies: ${error}`)
    }
  }

  // Method to add a new movie
  public async add(movie: Movie): Promise<MovieResponse> {
    try {
      const response = await this.axiosInstance.post<MovieResponse>("/movie", movie)
      return response.data
    } catch (error) {
      throw new Error(`Failed to add movie: ${error}`)
    }
  }

  // Method to delete a movie by ID
  public async delete(movieId: number, deleteFiles: boolean = false): Promise<void> {
    try {
      const params = { deleteFiles }
      await this.axiosInstance.delete(`/movie/${movieId}`, { params })
    } catch (error) {
      throw new Error(`Failed to delete movie: ${error}`)
    }
  }

  // Method to get movie details by ID
  public async getById(movieId: number): Promise<MovieResponse> {
    try {
      const response = await this.axiosInstance.get<MovieResponse>(`/movie/${movieId}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch movie by ID: ${error}`)
    }
  }

  // Method to update an existing movie
  public async update(movie: Movie): Promise<MovieResponse> {
    try {
      const response = await this.axiosInstance.put<MovieResponse>(`/movie/${movie.id}`, movie)
      return response.data
    } catch (error) {
      throw new Error(`Failed to update movie: ${error}`)
    }
  }
}
