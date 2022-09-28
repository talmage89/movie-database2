import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovieSearchComponent } from '../components/movie-search/movie-search.component';
import { MovieDetailsComponent } from '../components/movie-details/movie-details.component';
import { UserSelectionsComponent } from '../components/user-selections/user-selections.component';
import { LoginComponent } from '../components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: MovieSearchComponent },
  { path: 'movie-details', component: MovieDetailsComponent },
  { path: 'movies', component: UserSelectionsComponent },
  { path: 'wishlist', component: UserSelectionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
