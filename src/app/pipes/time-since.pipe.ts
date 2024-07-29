import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeSince'
})
export class TimeSincePipe implements PipeTransform {

  transform(date: string, format: any): string {
    //let ndate = moment(date, format ? format : 'YYYY-MM-DD').fromNow(false);
    return 'time';
  }

}
