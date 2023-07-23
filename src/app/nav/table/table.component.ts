import { MessageService } from './../../message.service';
import { ApiService } from 'src/app/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
  abb: string = '';
  chromosome: string = '';
  direction: string = 'raw';
  chromosome$: Observable<string> | undefined;


  constructor(
    private ApiService: ApiService,
    private router: ActivatedRoute,
    private MessageService: MessageService
  ) {
    this.MessageService.chromosome$.subscribe(data => {
      this.chromosome = data;
    });


  }

  ngOnInit() {
    this.chromosome = String(this.router.snapshot.params['genome']);


  }

  activeLink = 'raw';
}
