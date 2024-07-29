import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import {shareReplay, take, share} from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class EventsService {
  // publish client
  public userSubject = new Subject<any>();
  public user$ = this.userSubject.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  public refreshSubject = new Subject<any>();
  public refresh$ = this.refreshSubject.asObservable();
}
