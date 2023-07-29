import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Gene } from '../pojo/Gene';
import { Observable } from 'rxjs';
import { G4_SEQ } from '../pojo/G4_SEQ';
import { G4 } from '../pojo/G4';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css']
})
export class GeneComponent implements OnInit {
  abb!: string;
  name!: string;
  gene!: Gene;
  RawColumns: string[] = ['ID', 'Position 1', 'Position 2', 'Position 3','Position 4','Number of tetrads','G-Score','Sequence\n(G-rich)','Gene','Promoter'];
  ComplementColumns: string[] = ['ID', 'Position 1', 'Position 2', 'Position 3','Position 4','Number of tetrads','G-Score','Sequence','Reverse Complement\n(C-Rich)','Gene','Promoter'];
  table!:G4_SEQ;
  dataSource_raw!:G4[];
  dataSource_complement!:G4[];
  constructor(
    private router: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.router.params.subscribe(params => { this.name = params['name']; });
    this.router.params.subscribe(params => { this.abb = params['abb']; });

  }
  ngOnInit(): void {
    this.apiService.getGene(this.abb, this.name).subscribe(data => {
      this.gene = data;
      this.apiService.getG4SEQ(this.abb, this.gene.chrname, this.name).subscribe(data => {
        this.table = data;
        this.dataSource_raw = this.table.raw;
        this.dataSource_complement = this.table.c;
      });
    });


  }

  location(value: string): string {
    return value.replace(/_/g, ' ');
  }
  g4_gene(gene: string[]): string[][] {
    return gene.map(g => g.split(':'));
  }

  reverse_complement(seq: string): string {
    let complementSeq = '';
    for (let i = 0; i < seq.length; i++) {
      switch (seq[i]) {
        case 'A':
          complementSeq += 'T';
          break;
        case 'T':
          complementSeq += 'A';
          break;
        case 'C':
          complementSeq += 'G';
          break;
        case 'G':
          complementSeq += 'C';
          break;
        default:
          complementSeq += seq[i];
          break;
      }
    }
    return complementSeq.split('').reverse().join('');
  }

  isComplement(sign: string): string {
    if (sign === '1') {
      return '+';
    } else if (sign === '-1') {
      return '-';
    }
    return '';
  }


}
