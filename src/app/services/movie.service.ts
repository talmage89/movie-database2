import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, tap } from 'rxjs';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  searchByName(searchText: string = "", page: number = 1): Observable<Movie[]> {
    const alteredText = encodeURI(searchText);
    return this.http.get<Movie[]>(`https://api.themoviedb.org/3/search/movie?api_key=${environment.movieAPI}&language=en-US&query=${alteredText}&page=${page}&include_adult=false`).pipe(
      map(response => response['results'])
    )
  }

  getById(movieId: string): Observable<Movie> {
    return this.http.get<Movie>(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${environment.movieAPI}&language=en-US`);
  }
}
