import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from 'src/app/hero';
import { HEROES } from 'src/app/mock-heroes';
import { MessageService } from 'src/app/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private baseUrl = `/api/heroes`;

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  getHero(id: number): Observable<Hero> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => {
        this.logger(`Fetched hero id=${id}.`);
      }),
      catchError(this.handleError<Hero>('getHero'))
    )
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.baseUrl).pipe(
      tap((_) => {
        this.logger('Fetched heroes.'); // executes along with the observable
      }),
      catchError(this.handleError<Hero[]>('getHeroes', []))); // intercepts error only
  }

  private logger(message: string) {
    this.messageService.add(`[HeroService] ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); //TODO: send error to remote logging infra instead of to the console

      this.logger(`Operation ${operation} failed: ${error.message}.`); //TODO: better message for end-user

      return of(result as T); // return empty / default result to keep app running
    }
  }
}
