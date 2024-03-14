import { Component, OnInit } from '@angular/core';
import { IMovieModel, IMovieWithFavoriteFlagModel, IMoviesResponse, MovieWithFavoriteFlagModel } from '../../models/movie.model';
import { Observable, forkJoin, iif, map, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public movies: IMovieWithFavoriteFlagModel[] = [];
  public searchText: string = '';
  public readonly accountId: string|null = localStorage.getItem('userId');
  public readonly sessionId: string|null = localStorage.getItem('sessionId');

  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = 'c1faa70e83d532faeccb93fa4029a561';
  private readonly ratingStarsNumber = 5;

  constructor(private readonly http: HttpClient) {}

  public ngOnInit(): void {
    this.getMovies().subscribe();
  }

  public markAsFavorite(media_id: number | null, favorite: boolean): void {
    this.http.post(`https://api.themoviedb.org/3/account/${this.accountId}/favorite?session_id=${this.sessionId}&api_key=${this.apiKey}`, {
      media_type: "movie",
      media_id,
      favorite
    }).pipe(
      switchMap(() => this.getMovies())
    ).subscribe();
  }

  public getRating(voteAverage: number | null): number {
    const ratingPercentage = (voteAverage || 0) * 10;
    return Math.round(ratingPercentage * this.ratingStarsNumber / 100);
  }

  public sortByTitle(): void {
    this.movies = this.movies.sort((a, b) => a.original_title.localeCompare(b.original_title));
  }

  public sortByDate(): void {
    this.movies = this.movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  }

  public sortByRating(): void {
    this.movies = this.movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  }

  private getMovies(): Observable<IMovieWithFavoriteFlagModel[]> {
    return iif(
      () => Boolean(this.accountId && this.sessionId),
      forkJoin([
        this.getPopularMovies(),
        this.http.get<IMoviesResponse>(`${this.apiUrl}/account/${this.accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`).pipe(
          map(({ results }: IMoviesResponse) => results.map((movie: IMovieModel) => movie.id))
        )
      ]).pipe(
        map(([popularMovies, favoriteMoviesIds]) => popularMovies.map((movie: IMovieModel) => {
          const isFavorite = favoriteMoviesIds.includes(movie.id);
          return new MovieWithFavoriteFlagModel(movie, isFavorite);
        }))
      ),
      this.getPopularMovies()
    ).pipe(
      tap((movies: IMovieWithFavoriteFlagModel[]) => this.movies = movies)
    );
  }

  private getPopularMovies(): Observable<IMovieWithFavoriteFlagModel[]> {
    return this.http.get<IMoviesResponse>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`).pipe(
      map(({ results }: IMoviesResponse) => results.map((movie: IMovieModel) => new MovieWithFavoriteFlagModel(movie))),
    );
  }
}
