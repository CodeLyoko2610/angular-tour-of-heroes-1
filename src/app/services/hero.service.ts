import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from 'src/app/hero';
import { HEROES } from 'src/app/mock-heroes';
import { MessageService } from 'src/app/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private baseUrl = `/api/heroes`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  searchHeroes(term: string): Observable<Hero[]> {
    const url = `${this.baseUrl}/?name=${term}`;
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(url).pipe(
      tap((x) => {
        return x.length
          ? this.logger(`Found heroes matching "${term}".`)
          : this.logger(`No heroes matching "${term}".`);
      }),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  addHero(newHero: Hero): Observable<Hero> {
    const body = newHero;
    return this.http.post<Hero>(this.baseUrl, body, this.httpOptions).pipe(
      tap((_) => {
        this.logger(`Added hero name=${newHero.name}`);
      }),
      catchError(this.handleError<any>('addHero'))
    );

    // Test the handleError method
    // return throwError('just a joke').pipe(catchError(this.handleError<undefined>('addHero')));
  }

  deleteHero(heroId: number): Observable<any> {
    const url = `${this.baseUrl}/${heroId}`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap((_) => {
        this.logger(`Deleted hero id=${heroId}`);
      }),
      catchError(this.handleError<any>('deleteHero'))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => {
        this.logger(`Fetched hero id=${id}.`);
      }),
      catchError(this.handleError<Hero>('getHero'))
    );
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.baseUrl).pipe(
      tap((_) => {
        this.logger('Fetched heroes.'); // executes along with the observable
      }),
      catchError(this.handleError<Hero[]>('getHeroes', []))); // intercepts error only
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.baseUrl, hero, this.httpOptions).pipe(
      // http.put clever enough to find correct hero object to update with hero.id
      tap((_) => {
        this.logger(`Updated hero id=${hero.id}`);
      }),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  private logger(message: string): void {
    this.messageService.add(`[HeroService] ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(error); // TODO: send error to remote logging infra instead of to the console

      this.logger(`Operation ${operation} failed: ${JSON.stringify(error.message, null, 2) || JSON.stringify(error, null, 2)}.`);
      // TODO: better message for end-user

      return of(result as T); // return empty / default result to keep app running
    };
  }
}
