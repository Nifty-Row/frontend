import { Component, OnInit } from '@angular/core';
import { AssetsService } from '../services/assets.service';
import { Router } from '@angular/router';



declare var $: any;

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {
  assets: any;
  orderStrategy: any;
  assetChosen: any;
  amount: any;
  price: any;
  error: any;
  primaryMarket: any;
  secondaryMarket: any[];
  userId: number;
  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('userId')) {
      this.userId = parseInt(localStorage.getItem('userId'));
    }
    
    this.getAssets();
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          init.push(element);
        } else if (element.market === 1 && element.approved === 1) {
          second.push(element);
        }
      });
      this.primaryMarket =  init ;
      this.secondaryMarket = second;
      this.assetService.stopSpinner();
      console.log('this is primary market', this.secondaryMarket)
    }, err => {
      this.assetService.stopSpinner();
      console.log(err.error.data.error);
      this.error = err.error.data.error;
    });
  }

  viewBuy(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }

  viewSell(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }

  viewOrder(tokenId) {
    this.router.navigateByUrl('/asset-order', { state : {tokenId: tokenId} });
  }

  logout() {
    this.router.navigateByUrl('/login');
  }

  signup() {
    this.router.navigateByUrl('/register');
  }

  goToAllAssets(page) {
    this.router.navigateByUrl('/assets', { state : { from: page} });
  }

}