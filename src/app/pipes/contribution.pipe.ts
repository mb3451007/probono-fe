import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contribution'
})
export class ContributionPipe implements PipeTransform {

  transform(type: any): any {
    const contributions = [
      {id: 1, type: 'Ambassador', stars: 20, perMonth: true },
      {id: 2, type: 'Ninja', stars: 15, perMonth: true },
      {id: 3, type: 'Committee Member', stars: 15, perMonth: true },
      {id: 4, type: 'Blog post', stars: 5, perMonth: false },
      {id: 5, type: 'Bright Idea 1', stars: 2, perMonth: false },
      {id: 6, type: 'Bright Idea 2', stars: 4, perMonth: false },
      {id: 7, type: 'Open House', stars: 2, perMonth: false },
      {id: 8, type: 'Other Contributions', stars: 0, perMonth: false }
    ];

    let cont = contributions.find((rec: any) => rec.id == type);

    return cont ? cont.type : 'Other';
  }

}
