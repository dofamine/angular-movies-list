import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, AfterViewInit {
   movies: any;

  apiUrl = 'https://api.themoviedb.org/3/account';
  apiKey = 'c1faa70e83d532faeccb93fa4029a561';
  ratingStarsNumber = 5;
  accountId: string|null = localStorage.getItem('userId');
  sessionId: string|null = localStorage.getItem('sessionId');

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.movies = [];
  }

  ngOnInit(): void {
    this.getFavoriteMovies().subscribe();
  }

   getRating(voteAverage: number | null): number {
    const ratingPercentage = (voteAverage || 0) * 10;
    return Math.round(ratingPercentage * this.ratingStarsNumber / 100);
  }

   removeFromFavorites(media_id: number | null): void {
    this.http.post(`${this.apiUrl}/${this.accountId}/favorite?session_id=${this.sessionId}&api_key=${this.apiKey}`, {
      media_type: "movie",
      media_id,
      favorite: false
    }).pipe(
      switchMap(() => this.getFavoriteMovies())
    ).subscribe();
  }

  getFavoriteMovies(): Observable<object[]> {
    return this.http.get<any>(`${this.apiUrl}/${this.accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`)
    .pipe(
      map(({ results }) => results),
      tap((movies: any[]) => this.movies = movies)
    );
  }
}
