import { MainService } from './../../core/services/main.service';
import { IUser } from './../user-dashboard/user.interface';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {
  creators: IUser [] = [{
    "userId": 1,
    "username": "",
    "walletAddress": "",
    "email": "",
    "socials": {},
    "followers": [],
    "following": [],
    "likes": [],
    "createdArtworks": [],
  "collections": [],
  "bids": [],
  "isActive": true,
  "aboutInfo": "",
  "displayImage": "",
  "coverImage": "",
  "webUrl": {"url": "", "title": ""},
  "assetTotalValue": 0,
  "joinDate": "",
  "type": ""
  }];
  currentPage: any;
  displayImage: string;
  constructor(public mainService: MainService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.displayImage = "/assets/img/user-profile-default-image.png";
    console.log('this', this.creators)
    this.spinner.show();
    this.mainService.getCreators().subscribe((result: IUser []) => {
      if (result !== undefined) {
        this.creators = result;
      }
      this.spinner.hide();
    })
    this.spinner.hide();
  }

  byId(index, item) {
    return item.id;
  }

  loadMore() {
    this.currentPage = this.currentPage + 1;
    // this.mainService.fetchArtWorkFromMain(this.currentPage, this.itemCount);
  }

}
