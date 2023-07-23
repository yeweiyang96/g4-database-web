import { Injectable } from '@angular/core';
import { SearchResult } from './pojo/SearchResult';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  name: SearchResult = {name: '', abbreviation: ''};
  setName(name: SearchResult){
    this.name = name;
  }
  getName(){
    return this.name;
  }

  constructor() { }
}
