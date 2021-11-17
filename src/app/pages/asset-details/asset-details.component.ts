import { UserActionsService } from './../../core/services/userActions.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuction, IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { trigger, transition, animate, style } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuctionService } from 'src/app/core/services/auction.service';
import * as moment from 'moment';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class AssetDetailsComponent implements OnInit {
  distance: number; countdownDay: number; countdownHours: number;
  countdownMinutes: number; countdownSeconds: number; visible: boolean = true;
  account: string; balance: number = 0; amount: number; owner: boolean;
  auctionId: number; currentBlock: any; startDate: any; endDate: any; sellNowPrice: number; minimumPrice: number;
  auctionTime: any; currentTime: any; auctionValue: number; response: any; error: any; displayOverlay: boolean = false;
  email: string; firstName: string; lastName: string; middleName: string; phone: number;
  country: string; zipCode: string; state: string; city: string; street: string; houseNumber: string;
  
  
 

  constructor(private router: Router, public activatedRoute: ActivatedRoute, public metamaskService: MetamaskService, public mainService: MainService,
    public userActions: UserActionsService,  private spinner: NgxSpinnerService, private auctionService: AuctionService) { }
  auction: IAuction = {"auctionId": 0,"cancelled": false,"currentBlock": 0,"startBlock": 0,"endBlock": 0,"highestBid": 0,"highestBidder": "", "bids": [{bidder: "", bid: 0, auctionId: 0}],"isActive": true,
    "owner": "","sellNowPrice": 0,"title": "","currentBid": 0,"currency": "","endDate": new Date(),"startDate": new Date(),"minimumBid": 0,"tokenId": 0,
    "artwork": {"id": "","category": "","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "","collections": [],"type": ""},
      "featuredImage": {"media": "","mediaType": 0},"isBidding": true,"gallery": [{"media": "","mediaType": 0}],"description": "","price": 0,"currency": "",
      "dateIssued": new Date(),"hasActiveAuction": true, "lastAuctionId": 0,"likes": 0,"sold": false,"name": "","tokenId": 0,"symbol": "","type": ""},"type": ""};
  artwork: IArtwork = {"id": "","category": "","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "",
      "collections": [],"type": ""},"featuredImage": {"media": "","mediaType": 0},"isBidding": true, "gallery": [{ "media": "",
      "mediaType": 0 }], "description": "", "price": 0, "currency": "", "dateIssued": new Date(), "hasActiveAuction": true, "lastAuctionId": 0, "likes": 0, "sold": false, "name": "", "tokenId": 0, "symbol": "", "type": ""};
    
  async ngOnInit(): Promise<void> {
    await this.metamaskService.openMetamask().then(result => {
      this.account = result.account;
      this.balance = result.balance;
      this.checkBuyer();
      let tokenId = this.activatedRoute.snapshot.params.asset;
      let auctionId = this.activatedRoute.snapshot.params.auction;
      this.auctionService.fetchAuctionFromMain(tokenId, auctionId).subscribe((res: IAuction) => {
        this.artwork = res.artwork;
        this.auction = res;
        this.auctionService.getETHtoUSDValue().subscribe(res => {
          if (this.auction.bids.length > 0) {
            this.auctionValue = res['last_trade_price'] * this.auction.bids[0]['bid'];
          } else {
            this.auctionValue = res['last_trade_price'] * this.auction.highestBid;
          }
        
        })
        if (this.account.toLowerCase() === this.artwork.owner.username.toLowerCase()){
          this.owner = true;
        }
        this.setCountDown(this.auction.endDate);
                 
      })
    })
  }

    setCountDown(date) {
      this.auctionTime =  moment(new Date(date).getTime()).unix();
      this.currentTime = moment(new Date().getTime()).unix();
      const diffTime = this.auctionTime - this.currentTime;
      let duration;
      duration = moment.duration(diffTime * 1000, 'milliseconds');
      const interval = 1000;

      setInterval(() => {
        duration = moment.duration(duration - interval, 'milliseconds');
        this.countdownDay = moment.duration(duration).days();
        this.countdownHours = moment.duration(duration).hours();
        this.countdownMinutes = moment.duration(duration).minutes();
        this.countdownSeconds = moment.duration(duration).seconds();
      }, interval);
      
    }

  openForm() {
    this.visible = true;
  }

  bid() {
    if (this.response === 404) {
      this.displayOverlay = true;
      return;
    }
    let currentBid = this.auction.highestBid;
    if (this.balance < this.amount ) {
      this.userActions.addSingle('error', 'Failed', 'You currently do not have enough balance to buy at this price, please fund your wallet and try again.');
      return;
    } else if (this.balance < currentBid)  {
      this.userActions.addSingle('error', 'Failed', 'You currently do not have enough balance to buy at this price, please fund your wallet and try again.');
      return;
    } else if (this.amount < currentBid) {
      this.userActions.addSingle('error', 'Failed', 'You cannot Bid less than the minimum acceptable bid for this asset');
      return;
    }

    if (!this.amount) {
      this.userActions.addSingle('error', 'Failed', 'Please confirm you have entered your bidding price for this asset.');
      return;
    }
    this.spinner.show();
    this.metamaskService.placeBid(this.artwork.tokenId, this.auction.auctionId, this.amount).then(data => {
      setTimeout(() => {
        this.auctionService.fetchAuctionFromMain(this.artwork.tokenId, this.artwork.lastAuctionId).subscribe((data: IAuction) => {
          this.auction = data;
          this.spinner.hide();
          this.userActions.addSingle('Success', 'Successful', 'Bid placed successfully');
          
        })
      }, 15000);
      }, err => {
        this.spinner.hide();
    })

  }

  async startAuction(auction: NgForm, tokenId) {
    const minBid = auction.value.minimumPrice;
    const sell =  auction.value.sellNowPrice;
    if (sell < minBid) {
      this.userActions.addSingle('error', 'Failed', 'Please enter a sell-now price greater than or equal to your minimum bid');
      return;
    }
    this.spinner.show();
    this.metamaskService.getCurrentBlock().subscribe(res => {
      this.currentBlock = res['data'];
      let startDate = new Date(auction.value.startDate);
      let endDate = new Date(auction.value.endDate)
      let currentDate = Date.now();

      let initialStart: number = Math.abs(Math.floor((currentDate - startDate.getTime()) / 1000 / 60 / 60 / 24));
      let initialEnd: number = Math.abs(Math.floor((currentDate - endDate.getTime()) / 1000 / 60 / 60 / 24));
      let startBlock: number = this.currentBlock + ((initialStart * 24 * 60 * 60)/3);
      let endBlock: number = this.currentBlock + ((initialEnd * 24 * 60 * 60)/3) ;
      let sellNow: string =  sell.toString();
      let minimumPrice: string =  minBid.toString();
      var rndNo: number = Math.round((Math.random() * 1000000)) + 1;
      this.auctionId = rndNo;

      this.metamaskService.startAuction(this.artwork.tokenId, this.auctionId, startBlock, endBlock, this.currentBlock, sellNow, minimumPrice).then( res => {
        setTimeout(() => { 
          this.auctionService.startAuctionNifty(this.auctionId, this.artwork.tokenId, startDate, endDate).subscribe(data => {
          this.userActions.addSingle('success', 'successful', 'Auction has been started for this asset');
          this.visible = false;
          this.spinner.hide();
        }, err =>  {
          this.spinner.hide();
        })
      }, 15000)
        

      }, err => {
        this.spinner.hide()
      })
    }, err => {
      this.spinner.hide()
    })
    
  }

  withdraw() {
    this.spinner.show();
    this.metamaskService.withdraw(this.artwork.tokenId, this.auctionId).then( res => {
      this.spinner.hide();
    })
  }

  checkBuyer() {
    this.mainService.getBuyerStatus(this.account).subscribe(res => {
      this.response = res;
    },
    error => {
      this.response = error['error'];
      this.response = error['error']['data']['statusCode'];
    })
  }

    register(register: NgForm) {
      const email = register.value.email;
      const firstName = register.value.firstName;
      const middleName = register.value.middleName;
      const lastName = register.value.lastName;
      const phone = register.value.phone;
      const country = register.value.country;
      const zipCode = register.value.zipCode;
      const state = register.value.state;
      const city = register.value.city;
      const street = register.value.street;
      const houseNumber = register.value.houseNumber;
      const blockchainAddress = this.account;
      if (email === undefined || phone === undefined  || firstName === undefined || middleName === undefined || 
        lastName === undefined || country === undefined ||
        zipCode === undefined || state === undefined || city === undefined || street === undefined || houseNumber === undefined) {
          this.userActions.addSingle('error', 'successful', 'Please make sure all fields are completed and correct.');
        this.displayOverlay = true;
      }
      this.spinner.show();
      this.mainService.saveBuyer(email, phone, firstName, lastName, middleName, blockchainAddress,
        country, zipCode, state, city, street, houseNumber).subscribe(res => {
        if (res['status'] === 'success') {
          this.spinner.hide();
          this.userActions.addSingle('success', 'successful', 'Buyer has been registered successfully!');
          this.checkBuyer();
          this.ngOnInit;
        }
      }, err => {
        this.error = err.error.data.error;
        this.spinner.hide();
        this.userActions.addSingle('error', 'error', this.error);
        this.checkBuyer();
      })
    }
    

  

}
