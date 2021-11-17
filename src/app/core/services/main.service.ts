import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl, niftyKey} from '../config/main.config.const';
import { IMenuGroups } from '../components/footer/footer.interface';
import { IPresentation, IArtwork, meta, IAuction } from '../components/slider/presentation.interface';
import { INavButton } from '../components/header/header.interface';
import * as headerJson from 'src/assets/data/navbar.json'
import * as footerJson from 'src/assets/data/footer.json'
import * as presentationJson from 'src/assets/data/presentation.json';
import * as artWorkJson from 'src/assets/data/artwork.json';
import * as blogJson from 'src/assets/data/blog.json';
import * as navButtons from 'src/assets/data/navButtons.json';
import * as userJson from 'src/assets/data/user.json';
import * as creatorJson from 'src/assets/data/creators.json';
import * as categoryJson from 'src/assets/data/categories.json';
import * as assetTypeJson from 'src/assets/data/assetTypes.json';
import * as landingJson from 'src/assets/data/landing.json';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { IBlogGroup } from '../components/blog/blog.interfaces';
import { IUser } from 'src/app/pages/user-dashboard/user.interface';
import { IAssetCategory, IAssetType } from 'src/app/components/createArtwork.interface';
import { ILandingData } from 'src/app/pages/landing/landing.interface';


@Injectable({
  providedIn: 'root'
})
export class MainService {
  private subjectNftCard: BehaviorSubject<IArtwork []> = new BehaviorSubject<IArtwork []>(null);
  private subjectSingleArtwork: BehaviorSubject<IArtwork> = new BehaviorSubject<IArtwork>(null);
  private subjectNftMeta: BehaviorSubject<meta> = new BehaviorSubject<meta>(null);
  private subjectOwnerNftMeta: BehaviorSubject<meta> = new BehaviorSubject<meta>(null);
  private subjectOwnerNFT = new BehaviorSubject<IArtwork []>(null);
  private subjectBlogPost: BehaviorSubject<IBlogGroup> = new BehaviorSubject<IBlogGroup>(null);
  private dataStore: { artworks: IArtwork[] } = { artworks: [] }; // store our data in memory
  private ownerDataStore: { ownerArtworks: IArtwork[] } = { ownerArtworks: [] }; // store our data in memory
  presentationResponse: IPresentation;
  buttonsResponse: INavButton;
  userResponse: IUser;
  creatorResponse: IUser;
  footerResponse: IMenuGroups;
  headerResponse: IMenuGroups;
  categoriesResponse: IAssetCategory;
  assetTypeResponse: any;
  landingResponse: ILandingData;
  
  constructor(public httpClient: HttpClient) {
   }


  fetchArtWorkFromMain(page: number, limit: number) {
    this.httpClient.get<IArtwork []>(`${baseUrl.mainUrl}/list-tokens?page=${page}&limit=${limit}`, baseUrl.headers).pipe(map(res => {
      res['data']['items'].forEach((item) =>  this.dataStore.artworks.push({
        id: item.id,
        category: item.category,
        tags: item.tags,
        owner: {
          id: item.id,
          image: item.media[0].media,
          username: item.owner
        },
        creator: {
          id: item.id,
          image: item.media[0].media,
          username: item.issuer,
          type: item.type
        },
        featuredImage: {
          media: item.media[0].media,
          mediaType: 0
        },
        isBidding: item.hasActiveAuction,
        gallery: item.media,
        description: item.description,
        price: 0,
        currency: item.currency,
        likes: 0,
        hasActiveAuction: item.hasActiveAuction,
        lastAuctionId: item.lastAuctionId,
        symbol: item.symbol,
        name: item.name,
        tokenId: parseInt(item.tokenId),
        dateIssued: new Date(parseInt(item.dateIssued)*1000),
        sold: item.sold,
        type: item.type
    }
    ));
      this.subjectNftMeta.next(res['data']['meta']);
    })).subscribe(data => {
      this.subjectNftCard.next(Object.assign({}, this.dataStore).artworks.filter(item => item.hasActiveAuction));
 
    },err => {
      this.subjectNftCard.next(artWorkJson['default']);
    })
   
  }

  fetchSingleArtwork(tokenId: number) {
    return new Observable((observer) => {/* make http request & process */
      this.httpClient.get<IArtwork>(`${baseUrl.mainUrl}/get-token-info/${tokenId}`, baseUrl.headers).subscribe(data => { 
          let item = data['data'];
          observer.next({
            id: item.id,
            category: item.category,
            tags: item.tags,
            owner: {
              id: item.id,
              image: item.media[0].media,
              username: item.owner
            },
            creator: {
              id: item.id,
              image: item.media[0].media,
              username: item.issuer,
              type: item.type
            },
            featuredImage: {
              media: item.media[0].media,
              mediaType: 0
            },
            isBidding: item.hasActiveAuction,
            gallery: item.media,
            description: item.description,
            price: 0,
            currency: item.currency,
            likes: 0,
            hasActiveAuction: item.hasActiveAuction,
            lastAuctionId: item.lastAuctionId,
            symbol: item.symbol,
            name: item.name,
            tokenId: parseInt(item.tokenId),
            dateIssued: item.dateIssued,
            sold: item.sold,
            type: item.type
        });
          observer.complete();
        }, err => {
            observer.next(artWorkJson['default'][0]);
            observer.complete()
        }); /* make sure to handle http error */

    });
  }

