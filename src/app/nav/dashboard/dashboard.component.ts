import { ApiService } from 'src/app/api.service';
import { MessageService } from './../../message.service';
import { Component, OnInit, inject } from '@angular/core';

import { SearchResult } from 'src/app/pojo/SearchResult';
import { Species } from 'src/app/pojo/Species';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  panelOpenState = false;
  species!: SearchResult;
  speciesInfo!: Species;
  abb!: string;


  constructor(
    private MessageService: MessageService,
    private ApiService: ApiService,
    private router: ActivatedRoute
  ) {
    this.router.parent?.params.subscribe(params => {this.abb = params['abb'];this.ApiService.getSpeciesInfo(params['abb']).subscribe(speciesInfo => {
      this.speciesInfo = speciesInfo;
    }); });
    // this.species = this.MessageService.getName();

  }

  ngOnInit(): void {
    // this.species = this.MessageService.getName();
    // this.getSpeciesInfo();
  }

  // getSpeciesInfo(): void {

  //   this.ApiService.getSpeciesInfo(this.species.abbreviation).subscribe(speciesInfo => {
  //     this.speciesInfo = speciesInfo;
  //   });
  // }
}
