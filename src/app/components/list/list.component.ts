import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, iif, map, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  movies: any[] = [];
  searchText: string = '';
  readonly accountId: string|null = localStorage.getItem('userId');
  readonly sessionId: string|null = localStorage.getItem('sessionId');

  apiUrl = 'https://api.themoviedb.org/3';
  apiKey = 'c1faa70e83d532faeccb93fa4029a561';
  ratingStarsNumber = 5;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMovies().subscribe();
  }

   markAsFavorite(media_id: number | null, favorite: boolean): void {
    this.http.post(`https://api.themoviedb.org/3/account/${this.accountId}/favorite?session_id=${this.sessionId}&api_key=${this.apiKey}`, {
      media_type: "movie",
      media_id,
      favorite
    }).pipe(
      switchMap(() => this.getMovies())
    ).subscribe();
  }

   getRating(voteAverage: number | null): number {
    const ratingPercentage = (voteAverage || 0) * 10;
    return Math.round(ratingPercentage * this.ratingStarsNumber / 100);
  }

   sortByTitle(): void {
    this.movies = this.movies.sort((a, b) => a.original_title.localeCompare(b.original_title));
  }

   sortByDate(): void {
    this.movies = this.movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  }

   sortByRating(): void {
    this.movies = this.movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  }

  getMovies(): Observable<any[]> {
    return iif(
      () => Boolean(this.accountId && this.sessionId),
      forkJoin([
        this.getPopularMovies(),
        this.http.get<any>(`${this.apiUrl}/account/${this.accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`).pipe(
          map(({ results }) => results.map((movie: any) => movie.id))
        )
      ]).pipe(
        map(([popularMovies, favoriteMoviesIds]) => popularMovies.map((movie) => {
          const isFavorite = favoriteMoviesIds.includes(movie.id);
          return {...movie, isFavorite};
        }))
      ),
      this.getPopularMovies()
    ).pipe(
      tap((movies) => this.movies = movies)
    );
  }

  getPopularMovies(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`).pipe(
      map(({ results }) => results.map((movie: any) => ({...movie, isFavorite: false}))),
    );
  }
}