  fetchAssetsByOwnerId(account: string, page, limit) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.get(`${baseUrl.mainUrl}/list-tokens/by-owner/${account}?page=${page}&limit=${limit}`, {headers}).pipe(map(res => {
      res['data']['items'].forEach((item) => this.ownerDataStore.ownerArtworks.push({
        id: item.id,
        category: item.category,
        tags: item.tags,
        owner: {
          id: item.id,
          image: item.media[0].media,
          username: item.owner
        },
        creator: {
          id: item.id,
          image: item.media[0].media,
          username: item.issuer,
          type: item.type
        },
        featuredImage: {
          media: item.media[0].media,
          mediaType: 0
        },
        isBidding: item.hasActiveAuction,
        gallery: item.media,
        description: item.description,
        price: 0,
        currency: item.currency,
        likes: 0,
        hasActiveAuction: item.hasActiveAuction,
        lastAuctionId: item.lastAuctionId,
        symbol: item.symbol,
        name: item.name,
        tokenId: parseInt(item.tokenId),
        dateIssued: new Date(parseInt(item.dateIssued)*1000),
        sold: item.sold,
        type: item.type
    }
    ));
      this.subjectOwnerNftMeta.next(res['data']['meta']);
      this.subjectOwnerNFT.next(Object.assign({}, this.ownerDataStore).ownerArtworks);
    })).subscribe(data => {

      // this.subjectOwnerNFT.next(Object.assign({}, this.ownerDataStore).ownerArtworks);
 
    },err => {
      this.subjectOwnerNFT.next(artWorkJson['default']);
    })
   
  }

  getOwnerAssets() {
     return this.subjectOwnerNFT.asObservable();
  }


  issueToken(tokenId: number, medias: any, mediaType: any, dateCreated: any, category: string, description: string, assetType: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${baseUrl.mainUrl}issue-token/`, {
      "tokenId": tokenId,
      "medias": medias,
      "keys": mediaType, 
      "dateIssued": dateCreated,
      "assetType": assetType,
      "description": description,
      "category": category
    },   {headers})
  }

  startAuctionNifty(auctionId: number, tokenId: number, startDate: number, endDate: number) {
    return this.httpClient.post(`${baseUrl.mainUrl}/start-auction`, 
    {tokenId: tokenId,
      auctionId: auctionId,
      startDate: startDate,
      endDate: endDate
    },   baseUrl.headers)
  }


  getMeta() {
    return this.subjectNftMeta;
  }

  getOwnerMeta() {
    return this.subjectOwnerNftMeta;
  }

  returnArtwork() {
    return this.subjectNftCard;
  }

  getFooter() {
    return new Observable((observer) => {

      if (this.footerResponse) {

        observer.next(this.footerResponse);
        observer.complete();

      } else { /* make http request & process */
        this.httpClient.get<IMenuGroups>(baseUrl.testUrl).subscribe((data: IMenuGroups) => {
          this.footerResponse = data; 
          observer.next(this.footerResponse);
          observer.complete();
        }, err => {
            this.footerResponse =  footerJson['default'][0];
            observer.next(this.footerResponse);
            observer.complete()
        }); /* make sure to handle http error */
      }

    });
  }


  getHeader() {
    return new Observable((observer) => {
      if (this.headerResponse) {
        observer.next(this.headerResponse);
        observer.complete();
      } else { 
        this.httpClient.get<IMenuGroups>(baseUrl.testUrl).subscribe((data: IMenuGroups) => {
          this.headerResponse = data; 
          observer.next(this.headerResponse);
          observer.complete();
        }, err => {
            this.headerResponse =  headerJson['default'][0];
            observer.next(this.headerResponse);
            observer.complete()
        });
      }
    });
  }

  getNavButtons() {
    return new Observable((observer) => {
      if (this.buttonsResponse) {
        observer.next(this.buttonsResponse);
        observer.complete();
      } else { 
        this.httpClient.get<INavButton>(baseUrl.testUrl).subscribe((data: INavButton) => {
          this.buttonsResponse = data; 
          observer.next(this.buttonsResponse);
          observer.complete();
        }, err => {
            this.buttonsResponse =  navButtons['default'][0];
            observer.next(this.buttonsResponse);
            observer.complete()
        });
      }
    });
  }

  getUserInfo() {
    return new Observable((observer) => {
      if (this.userResponse) {
        observer.next(this.userResponse);
        observer.complete();
      } else { 
        this.httpClient.get<IUser>(baseUrl.testUrl).subscribe((data: IUser) => {
          this.userResponse = data; 
          observer.next(this.userResponse);
          observer.complete();
        }, err => {
            this.userResponse =  userJson['default'];
            observer.next(this.userResponse);
            observer.complete()
        });
      }
    });
  }

  getCreators() {
    return new Observable((observer) => {
      if (this.creatorResponse) {
        observer.next(this.creatorResponse);
        observer.complete();
      } else { 
        this.httpClient.get<IUser>(baseUrl.testUrl).subscribe((data: IUser) => {
          this.creatorResponse = data; 
          observer.next(this.creatorResponse);
          observer.complete();
        }, err => {
            this.creatorResponse =  creatorJson['default'];
            observer.next(this.creatorResponse);
            observer.complete()
        });
      }
    });
  }


  getAssetCategories() {
    return new Observable((observer) => {
      if (this.categoriesResponse) {
        observer.next(this.categoriesResponse);
        observer.complete();
      } else { 
        this.httpClient.get<IAssetCategory>(baseUrl.testUrl).subscribe((data: IAssetCategory) => {
          this.categoriesResponse = data; 
          observer.next(this.categoriesResponse);
          observer.complete();
        }, err => {
            this.categoriesResponse =  categoryJson['default'];
            observer.next(this.categoriesResponse);
            observer.complete()
        });
      }
    });
  }

  getAssetTypes() {
    return new Observable((observer) => {
      if (this.assetTypeResponse) {
        observer.next(this.assetTypeResponse);
        observer.complete();
      } else { 
        this.httpClient.get<IAssetType>(baseUrl.testUrl).subscribe((data: IAssetType) => {
          this.assetTypeResponse = data; 
          observer.next(this.assetTypeResponse);
          observer.complete();
        }, err => {
            this.assetTypeResponse =  assetTypeJson['default'];
            observer.next(this.assetTypeResponse);
            observer.complete()
        });
      }
    });
  }

  fetchBlogPost() {
    return this.httpClient.get<IBlogGroup>(baseUrl.testUrl).subscribe((data: IBlogGroup) => {
      this.subjectBlogPost.next(data);
    }, err => {
        this.subjectBlogPost.next(blogJson['default'][0]['blogGroup']);
    }); 
  }

  submitWhitelistForm(email: string, firstname: string, lastname: string, 
    amount: number, walletAddress: any, linkedInUrl: string, countryOfOrigin: string,
    linkToTweet: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${baseUrl.icoUrl}`, {
      firstName: firstname,
      lastName: lastname,
      email: email,
      amount: amount,
      wallerAddress: walletAddress,
      linkedInUrl: linkedInUrl,
      countryOfOrigin: countryOfOrigin,
      linkToTweet: linkToTweet,
    },  {headers})
  }

  getBlogPost() {
    return this.subjectBlogPost;
  }

  getPresentation() {
    return new Observable((observer) => {
      if (this.presentationResponse) {
        observer.next(this.presentationResponse);
        observer.complete();

      } else { 
        this.httpClient.get<IPresentation>(baseUrl.testUrl).subscribe((data: IPresentation) => {
          this.presentationResponse = data; 
          observer.next(this.presentationResponse);
          observer.complete();
        }, err => {
            this.presentationResponse =  presentationJson['default'][0];
            observer.next(this.presentationResponse);
            observer.complete()
        });
      }
    });
  }

  getLanding() {
    return new Observable((observer) => {
      if (this.landingResponse) {
        observer.next(this.landingResponse);
        observer.complete();

      } else { 
        this.httpClient.get<ILandingData>(baseUrl.testUrl).subscribe((data: ILandingData) => {
          this.landingResponse = data; 
          observer.next(this.landingResponse);
          observer.complete();
        }, err => {
            this.landingResponse =  landingJson['default'];
            observer.next(this.landingResponse);
            observer.complete()
        });
      }
    });
  }

  saveIssuer(email: string, phone: any, firstname: string, lastname: string, 
    middlename: string, blockchainAddress: any, bankName: string, bankAddress: string,
    accountName: string, accountNumber: number, bankCode: any, IBAN: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${baseUrl.mainUrl}save-issuer/`, {
      "email": email,
      "phoneNumber": phone,
      "firstName": firstname, 
      "middleName": middlename,
      "lastName": lastname,
      "blockchainAddress": blockchainAddress,
      "bankName": bankName,
      "bankAddress": bankAddress,
      "accountName": accountName,
      "accountNumber": accountNumber,
      "bankCode": bankCode,
      "IBAN": IBAN
    },  {headers})
  }

  saveBuyer(email: string, phone: any, firstname: string, lastname: string,
    middlename: string, blockchainAddress: any, country: string, zipCode: any, state: string,
    city: string, street: string, houseNumber: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${baseUrl.mainUrl}save-buyer/`, {
      "email": email,
      "phoneNumber": phone,
      "firstName": firstname, 
      "middleName": middlename,
      "lastName": lastname,
      "blockchainAddress": blockchainAddress,
      "country": country,
      "zipCode": zipCode,
      "state": state,
      "city": city,
      "street": street,
      "houseNumber": houseNumber
    },  {headers})
  }

  checkIssuer(issuerAddress) {
 
    let issuer = issuerAddress.toLowerCase();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.get(`${baseUrl.mainUrl}is-issuer/${issuer}`, {headers})
  }

  getBuyerStatus(walletAddress: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.get(`${baseUrl.mainUrl}/buyer/by-blockchain-address/${walletAddress}`, {headers});
  }
  

 

}
