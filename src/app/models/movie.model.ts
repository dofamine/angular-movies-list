export interface IMoviesResponse {
  page: number;
  'total_results': number;
  'total_pages': number;
  email: string;
  results: IMovieModel[];
}

export interface IMovieModel {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number|null;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number|null;
  vote_count: number|null;
}

export class MovieModel implements IMovieModel {
  backdrop_path: string = '';
  genre_ids: number[] = [];
  id: number|null = null;
  original_language: string = '';
  original_title: string = '';
  overview: string = '';
  popularity: number| null = null;
  poster_path: string = '';
  release_date: string = '';
  title: string = '';
  video: boolean = false;
  vote_average: number| null = null;
  vote_count: number|null = null;
  adult: boolean = false;

  constructor(data: IMovieModel) {
    this.backdrop_path = data.backdrop_path;
    this.genre_ids = data.genre_ids;
    this.id = data.id;
    this.original_language = data.original_language;
    this.original_title = data.original_title;
    this.overview = data.overview;
    this.popularity = data.popularity;
    this.poster_path = data.poster_path;
    this.release_date = data.release_date;
    this.title = data.title;
    this.video = data.video;
    this.vote_average = data.vote_average;
    this.vote_count = data.vote_count;
    this.adult = data.adult;
  }
}

export interface IMovieWithFavoriteFlagModel extends IMovieModel {
  isFavorite: boolean;
}

export class MovieWithFavoriteFlagModel extends MovieModel implements IMovieWithFavoriteFlagModel{
  isFavorite: boolean = false;

  constructor(data: IMovieModel, isFavorite?: boolean) {
    super(data);
    this.isFavorite = isFavorite ?? false;
  }
}
