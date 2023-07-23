import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  myControl = new FormControl('');
  genomes$!: string[];
  name: string = '';
  filter_genomes$!: Observable<string[]>;

  private breakpointObserver = inject(BreakpointObserver);
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.name = params['name'];
    });
  }

  ngOnInit(): void {
    this.apiService.getGenomes(this.name).subscribe(data => {
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
}
