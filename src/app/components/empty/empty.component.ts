import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, iif, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {
  apiUrl = 'https://api.themoviedb.org/3';
  apiKey = 'c1faa70e83d532faeccb93fa4029a561';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

   ngOnInit(): void {
    this.getSessionId();
  }

  getSessionId(): void {
    this.route.queryParams.pipe(
      switchMap(
        ({ request_token, approved }) => iif(
          () => approved === 'true',
          this.http.get(`${this.apiUrl}/authentication/session/new?api_key=${this.apiKey}&request_token=${request_token}`).pipe(
            map(({ session_id }: any) => session_id),
            tap((sessionId: string) => localStorage.setItem('sessionId', sessionId))
          ),
          of(localStorage.getItem('sessionId'))
        ),
      ),
      filter(Boolean),
      switchMap((sessionId: string) => this.http.get(`${this.apiUrl}/account?api_key=${this.apiKey}&session_id=${sessionId}`)),
      tap(({ id }: any) => {
        localStorage.setItem('userId', id);
        this.router.navigate(['/']);
      })
    ).subscribe();
  }
}
