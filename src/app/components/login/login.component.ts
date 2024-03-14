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
  public loginForm: FormGroup<ILoginFormGroupControls> = this.initForm();

  private readonly apiKey = 'c1faa70e83d532faeccb93fa4029a561';

  constructor(
    private readonly http: HttpClient,
    private readonly fb: FormBuilder
  ) {}

  public createSession(): void {
    this.http.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.apiKey}`).pipe(
      tap(({ request_token }: any) => {
        window.open(`https://www.themoviedb.org/authenticate/${request_token}?redirect_to=http://localhost:4200/authenticate`, '_self');
      })).subscribe();
  }

  private initForm(): FormGroup<ILoginFormGroupControls> {
    return this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }
}

interface ILoginFormGroupControls {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
