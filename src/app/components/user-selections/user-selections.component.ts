import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil, tap } from 'rxjs';
import { ListType } from 'src/app/enums/list-type';
import { Movie } from 'src/app/interfaces/movie';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-selections',
  templateUrl: './user-selections.component.html',
  styleUrls: ['./user-selections.component.scss']
})
export class UserSelectionsComponent implements OnInit {
  listType: ListType;
  listTypeTitle: string;
  dataSource: Movie[];
  dataSourceById: object;

  user: User;
  userSubscription: Subscription;

  listSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }
  

  ngOnInit(): void {
    this.userSubscription = this.auth.user$.subscribe(user => this.user = user);

    this.listType = this.route.snapshot.routeConfig.path === 'movies' ? ListType.WATCHEDLIST : ListType.WISHLIST;
    this.listTypeTitle = this.listType === ListType.WATCHEDLIST ? 'Movies you\'ve seen' : 'Movies to see';

    if (this.listType === ListType.WATCHEDLIST) {
      this.auth.getUserData(this.user, ListType.WATCHEDLIST);
      this.listSubscription = this.auth.watchedMovies.pipe(
        tap(movies => {
          this.dataSource = movies;
          this.dataSourceById = _.mapKeys(movies, 'uid');
        })
      ).subscribe();
    } else {
      this.auth.getUserData(this.user, ListType.WISHLIST);
      this.listSubscription = this.auth.wishListMovies.pipe(
        tap(movies => {
          this.dataSource = movies;
          this.dataSourceById = _.mapKeys(movies, 'uid');
        })
      ).subscribe();
    }
  }

  goToMovieDetails(movie: Movie) {
    this.router.navigate(['./movie-details', { movieId: movie.id }]);
  }

  deleteMovie(event: MouseEvent, movie: Movie) {
    event.stopPropagation();
    this.auth.deleteMovie(this.user, movie, this.listType)
  }

  ngOnDestroy(): void {
    this.listSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
