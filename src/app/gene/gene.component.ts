import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css']
})
export class GeneComponent implements OnInit{
  abb: string | null | undefined= '';
  name!:string | null;
constructor(
  private router: ActivatedRoute,
  private apiService: ApiService,
){
  this.router.params.subscribe(params => {this.name = params['name'];});
    this.router.params.subscribe(params => {this.abb = params['abb'];});

}
ngOnInit(): void {


}
}
