import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { ethers } from "ethers";
import { baseABI, baseUrl, chainId} from '../config/main.config.const';
declare const window: any;


@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  window:any;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  walletAddress: string;
  walletBalance: number;
  contractAddress: string;
  bidResponse: string;
  endbidResponse: string;
  auctionResponse: string;
  issuanceResponse: any;
  withdrawResponse: string;
  cancelResponse: string;

  constructor(public httpClient: HttpClient) {
    this.getContractAddress().subscribe(data => {
      if (data['status'] === 'success') {
        this.contractAddress = data['data'];
      }
    }) 
  }

  public openMetamask = async () => {
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await this.provider.send("eth_requestAccounts", []);
    // console.log('pro', ethers.providers.getNetwork("https://data-seed-prebsc-2-s3.binance.org:8545/"))
    this.signer = this.provider.getSigner();
    this.walletAddress = await this.signer.getAddress();
    this.signer.getBalance().then((balance) => {
      this.walletBalance =  parseInt(ethers.utils.formatEther(balance))
     });
    return {
      account: this.walletAddress,
      balance: this.walletBalance
    }
  }

  async placeBid(tokenId: number, auctionId: number, bidAmount: any) {
    console.log('selected', window.ethereum.selectedAddress)
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("placeBid", [tokenId, auctionId ]);
    console.log('this is amount', String(bidAmount))
    const ethValue: string = String(bidAmount); // 0 BNB
    const transactionParameters = {
      nonce: '0x00',
      to: this.contractAddress,
      from: window.ethereum.selectedAddress,
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId,
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.bidResponse = txHash;
    }, (error: any) => {
      this.bidResponse = error;
    });
    return this.bidResponse;
  }

  async endBid(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("endBid", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.endbidResponse = txHash;
    }, (error: any) => {
      this.endbidResponse = error;
    });
    return this.endbidResponse;
  }

  getContractAddress() {
    return this.httpClient.get(`${baseUrl.mainUrl}/get-contract-address`, baseUrl.headers)
  }

  async issue(tokenId: number, assetName: any, symbol: any, account: string) {
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("issueToken", [tokenId, account, 'empty string', assetName, symbol ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
      // txHash is a hex string
  // As with any RPC call, it may throw an error
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.issuanceResponse = {status: 'success', response: txHash};
    }, (error: any) => {
      console.log('this is error ==>', error)
      this.issuanceResponse = error;
    });
    return this.issuanceResponse;
  }

  async startAuction(tokenId: number, auctionId: number, startBlock: number, endBlock: number, currentBlock: number, sellNowPrice: string, minimumBid: string) {
    let snp: string = ethers.utils.parseEther(sellNowPrice).toHexString();
    let mb: string = ethers.utils.parseEther(minimumBid).toHexString();
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("startAuction", [tokenId, auctionId, startBlock, endBlock, currentBlock, snp, mb ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.auctionResponse = txHash;
    }, (error: any) => {
      console.log('this is error ==>', error)
      this.auctionResponse = error;
    });
    return this.auctionResponse;
  }

  async withdraw(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("withdraw", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.withdrawResponse = txHash;
    }, (error: any) => {
      this.withdrawResponse = error;
    });
    return this.withdrawResponse;
  }

  async cancelAuction(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(this.bidResponse);
    const data: string = yFace.encodeFunctionData("cancelAuction", [tokenId, auctionId ]);
    const ethValue = "0.1"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.cancelResponse = txHash;
    }, (error: any) => {
      this.cancelResponse = error;
    });
    return this.cancelResponse;
  }

  getCurrentBlock()  {
    return this.httpClient.get(`${baseUrl.mainUrl}/get-block`, baseUrl.headers)
  }


}
