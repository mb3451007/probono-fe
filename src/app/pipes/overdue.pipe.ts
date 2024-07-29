import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'overdue'
})
export class OverduePipe implements PipeTransform {

  transform(date: string, format: any): any {

    if(moment(date, format ? format : 'YYYY-MM-DD').add(1, 'days').isBefore(moment())) {
      return moment(date, format ? format : 'YYYY-MM-DD').add(1, 'days').fromNow(false);
    }

    //let ndate = moment(date, format ? format : 'YYYY-MM-DD').fromNow(false);
    return false;
  }

}
