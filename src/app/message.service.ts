import { Injectable } from '@angular/core';
import { SearchResult } from './pojo/SearchResult';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  name: SearchResult = {name: '', abbreviation: ''};
  chromosome$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  setName(name: SearchResult){
    this.name = name;
    console.log("Service: "+this.name.abbreviation);
  }
  getName(){
    console.log("getService: "+this.name.abbreviation);
    return this.name;
  }

  // setChromosome(chromosome: string){
  //   this.chromosome = chromosome;
  // }
  // getChromosome(){
  //   return this.chromosome;
  // }

  constructor() { }
}
