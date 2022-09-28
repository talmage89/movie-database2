import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovieSearchComponent } from '../components/movie-search/movie-search.component';
import { MovieDetailsComponent } from '../components/movie-details/movie-details.component';
import { UserSelectionsComponent } from '../components/user-selections/user-selections.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: MovieSearchComponent, canActivate: [AuthGuard] },
  { path: 'movie-details', component: MovieDetailsComponent, canActivate: [AuthGuard] },
  { path: 'movies', component: UserSelectionsComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: UserSelectionsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
