import { IMenuGroups } from '../components/footer/footer.interface';
import { IurlConfig, headerConfig } from '../interfaces/dynamicUrl.interface';
import * as footerData from 'src/assets/data/footer.json' 
import { HttpHeaders } from '@angular/common/http';

export const footerConfig: IMenuGroups [] = footerData;
let apiKey = 'U2FsdGVkX18k5itQROOzEotUtBOLK4apPBmljl1wphduEXLbXkP08TjP6EVNDq+QzEVSAVgWOD/WMCkV1WQZ9Uo/3JXBrjz2RVdgNQmZ5sU=';
let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('Content-Type', 'application/json');
headers = headers.append('api-key', apiKey);

export const baseUrl: IurlConfig = {
        headers:  headers,
        testUrl: 'http://35.224.252.52:8080/v3/config/getHeader',
        mainUrl: 'https://lb.xendbit.net/api/yasuke/',
}

export const baseABI = [
        "function issueToken(uint256,address,string,string,string)",
        "function startAuction(uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
        "function placeBid(uint256,uint256)",
        "function endBid(uint256,uint256)",
        "function withdraw(uint256,uint256)",
        "function cancelAuction(uint256,uint256)"
]
export const chainId = 97;
export const niftyKey = apiKey;