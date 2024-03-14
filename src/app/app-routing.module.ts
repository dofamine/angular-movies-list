import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { LoginComponent } from './components/login/login.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { EmptyComponent } from './components/empty/empty.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'movies'
}, {
  path: 'movies',
  component: ListComponent
}, {
  path: 'favorites',
  component: FavoritesComponent
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'authenticate',
  component: EmptyComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
