export interface Background {
  full: string;
  large: string;
  medium: string;
  small: string;
}

export interface Media {
  id: number;
  url: string;
  size: number;
  order: number;
}

export interface Extras {
  gender: string;
  birthday: string;
  birthday_timestamp: number;
  deathday: string;
  deathday_timestamp: number;
  birthplace: string;
  birthplace_code: string;
  astrology: string;
  ethnicity: string;
  nationality: string;
  hair_colour: string;
  eye_colour: string;
  weight: string;
  height: string;
  measurements: string;
  cupsize: string;
  tattoos: string;
  piercings: string;
  waist: string;
  hips: string;
  career_start_year: number;
  career_end_year: number;
  fake_boobs: boolean;
  same_sex_only: boolean;
  links: {
    IAFD: string | null;
    Example: string;
  };
}

export interface Performer {
  id: string;
  _id: number;
  slug: string;
  name: string;
  disambiguation: string;
  bio: string;
  rating: number;
  is_parent: boolean;
  extras: Extras;
  aliases: string[];
  image: string;
  thumbnail: string;
  face: string;
  posters: Media[];
  site_performers: SitePerformer[];
}

export interface SitePerformer {
  id: string;
  _id: number;
  site_id: number;
  name: string;
  bio: string;
  is_parent: boolean;
  extras: Partial<Extras>;
  image: string;
  thumbnail: string;
  face: string;
  scenes: string[];
  parent: string;
  site: Site;
}

export interface Site {
  id: number;
  parent_id: number;
  network_id: number;
  name: string;
  short_name: string;
  url: string;
  description: string;
  rating: number;
  logo: string;
  favicon: string;
  poster: string;
  network: {
    id: number;
    name: string;
    short_name: string;
  };
}

export interface Tag {
  id: number;
  name: string;
  parents: string[];
}

export interface Hash {
  can_delete: boolean;
  created_at: string;
  duration: number;
  hash: string;
  id: number;
  scene_id: number;
  submissions: number;
  type: string;
  updated_at: string;
}

export interface Marker {
  id: number;
  title: string;
  start_time: number;
  end_time: number;
  created_at: string;
}

export interface Director {
  id: number;
  name: string;
  slug: string;
}

export interface Link {
  IAFD: string | null;
  Example: string;
}

export interface Data {
  id: string;
  _id: number;
  title: string;
  type: string;
  slug: string;
  external_id: string;
  description: string;
  rating: number;
  site_id: number;
  date: string;
  url: string;
  image: string;
  poster: string;
  trailer: string;
  duration: number;
  format: string;
  sku: string;
  background: Background;
  media: Media;
  created: string;
  last_updated: string;
  performers: Performer[];
  site: Site;
  tags: Tag[];
  hashes: Hash[];
  markers: Marker[];
  directors: Director[];
  scenes: string[];
  movies: string[];
  links: Link;
}

export interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last: number;
}

export interface MoviesResponse {
  data: Data[];
  meta: Meta;
}

export interface User {
  id: number
  name: string
}

export interface SearchRequest {
  category_id?: number; // integer (query)
  date?: string; // string (query)
  date_operation?: "=" | ">" | ">=" | "<" | "<="; // string (query)

  director_and?: boolean; // boolean (query)
  director_id?: number; // integer (query)
  directors?: string[]; // array[string] (query)

  duration?: number; // integer (query)
  external_id?: string; // string (query)
  hash?: string; // string (query)
  hashType?: "OSHASH" | "PHASH"; // string (query)

  is_collected?: boolean; // boolean (query)
  is_favourite?: boolean; // boolean (query)

  orderBy?:
    | "duration_asc"
    | "duration_desc"
    | "former_created"
    | "former_released"
    | "former_updated"
    | "recently_created"
    | "recently_released"
    | "recently_updated"; // string (query)

  parse?: string; // string (query)
  per_page?: number; // integer (query)

  performer_and?: boolean; // boolean (query)
  performer_gender_and?: boolean; // boolean (query)
  performer_gender_only?: boolean; // boolean (query)
  performer_genders?: string[]; // array[string] (query)
  performer_id?: number; // integer (query)
  performers?: Record<string, string>; // object (query)

  q?: string; // string (query)
  site?: string; // string (query)
  site_id?: number; // integer (query)
  site_operation?:
    | "Network"
    | "Parent"
    | "Site"
    | "Site/Network"
    | "Site/Parent"
    | "Site/Parent/Network"; // string (query)

  sku?: string; // string (query)
  tag_and?: boolean; // boolean (query)
  tags?: Record<string, string>; // object (query)

  title?: string; // string (query)
  url?: string; // string (query)
  year?: number; // integer (query)
  page?: number; // integer (query) (Default value: 1)
}
