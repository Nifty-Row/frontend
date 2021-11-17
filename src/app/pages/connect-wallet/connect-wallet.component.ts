import { Component, OnInit } from '@angular/core';
import { MetamaskService } from 'src/app/core/services/metamask.service';

@Component({
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit {

  constructor(public metamaskService: MetamaskService) { }

  ngOnInit(): void {
    
  }

  connectToMetamask() {
    this.metamaskService.openMetamask();
  }

}
