import { Injectable } from '@angular/core';
import { Hero} from './hero'
import { Observable, of } from "rxjs";
import { MessagesService } from "./messages.service";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  heroes:Hero[] = [];
  private log(message: string) { this.messageService.add(`HeroService: ${message}`); }
  private heroesUrl= 'api/heroes'; //api to heroes
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private messageService: MessagesService,private http:HttpClient) { }

  getHeroes(): Observable<Hero[]> {
   return this.http.get<Hero[]>(this.heroesUrl)
     .pipe(
       tap(_ =>this.log('fetched heroes')),
       catchError(this.handleError<Hero[]>('getHeroes',[] ) ));
  }
  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(this.heroesUrl+"/"+id).pipe(
      tap(_ => this.log('hero with id')),
      catchError(this.handleError<Hero>('getHero id=${id}'))
    );
  }
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  /** POST: dodaje novog heroja na serves **/
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /**
    Upravlje greskama koje http moze dati, ali omogucava da aplikacija nastavi raditi
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // logiraj error

      this.log(`${operation} failed: ${error.message}`);

      //vraca prazan rezultat da bi se aplikacija mogla nastaviti
      return of(result as T);
    };
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
}
