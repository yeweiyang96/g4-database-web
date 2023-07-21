import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { Species } from '../pojo/Species';

import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-homesearch',
  templateUrl: './homesearch.component.html',
  styleUrls: ['./homesearch.component.css']
})
export class HomesearchComponent implements OnInit{
  myControl = new FormControl('');
  species$!: Observable<Species[]>;
  private searchTerms = new Subject<string>();
  selected = 'Species';

  constructor(private apiService: ApiService) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {

    this.species$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.apiService.searchSpecies(term)),
    );
  }

  onSelected(event: any) {
    this.selected = event.value;
    this.apiService.switchSearch(event.value);
  }

}
