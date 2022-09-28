import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Movie } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie;
  genres: string;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        return this.movieService.getById(params['movieId'])
      }),
      tap(movie => this.movie = movie),

      // reduce array of genres from api to a string seperated by commas
      // there has to be a better way to do this
      tap(movie => {
        let genreNamesArr: string[] = [];
        movie.genres.forEach(genre => genreNamesArr.push(genre.name));
        this.genres = genreNamesArr?.reduce((prev, curr) => prev + ', ' + curr);
      })
    ).subscribe();
  }

  logMovie() {
    console.log(this.movie);
  }
}
