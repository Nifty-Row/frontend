import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public httpClient: HttpClient) { }
  baseUrl = 'http://35.224.252.52:8080/v3';
  api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';


  registerAdmin(body) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    console.log('this is headers', headers);
    console.log('this is body', body);
    return this.httpClient.post(`${this.baseUrl}/user/new-user`, body, {headers});
  }

  approve(tokenId, status:boolean) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/admin/change-approval-status/${tokenId}/${status}`, {headers});
  }

  login(email, password) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/admin/login`, {email, password}, {headers});
  }

  changemarket(tokenId, marketType) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/admin/change-asset-market/${tokenId}/${marketType}`, {headers});
  }

  getFees() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/fees`, {headers});
  }

  updateFees(smsNotification, nse, transaction, blockchain) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/fees`, {
      "smsNotification": smsNotification,
      "nse": nse,
      "transaction": transaction,
      "blockchain": blockchain 
    }, {headers});
  }

  getMarketSettings() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/market-settings`, {headers});
  }

  getAllUsers(role) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/user/users-by-role/${role}`, {headers});
  }

  updateMarketSettings(percMinBuyQuantity, percPriceChangeLimit, primaryMarketHoldingPeriod, maxNoOfDaysForInfinityOrders) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/market-settings`, {
      "percMinBuyQuantity": percMinBuyQuantity,
      "percPriceChangeLimit": percPriceChangeLimit,
      "primaryMarketHoldingPeriod": primaryMarketHoldingPeriod,
      "maxNoOfDaysForInfinityOrders": maxNoOfDaysForInfinityOrders
    }, {headers});
  }

  getHolidays() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/holidays`, {headers});
  }

  setHolidays(body) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/holidays`, {body}, {headers});
  }

}