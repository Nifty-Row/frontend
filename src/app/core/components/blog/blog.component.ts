import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { IBlogGroup } from './blog.interfaces';
import {SelectItem} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnChanges {
  @Input() public blog: IBlogGroup;
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
 

  constructor() { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '768px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }

  // ngOnInit() {
  
  // }

  ngOnChanges() {

  }


}
