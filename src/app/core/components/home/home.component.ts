import { AuctionService } from './../../services/auction.service';
import { Component, OnInit } from '@angular/core';
import { IBlogGroup } from '../blog/blog.interfaces';
import { IArtwork, IPresentation } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slide: IPresentation;
  blogs: IBlogGroup;
  artworks: IArtwork [];
  categoryToIds: Map<string, Array<number> >
  constructor(public mainService: MainService, public auctionService: AuctionService) { }

  ngOnInit() {
     this.mainService.getPresentation().subscribe((res: IPresentation) => {
    this.slide = res;
  })
    this.mainService.returnArtwork().subscribe((data: IArtwork []) => {
      this.artworks = data;
    })
   this.mainService.getBlogPost().subscribe((data: IBlogGroup) => {
     this.blogs = data;
   })
   // do an object compare on the mainService calls before calling preloader after first call
  
  
  }

 

}
