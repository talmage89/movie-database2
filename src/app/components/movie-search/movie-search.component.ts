import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListType } from 'src/app/enums/list-type';
import { Movie } from 'src/app/interfaces/movie';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MovieService } from 'src/app/services/movie.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent implements OnInit {
  searchText: string;
  movies: Movie[] = [];
  noResults: boolean = false;

  watchedMovies: any[];
  wishListMovies: any[];

  watchedMovies$: Observable<Movie[]> | undefined;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.localStorageService.getGameList(ListType.WATCHEDLIST);
    this.localStorageService.getGameList(ListType.WISHLIST);

    this.localStorageService.watchedMovies.subscribe(movies => this.watchedMovies = _.mapKeys(movies, 'id'));
    this.localStorageService.wishListMovies.subscribe(movies => this.wishListMovies = _.mapKeys(movies, 'id'));
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
      this.localStorageService.deleteMovie(movie, ListType.WATCHEDLIST);
    } else {
      if (this.watchedMovies[movie.id]) {
        this.localStorageService.deleteMovie(movie, ListType.WISHLIST);
      }
      this.localStorageService.saveMovie(movie, ListType.WATCHEDLIST);
    }
  }

  updateWishList(event: MouseEvent, movie: Movie) {
    event.stopPropagation();

    if (this.wishListMovies[movie.id]) {
      this.localStorageService.deleteMovie(movie, ListType.WISHLIST);
    } else {
      if (this.wishListMovies[movie.id]) {
        this.localStorageService.deleteMovie(movie, ListType.WATCHEDLIST);
      }
      this.localStorageService.saveMovie(movie, ListType.WISHLIST);
    }
  }
}
