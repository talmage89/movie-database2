import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListType } from '../enums/list-type';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  watchedMovies = new BehaviorSubject<Movie[]>([]);
  wishListMovies = new BehaviorSubject<Movie[]>([]);

  constructor() { }

  saveMovie(movie: Movie, listType: ListType) {
    let movieList: Movie[] = JSON.parse(window.localStorage.getItem(listType.valueOf()));
    if (!movieList) {
      movieList = [movie];
    } else {
      movieList = [...movieList, movie];
    }
    window.localStorage.setItem(listType.valueOf(), JSON.stringify(movieList));

    const parsedUpdateList = JSON.parse(window.localStorage.getItem(listType.valueOf()));
    if (listType === ListType.WATCHEDLIST) {
      this.watchedMovies.next(parsedUpdateList);
    } else {
      this.wishListMovies.next(parsedUpdateList);
    }
  }

  deleteMovie(movie: Movie, listType: ListType) {
    let movieList: Movie[] = JSON.parse(window.localStorage.getItem(listType.valueOf()));
    const movieIndex = movieList.findIndex(currMovie => currMovie.id === movie.id);
    if (movieIndex > -1) {
      movieList.splice(movieIndex, 1)
      window.localStorage.setItem(listType.valueOf(), JSON.stringify(movieList));
    }

    if (listType === ListType.WATCHEDLIST) {
      this.watchedMovies.next(movieList.length > 0 ? movieList : []);
    } else {
      this.wishListMovies.next(movieList.length > 0 ? movieList : []);
    }
  }

  getGameList(listType: ListType) {
    let list = JSON.parse(window.localStorage.getItem(listType.valueOf()));

    if (listType === ListType.WATCHEDLIST) {
      this.watchedMovies.next(!list ? [] : list);
    } else {
      this.wishListMovies.next(!list ? [] : list);
    }
  }
}
