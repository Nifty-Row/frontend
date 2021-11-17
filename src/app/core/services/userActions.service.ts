import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import {MessageService} from 'primeng/api';
import {Message} from 'primeng//api';
import { IEvents, IFollow, ILikes } from '../components/nftcard/event.interface';

@Injectable({
  providedIn: 'root'
})
export class UserActionsService {
  protected _eventsSubject = new Subject<IEvents>();
  private dataStore = { likes: <ILikes>  {tokenId: 0, likeCount: 0}, 
                        follow: <IFollow> { followCount: 0, id: "" } }; 
  constructor(private messageService: MessageService) { }

  BroadcastLikes(type: string, data: number, id: number) {
    let confirmLikeExists = this.dataStore.likes.tokenId === id;
    if (type === 'likes' && confirmLikeExists) {
      this._eventsSubject.complete();
      return;
    } else {
      this.dataStore.likes = {tokenId: id, likeCount: data};
      this._eventsSubject.next({ type, data, id })
    }
   
  }

  getLikes(tokenId) {
    let confirmLikeExists = this.dataStore.likes['likeCount'] > 0 && this.dataStore.likes.tokenId === tokenId;
    if (confirmLikeExists) {
      return this.dataStore.likes.likeCount;
    }

  }

  BroadcastFollowEvent(type: string, data: number, id: string) {
    let confirmFollow = this.dataStore.follow.id === id;
    if (type === 'follow' && confirmFollow) {
      this._eventsSubject.complete();
      return;
    } else {
      this.dataStore.follow = { followCount: data, id: id };
      // this._eventsSubject.next({ type, data, id })
    }
   
  }

  getFollowCount(id) {
    let confirmLikeExists = this.dataStore.follow.id  === id;
    if (confirmLikeExists) {
      return this.dataStore.follow.followCount;
    }

  }

  addSingle( severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail});
  }

  // public GetEvent(type: string, tokenId): Observable<IEvents> {
  //     return this._eventsSubject.asObservable()
  //         .pipe(
  //             filter(e => e.type === type && e.id === tokenId),
  //             map(e => e.data)
  //         );
  // }
  
}
