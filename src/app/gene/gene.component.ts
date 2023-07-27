import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Gene } from '../pojo/Gene';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css']
})
export class GeneComponent implements OnInit {
  abb!: string;
  name!: string;
  gene$!: Observable<Gene>;
  constructor(
    private router: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.router.params.subscribe(params => { this.name = params['name']; });
    this.router.params.subscribe(params => { this.abb = params['abb']; });

  }
  ngOnInit(): void {
    console.log(this.abb+">>>"+this.name);
    this.gene$ = this.apiService.getGene(this.abb, this.name);

  }

}
