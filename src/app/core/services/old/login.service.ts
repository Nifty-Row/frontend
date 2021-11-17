import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public httpClient: HttpClient) {  }

  baseUrl = 'http://35.224.252.52:8080/v3';
  api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';

  login(email, password) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/user/login`, {email, password}, {headers});
  }

  register(body) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/user/new-user`, body, {headers});
  }

  requestToken(body) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/user/request-password-reset-token`, body, {headers});
  }

  changePassword(body) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/user/change-password`, body, {headers});
  }

  approve(tokenId, status:boolean) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/admin/change-approval-status/${tokenId}/${status}`, {}, {headers});
  }

  checkSharesRemaining(tokenId) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/admin/primary-shares-remaining/${tokenId}`, {headers});
  }

  underSubscribe(tokenId) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/admin/under-subscribe/${tokenId}`, {}, {headers});
  }
}