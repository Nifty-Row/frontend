import { MetamaskService } from './../../core/services/metamask.service';
import { UserActionsService } from './../../core/services/userActions.service';
import { IAssetCategory, IAssetType } from 'src/app/components/createArtwork.interface';
import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { ICreatorMedia } from '../createArtwork.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MainService } from 'src/app/core/services/main.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
 
  preview: any;
  files: File[] = [];
  media: Array<ICreatorMedia> = [];
  mediaType: string[];
  validComboDrag:any
  maxSize: number;
  categories: IAssetCategory;
  assetTypes: IAssetType;
  errorMessage: string;
  categorySelected: string;
  description: string;
  symbol: string;
  typeSelected: string;
  title: string;
  tokenId: number;
  account: string;
  error: string;
  displayOverlay: boolean = false;
  response: any;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  bankName: string;
  bankAddress: string;
  bankCode: string;
  iban: string;
  accountName: string;
  accountNumber: string;
  image: boolean;
  mp3: boolean;
  mp4: boolean;

  constructor( public mainService: MainService, private spinner: NgxSpinnerService, public userActions: UserActionsService,
    public metamaskService: MetamaskService ) { 
   
  }

  ngOnInit(): void {
    this.mediaType = [];
    this.metamaskService.openMetamask().then(result => {
      this.account = result.account;
      this.checkIssuer()
    })
    
    if (this.categories === undefined) {
      // this.spinner.show();
      this.mainService.getAssetCategories().subscribe((result: IAssetCategory) => {
        if (result !== undefined) {
         this.categories = result;
        }
      });
      this.mainService.getAssetTypes().subscribe((result: IAssetType) => {
       if (result !== undefined) {
         this.assetTypes = result;
        }
      //  this.spinner.hide();
     })
    }
  
  }

  register(form: NgForm) {
    this.displayOverlay = false;
    const email = form.value.email;
    const firstName = form.value.firstName;
    const middleName = form.value.middleName;
    const lastName = form.value.lastName;
    const phone = form.value.phone;
    const iban = form.value.iban;
    const bankCode = form.value.bankCode;
    const bankAddress = form.value.bankAddress;
    const accountName = form.value.accountName;
    const accountNumber = form.value.accountNumber;
    const bankName = form.value.bankName;
    if (email === undefined || phone === undefined  || firstName === undefined || middleName === undefined || lastName === undefined ) {
      this.userActions.addSingle('error', 'Failed', 'Please make sure all fields are completed and correct.');
      this.displayOverlay = true;
      return false;
    }
    this.spinner.show();
    this.mainService.saveIssuer(
      email, phone, firstName, lastName, middleName,
      this.account, bankName, bankAddress, accountName,
      accountNumber, bankCode, iban).subscribe(res => {
      if (res['status'] === 'success') {
        this.spinner.hide();
        this.userActions.addSingle('success', '', 'Issuer has been registered successfully');
        this.checkIssuer();
      }
    }, err => {
      // console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.spinner.hide();
      this.userActions.addSingle('error', 'Failed', this.error);
      this.checkIssuer();
    })
  }

  checkIssuer() {
  
    this.mainService.checkIssuer(this.account).subscribe(res => {
      this.response = res;
    },
    error => {
      this.response = error['error'];
    })
  
}

  
  check(file) {
    this.errorMessage = "";
    const fileSize = file.size/1024/1024;
    this.preview = file;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = this.handleFile.bind(this);
 
    if (fileSize > 10) {
      this.errorMessage = "Please Make sure that the file selected is not bigger than 10MB";
      return;
    }
    if ( /\.(jpe?g|gif|png|mp3|mp4)$/i.test(file.name) === false  ) {
      this.errorMessage = "Please select a file type of JPEG, GIF, PNG, MP3 or MP4";
       return;
      } else {
        if (/\.(jpe?g|gif|png)$/i.test(file.name) === true  ) {
          this.image = true;
          this.mediaType.push('image');
        }
        if ( /\.(mp4)$/i.test(file.name) === true  ) { 
          // this.media.push({media: file, mediaType: 1, mediaSizeMB: fileSize});
          this.mp3 = true;
          this.mediaType.push('mp4');
        }
        if ( /\.(mp3)$/i.test(file.name) === true  ) {
          // this.media.push({media: file, mediaType: 2, mediaSizeMB: fileSize});
          this.mp4 = true;
          this.mediaType.push('mp3');
        }
      };
  }

  handleFile(event) {
    var binaryString = event.target.result;
    this.media.push(binaryString);
   }

  remove(index) {
    if (index !== -1) {
      this.media.splice(index, 1);
    } 
  }

  assignPreview(asset) {
    this.preview = asset;
  }


  pickedCategory(value) {
    this.categorySelected = value;

  }

  getAssetType(value) {
    this.typeSelected = value;
  }

  async mint(form: NgForm) {
    if (this.response.data.error === 'Issuer with blockchain address not found') {
      this.displayOverlay = true;
      return;
    }
    if (this.categorySelected === 'artwork' || this.categorySelected === 'movieRight' || this.categorySelected === 'musicRight' || this.categorySelected === 'book' ) {
     } else {
      this.userActions.addSingle('error', 'Failed', 'Please make sure you select a category.');
      return;
    }
    this.symbol = form.value.symbol;
    this.description = form.value.description;
    this.title = form.value.artName;
    if (this.title === null || this.symbol === null) {
      this.userActions.addSingle('error', 'Failed', 'Please fill all fields before submission.');
      return;
    }

    var rndNo:number = Math.round((Math.random() * 1000000)) + 1;
    this.tokenId = rndNo;
    let dateCreated = new Date().getTime();
    let medias = this.media;
    if (this.mp3 === true && this.image !== true || this.mp4 === true && this.image !== true) {
      this.userActions.addSingle('error', 'Failed', 'Please make sure to upload an image representing the asset you intend to issue along-side the asset.');
      return;
    }
    if (this.categorySelected === 'artwork' && !this.mediaType.find(elem => elem === 'image' )) {
      this.userActions.addSingle('error', 'Failed', 'Please make sure to upload an image representing the asset you intend to issue along-side the asset.');
      return;
    } else if (this.categorySelected === 'movieRight' && !this.mediaType.find(elem => elem === 'mp4' )) {
      this.userActions.addSingle('error', 'Failed', 'Please make sure to upload a video representing the asset you intend to issue along-side the asset.');
      return;
    } else if (this.categorySelected === 'musicRight' && !this.mediaType.find(elem => elem === 'mp3' )) {
      this.userActions.addSingle('error', 'Failed', 'Please make sure to upload an audio representing the asset you intend to issue along-side the asset.');
      return;
    } else if (this.typeSelected === undefined) {
      this.userActions.addSingle('error', 'Failed', 'Please make sure you select a type.');
      return;
    }else {
      this.spinner.show();
      await this.metamaskService.issue(this.tokenId, this.title, this.symbol, this.account).then( data => {
        if (data.status === 'success') {
          setTimeout(() => {
            this.mainService.issueToken(this.tokenId, medias, this.mediaType, dateCreated, this.categorySelected, this.description, this.typeSelected).pipe(timeout(20000)).subscribe(data => {
              if (data['status'] === 'success') {
                this.spinner.hide();
                this.userActions.addSingle('success', 'Success', 'Asset has been issued successfully');
                return this.ngOnInit();
              } else {
                this.spinner.hide();
                this.userActions.addSingle('error', 'Failed', 'There has been an error while trying to issue this asset, please try again.');
              }
            }, err => {
              this.spinner.hide();
              this.userActions.addSingle('error', 'Failed', 'There has been an error while trying to issue this asset, please try again.');
            })
            form.value.reset;
        }, 15000);
        } else {
          this.spinner.hide();
          this.userActions.addSingle('error', 'Failed', 'There has been an error while trying to issue this asset, please try again.');
        }
      }, err => {
        console.log(err);
        this.error = err.error.data.error;
        this.spinner.hide();
        this.userActions.addSingle('error', 'Failed',  this.error);
        form.value.reset;
      });
    }
  }


}
