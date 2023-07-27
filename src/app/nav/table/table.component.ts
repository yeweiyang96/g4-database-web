import { MessageService } from './../../message.service';
import { ApiService } from 'src/app/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { G4 } from 'src/app/pojo/G4';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  abb!: string;
  chromosome!: string;
  direction: string = 'raw';
  activeLink = 'raw';
  total = 1;
  G4Date: G4[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  searchValue = '';
  visible = false;


  loadDataFromServer(
    abb: string,
    genome: string,
    direction: string,
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.ApiService.getTableSize(abb, genome, direction).subscribe(data => {
      this.total = data;
    });
    this.ApiService.getG4Date(abb, genome, direction, pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
      this.loading = false;

      this.G4Date = data;
    });

  }

  onQueryParamsChange(params: NzTableQueryParams): void {

    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(this.abb, this.chromosome, this.direction, pageIndex, pageSize, sortField, sortOrder, filter);
  }

  onClick(direction: string): void {
    this.direction = direction;
    this.loadDataFromServer(this.abb, this.chromosome, direction, this.pageIndex, this.pageSize, null, null, []);
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.G4Date = this.G4Date.filter((item: G4) => item.SEQ.indexOf(this.searchValue) !== -1);
  }


  constructor(
    private ApiService: ApiService,
    private router: ActivatedRoute,
    private MessageService: MessageService
  ) {

  }

  ngOnInit() {
    this.router.params.subscribe(params => { this.chromosome = params['genome']; });
    this.router.parent?.params.subscribe(params => { this.abb = params['abb']; });
    this.MessageService.chromosome$.subscribe(_ => {
      this.loadDataFromServer(this.abb, this.chromosome, this.direction, this.pageIndex, this.pageSize, null, null, []);
    });
  }

  g4_gene(gene: string[]): string[][] {
    return gene.map(g => g.split(':'));
  }

  complement(seq: string): string {
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
    return complementSeq;
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
