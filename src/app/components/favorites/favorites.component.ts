import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { IMovieModel, IMoviesResponse, MovieModel } from 'src/app/models/movie.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  public movies: IMovieModel[] = [];

  private readonly apiUrl = 'https://api.themoviedb.org/3/account';
  private readonly apiKey = 'c1faa70e83d532faeccb93fa4029a561';
  private readonly ratingStarsNumber = 5;
  private readonly accountId: string|null = localStorage.getItem('userId');
  private readonly sessionId: string|null = localStorage.getItem('sessionId');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFavoriteMovies().subscribe();
  }

  public getRating(voteAverage: number | null): number {
    const ratingPercentage = (voteAverage || 0) * 10;
    return Math.round(ratingPercentage * this.ratingStarsNumber / 100);
  }

  public removeFromFavorites(media_id: number | null): void {
    this.http.post(`${this.apiUrl}/${this.accountId}/favorite?session_id=${this.sessionId}&api_key=${this.apiKey}`, {
      media_type: "movie",
      media_id,
      favorite: false
    }).pipe(
      switchMap(() => this.getFavoriteMovies())
    ).subscribe();
  }

  private getFavoriteMovies(): Observable<IMovieModel[]> {
    return this.http.get<IMoviesResponse>(`${this.apiUrl}/${this.accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`)
    .pipe(
      map(({ results }: IMoviesResponse) => results.map((movie: IMovieModel) => new MovieModel(movie))),
      tap((movies: IMovieModel[]) => this.movies = movies)
    );
  }
}
