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
  }
  getName(){
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
