import {BaseEntityAPI} from "@/common/api/BaseEntityAPI"

export interface MovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  genres?: string[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  poster: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse {
  page: number;
  results: MovieResult[];
  total_pages: number;
  total_results: number;
}

export class SearchAPI extends BaseEntityAPI {
  async generic<Result extends {adult: boolean}, Response>(type: 'tv' | 'movie', query: string, include_adult = false, language = 'en-US', page = 1) {
    let results: Result[] = []
    let currentPage = page
    let resp = await this._get<Response, any>(`search/${type}`, {
      query,
      include_adult,
      language,
      page: currentPage
    })
    results = resp.data.results
    if(!include_adult) {
      return results
    }

    do {
      resp = await this._get<Response, any>(`search/${type}`, {
        query,
        include_adult,
        language,
        page: ++currentPage
      })
      results = results.concat(resp.data.results)
    } while (resp.data.results.length > 0)
    return {
      ...resp,
      data: {
        ...resp.data,
        results: results.filter(result => result.adult)
      }
    }
  }
  async tv(query: string, include_adult = false, language = 'en-US', page = 1) {
    return await this.generic<MovieResult, MovieResponse>('tv', query, include_adult, language, page)
  }
  async movie(query: string, include_adult = false, language = 'en-US', page = 1) {
    return await this.generic<MovieResult, MovieResponse>('movie', query, include_adult, language, page)
  }
}