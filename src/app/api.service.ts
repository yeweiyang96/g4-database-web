import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Species } from './pojo/Species';
import { Gene } from './pojo/Gene';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  selected = 'species';

  private apiUrl = 'http://192.168.1.3:8000';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

    switchSearch(item: string) {
      this.selected = item;
    }

    searchSpecies(term: string): Observable<any> {
      if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
      }
      if (this.selected == 'Gene') {
        return this.http.get<Gene[]>(`${this.apiUrl}/genes/${term}`);
      }
      return this.http.get<Species[]>(`${this.apiUrl}/species/${term}`);
    }
}
