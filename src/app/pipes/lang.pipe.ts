import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { LANGUAGES, CATEGORIES } from '../../constants';

@Pipe({
  name: 'lang'
})
export class LangPipe implements PipeTransform {
  transform(code: string, type: any): any {
    if(type === 'lang') {
      let obj = LANGUAGES.find((rec: any) => rec.code3 === code);
      return obj ? obj.name : code;
    }

    if(type === 'cat') {
      let obj = CATEGORIES.find((rec: any) => rec.value === code);
      return obj ? obj.label : code;
    }

    return code;
  }

}
