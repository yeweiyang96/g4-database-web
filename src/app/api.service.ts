import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { SearchResult } from './pojo/SearchResult';
import { Gene } from './pojo/Gene';
import { Search } from './pojo/Search';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://192.168.1.3:8000';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  search(search: Search): Observable<SearchResult[]> {
    if (!search.term.trim()) {
      // if not search term, return empty array.
      return of([]);
    } else if (search.type === 'gene' && search.term.length < 3) {
      return of([]);
    }

    return this.http.get<SearchResult[]>(`${this.apiUrl}/${search.type}/${search.term}`);
  }

  getGenomes(name: string): Observable<string[]> {
    const url = `${this.apiUrl}/genomes/${name}`;
    return this.http.get<string[]>(url);
  }
}
