import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { ListType } from 'src/app/enums/list-type';
import { Movie } from 'src/app/interfaces/movie';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-selections',
  templateUrl: './user-selections.component.html',
  styleUrls: ['./user-selections.component.scss']
})
export class UserSelectionsComponent implements OnInit {
  unsubscribe = new Subject<void>();

  listType: ListType;
  listTypeTitle: string;
  dataSource: Movie[];
  dataSourceById: object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }
  

  ngOnInit(): void {
    this.listType = this.route.snapshot.routeConfig.path === 'movies' ? ListType.WATCHEDLIST : ListType.WISHLIST;
    this.listTypeTitle = this.listType === ListType.WATCHEDLIST ? 'Movies you\'ve seen' : 'Movies to see';

    if (this.listType === ListType.WATCHEDLIST) {
      this.localStorageService.getGameList(ListType.WATCHEDLIST);
      this.localStorageService.watchedMovies.pipe(
        takeUntil(this.unsubscribe),
        tap(movies => {
          this.dataSource = movies;
          this.dataSourceById = _.mapKeys(movies, 'id');
        })
      ).subscribe();
    } else {
      this.localStorageService.getGameList(ListType.WISHLIST);
      this.localStorageService.wishListMovies.pipe(
        takeUntil(this.unsubscribe),
        tap(movies => {
          this.dataSource = movies;
          this.dataSourceById = _.mapKeys(movies, 'id');
        })
      ).subscribe();
    }
  }

  goToMovieDetails(movie: Movie) {
    this.router.navigate(['./movie-details', { movieId: movie.id }]);
  }

  deleteMovie(movie: Movie) {
    this.localStorageService.deleteMovie(movie, this.listType)
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
