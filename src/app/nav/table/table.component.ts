import { MessageService } from './../../message.service';
import { ApiService } from 'src/app/api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { G4 } from 'src/app/pojo/G4';
import { NgOptimizedImage } from '@angular/common'


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
    this.ApiService.getG4displot(this.abb, this.chromosome, this.direction, 2, 100000).subscribe(data => {
      this.g4_img = URL.createObjectURL(data);
    });
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
      this.ApiService.getG4displot(this.abb, this.chromosome, this.direction, 2, 100000).subscribe(data => {
        this.g4_img = URL.createObjectURL(data);
      });
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    URL.revokeObjectURL(this.g4_img);

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
//TODO 1. 给图片生成添加控制台,可以选择,片段大小和ts的数量,做数值检查,从后台获取最大片段长度,商讨最小片段长度
//TODO 2. 图片的获取逻辑,重新检查.(刷新,点击染色体,点击direction).获取新图片时,先屏蔽旧图片.研究他人代码https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5
//TODO 3. 优化图片的显示,根据片段的数量来决定图片的宽度.
//TODO 4. python代码,图片生成时,如果数据库为空.则返回空图片,然后前端进行判断,如果是空图片,则不显示图片,并且显示提示信息.
//TODO 5. 研究图片虚拟横向滚动
//TODO 6. 研究前端生成displot
