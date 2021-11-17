import { MainService } from './main.service';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl, niftyKey, blockchainInfo} from '../config/main.config.const';
import { IMenuGroups } from '../components/footer/footer.interface';
import { IPresentation, IArtwork, meta, IAuction } from '../components/slider/presentation.interface';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, scan } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as auctionJson from 'src/assets/data/auction.json';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private subjectAuction: BehaviorSubject<IAuction> = new BehaviorSubject<IAuction>(null);
  private dataStore: { auctions: IAuction } // store our data in memory

  constructor(public httpClient: HttpClient, public mainService: MainService) {
 
  }


  

  fetchAuctionFromMain(tokenId: number, auctionId: number) {

    return new Observable((observer) => {
      this.mainService.fetchSingleArtwork(tokenId).subscribe((response: IArtwork) => {
        let artwork = response
        this.httpClient.get<IAuction []>(`${baseUrl.mainUrl}/get-auction-info/${tokenId}/${auctionId}`, baseUrl.headers).subscribe(data => {
          let item = data['data'] 
          observer.next({
            "auctionId": item.auctionId,
            "cancelled": item.cancelled,
            "currentBlock": item.currentBlock,
            "startBlock": item.startBlock,
            "endBlock": item.endBlock,
            "highestBid": item.highestBid,
            "highestBidder": item.highestBidder,
            "bids": item.bids,
            "isActive": item.isActive,
            "owner": item.owner,
            "sellNowPrice": item.sellNowPrice,
            "title": artwork.symbol,
            "currentBid": item.highestBid, //highest bid is always the current bid, if no bid has been made, it is always set to minimum bid
            "currency": "ETH",
            "endDate": item.endDate,
            "startDate": item.startDate,
            "minimumBid": item.minimumBid,
            "tokenId": parseInt(item.tokenId),
            "artwork": artwork,
            "type": "Auction"
        });
          observer.complete();
     
        },err => {
           observer.next(auctionJson['default']);
           observer.complete();
        })
      })
    });
   
  }

  startAuctionNifty(auctionId: number, tokenId: number, startDate: any, endDate: any) {
    console.log('tk', tokenId)
    console.log('auction', auctionId)
    console.log('startD', startDate)
    console.log('endD', endDate)
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${baseUrl.mainUrl}start-auction`, 
    {tokenId: tokenId,
      auctionId: auctionId,
      startDate: startDate,
      endDate: endDate
    },  {headers})
  }

  checkIssuer(issuerAddress) {
    let issuer = issuerAddress.toLowerCase();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.get(`${baseUrl.mainUrl}is-issuer/${issuer}`, {headers})
  }

  getETHtoUSDValue() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('X-API-Token', blockchainInfo.key);
    return this.httpClient.get(`${blockchainInfo.url}/tickers/ETH-USD`, {headers})
  }

}
