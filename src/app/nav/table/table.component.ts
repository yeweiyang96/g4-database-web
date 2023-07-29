import { MessageService } from './../../message.service';
import { ApiService } from 'src/app/api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { G4 } from 'src/app/pojo/G4';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',

  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
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
  g4_img!: any;
  ts = new FormControl(2);
  length = new FormControl(100000);
  img_loading = true;

  constructor(
    private ApiService: ApiService,
    private router: ActivatedRoute,
    private MessageService: MessageService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.router.params.subscribe(params => { this.chromosome = params['genome']; });
    this.router.parent?.params.subscribe(params => { this.abb = params['abb']; });
    this.ts.setValue(2);
    this.length.setValue(100000);
    this.MessageService.chromosome$.subscribe(_ => {
      this.g4_img = null;
      this.ts.setValue(2);
      this.length.setValue(100000);
      this.loadDataFromServer(this.abb, this.chromosome, this.direction, this.pageIndex, this.pageSize, null, null, []);
      this.getImg();
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    URL.revokeObjectURL(this.g4_img);

  }

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
    this.getImg();
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.G4Date = this.G4Date.filter((item: G4) => item.SEQ.indexOf(this.searchValue) !== -1);
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

  getImg(): void {
    this.ApiService.getG4displot(this.abb, this.chromosome, this.direction, this.ts.value, this.length.value).subscribe(data => {

      if (data.size < 3) {
        // this.ts.setValue(2);
        // this.length.setValue(100000);
        this._snackBar.open("Error", "Close");
        this.img_loading = true;
      }
      else {
        this.g4_img = URL.createObjectURL(data);
        this.img_loading = false;
      }

    });
  }
}
//TODO 5. 研究图片虚拟横向滚动
//TODO 6. 研究前端生成displot
