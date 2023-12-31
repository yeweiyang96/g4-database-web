import { MessageService } from './../message.service';
import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';

import { FormControl } from '@angular/forms';
import { SearchResult } from '../pojo/SearchResult';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  myControl = new FormControl('');
  genomes$!: string[];
  // species!: SearchResult;
  filter_genomes$!: Observable<string[]>;
  abb!: string;
  name!: string;

  private breakpointObserver = inject(BreakpointObserver);
  constructor(
    private apiService: ApiService,
    private router: ActivatedRoute,
    private MessageService: MessageService
    ) {
      this.abb = String(this.router.snapshot.paramMap.get('abb'));
      this.MessageService.setName({name: this.name,abbreviation: this.abb});
    }

  ngOnInit(): void {

    this.apiService.getName(this.abb).subscribe(data => {
      this.name = data;
      // this.MessageService.setName({name: this.name,abbreviation: this.abb});
    });

    this.apiService.getGenomes(this.abb).subscribe(data => {
      this.genomes$ = data;
      this.filter_genomes$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });


  }


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (value == '') {
      return this.genomes$;
    }
    return this.genomes$.filter(option => {
      return option.toLowerCase().includes(filterValue);
    });
  }

  onClick(genome: string) {
    this.MessageService.chromosome$.next(genome);
  }
}
