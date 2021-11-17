import { Component, OnInit, Input, OnChanges, NgZone,  SimpleChanges, ChangeDetectorRef  } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IArtwork } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-assets-grid',
  templateUrl: './assets-grid.component.html',
  styleUrls: ['./assets-grid.component.scss'],

})
export class AssetsGridComponent implements OnInit {
  artworks: IArtwork [];
  work: any [];
  @Input() public artworkArray: IArtwork [];
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  categories: string[];
  chinedu: {
    ogu: any[];
  }

  constructor(public mainService: MainService) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artworkArray'] && this.artworkArray !== null) {
      if (this.artworkArray !== null) {
        this.artworks = this.artworkArray;
        this.categories = this.artworks.map(item => item.category)
        .filter((value, index, self) => self.indexOf(value) === index);
      }
    }
    this.mainService.getMeta().subscribe(res => {
      if (res !== null) {
        this.currentPage = res.currentPage;
        this.itemCount = res.itemCount;
        this.itemsPerPage = res.itemsPerPage
        this.totalItems = res.totalItems
        this.totalPages = res.totalPages
      }
    })
    
  }
  


  categoryFilter(category: string) {
    this.artworkArray = this.artworks.filter(item => {
      return item.category === category;
    });
  }

  
  

  byId(index, item) {
    return item.id;
  }


  loadMore(page, count) {
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchArtWorkFromMain(this.currentPage, this.itemCount);
  }

}
