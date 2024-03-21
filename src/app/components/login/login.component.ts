import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
   loginForm: FormGroup<any> = this.initForm();

  apiKey = 'c1faa70e83d532faeccb93fa4029a561';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

   createSession(): void {
    this.http.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.apiKey}`).pipe(
      tap(({ request_token }: any) => {
        window.open(`https://www.themoviedb.org/authenticate/${request_token}?redirect_to=http://localhost:4200/authenticate`, '_self');
      })).subscribe();
  }

  private initForm(): FormGroup<any> {
    return this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }
}
