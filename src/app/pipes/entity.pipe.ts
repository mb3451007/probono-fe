import { Pipe, PipeTransform } from '@angular/core';
import { MainService } from '../api/main.service';
// import { Observable, BehaviorSubject, of, map, switchMap, pipe, catchError, Subscription } from 'rxjs';

@Pipe({
  name: 'entity'
})
export class EntityPipe implements PipeTransform {
  constructor(private mainService: MainService) {}

  transform(value: any, info: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mainService.getEntity(value)
      .subscribe((res: any) => {
        if(res.data[0] && !res.data[0].image_url) {
          res.data[0].image_url = 'assets/img/default-user-avatar.png';
        }

        resolve(res.data[0] || {first_name: 'Non-existent', last_name: "", email: "Erased from main DB", image_url: 'assets/img/default-user-avatar.png'});
      }, err => {
        resolve('assets/img/default-user-avatar.png');
      })
    })

  }
}
