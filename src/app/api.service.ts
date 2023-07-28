import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, of } from 'rxjs';
import { SearchResult } from './pojo/SearchResult';

import { Search } from './pojo/Search';
import { Species } from './pojo/Species';
import { G4 } from './pojo/G4';
import { Gene } from './pojo/Gene';
import { G4_SEQ } from './pojo/G4_SEQ';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://192.168.86.29:8000';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  search(search: Search): Observable<SearchResult[]> {
    if (!search.term.trim()) {
      // if not search term, return empty array.
      return of([]);
    } else if (search.type === 'gene' && search.term.length < 2) {
      return of([]);
    }
    return this.http.get<SearchResult[]>(`${this.apiUrl}/${search.type}/${search.term}`);
  }

  getGenomes(name: string): Observable<string[]> {
    const url = `${this.apiUrl}/genomes/${name}`;
    return this.http.get<string[]>(url);
  }

  getSpeciesInfo(abb: string): Observable<Species> {
    const url = `${this.apiUrl}/species_info/${abb}`;
    return this.http.get<Species>(url);
  }

  // get Species full name
  getName(abb: string): Observable<string> {
    const url = `${this.apiUrl}/abbtofull/${abb}`;
    return this.http.get<string>(url);
  }

  getG4Date(
    abb: string,
    genome: string,
    direction: string,
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<G4[]> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortfield', `${sortField}`)
      .append('sortorder', `${sortOrder}`);
    if (filters.entries.length > 0) {
      filters.forEach(filter => {
        filter.value.forEach(value => {
          params = params.append(filter.key, value);
        });
      });
    }
    return this.http
      .get<G4[]>(`${this.apiUrl}/g4/${abb}_${genome}_${direction}`, { params })
      .pipe(catchError(() => of([])));
  }

  getTableSize(abb: string,
    genome: string,
    direction: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/g4_size/${abb}_${genome}_${direction}`);
  }

  getGene(abb: string, name: string): Observable<Gene> {
    console.log(`${this.apiUrl}/gene/${abb}/${name}`);

    return this.http.get<Gene>(`${this.apiUrl}/gene/${abb}/${name}`);
  }

  getG4SEQ(abb: string, genome: string, name: string): Observable<G4_SEQ> {
    return this.http.get<G4_SEQ>(`${this.apiUrl}/g4_seq/${abb}/${genome}/${name}`);
  }

  getG4displot(abb: string,genome: string, direction: string, ts: number, length: number): Observable<Blob> {
    let params = new HttpParams()
    .append('ts', `${ts}`)
    .append('length', `${length}`);
    return this.http.get(`${this.apiUrl}/g4_displot/${abb}/${genome}/${direction}`, { params, responseType: 'blob' });
  }
}
