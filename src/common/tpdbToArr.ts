type TMDBMovie = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: any[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: any[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type WhisparrMovie = {
  title: string;
  originalLanguage: {
    id: number;
    name: string;
  };
  sortTitle: string;
  status: string;
  overview: string;
  releaseDate: string;
  images: {
    coverType: string;
    url: string;
    remoteUrl: string;
  }[];
  remotePoster: string;
  year: number;
  studioTitle: string;
  studioForeignId: string;
  qualityProfileId: number;
  monitored: boolean;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  cleanTitle: string;
  tmdbId: number;
  foreignId: string;
  titleSlug: string;
  folder: string;
  genres: string[];
  tags: string[];
  added: string;
  ratings: {
    tmdb: {
      votes: number;
      value: number;
      type: string;
    };
  };
  credits: any[];
  itemType: string;
  addOptions: {
    monitor: string;
    searchForMovie: boolean;
  };
  rootFolderPath: string;
  id: number;
};

