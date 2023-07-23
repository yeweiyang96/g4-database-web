import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { SearchResult } from '../pojo/SearchResult';
import {FormControl} from '@angular/forms';
import { Search } from '../pojo/Search';


@Component({
  selector: 'app-homesearch',
  templateUrl: './homesearch.component.html',
  styleUrls: ['./homesearch.component.css']
})
export class HomesearchComponent implements OnInit{
  myControl = new FormControl();
  species$!: Observable<SearchResult[]>;
  private searchTerms = new Subject<Search>();
  selected = 'species';

  constructor(private apiService: ApiService) { }

  search(term: string): void {
    if (this.selected === 'gene'){
      term = term.toUpperCase();
    }
    this.searchTerms.next({term: term, type: this.selected});
  }

  ngOnInit(): void {

    this.species$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((search: Search) => this.apiService.search(search)),
    );
  }

  onSelected(event: any) {
    this.selected = event.value;
    this.myControl.setValue('');
  }

}
