import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListType } from 'src/app/enums/list-type';
import { Movie } from 'src/app/interfaces/movie';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MovieService } from 'src/app/services/movie.service';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent implements OnInit {
  movies: Movie[] = [];
  trendingMovies$: Observable<Movie[]> | undefined;
  watchedMovies: { [id: string]: Movie } = {};
  wishListMovies: { [id: string]: Movie } = {};
  user: User;
  userSubscription: Subscription;

  searchText: string;
  noResults: boolean = false;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.auth.user$.pipe().subscribe(user => {
      this.user = user;
    })

    this.auth.watchedMovies.subscribe(movies => this.watchedMovies = _.mapKeys(movies, 'id'));
    this.auth.wishListMovies.subscribe(movies => this.wishListMovies = _.mapKeys(movies, 'id'));

    this.trendingMovies$ = this.movieService.getTrending();

    this.auth.getUserData(this.user, ListType.WATCHEDLIST);
    this.auth.getUserData(this.user, ListType.WISHLIST);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  search() {
    this.noResults = false;
    if (this.searchText) {
      this.movieService.searchByName(this.searchText).subscribe(movies => {
        movies.length ? this.movies = movies : this.noResults = true;
      })
    }
  }

  goToMovieDetails(movie: Movie) {
    this.router.navigate(['./movie-details', { movieId: movie.id }]);
  }

  updateWatchedList(event: MouseEvent, movie: Movie) {
    event.stopPropagation();


    if (this.watchedMovies[movie.id]) {
      this.auth.deleteMovie(this.user, movie, ListType.WATCHEDLIST);
    } else {
      if (this.watchedMovies[movie.id]) {
        this.auth.deleteMovie(this.user, movie, ListType.WISHLIST);
      }
      this.auth.saveMovie(this.user, movie, ListType.WATCHEDLIST);
    }
  }

  updateWishList(event: MouseEvent, movie: Movie) {
    event.stopPropagation();

    if (this.wishListMovies[movie.id]) {
      this.auth.deleteMovie(this.user, movie, ListType.WISHLIST);
    } else {
      if (this.wishListMovies[movie.id]) {
        this.auth.deleteMovie(this.user, movie, ListType.WATCHEDLIST);
      }
      this.auth.saveMovie(this.user, movie, ListType.WISHLIST);
    }
  }
}
