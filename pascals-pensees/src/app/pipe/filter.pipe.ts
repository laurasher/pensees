import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { FragmentInterface } from '../fragment';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values:FragmentInterface|null,matchText:string): any[] {
    if (_.isNil(values)) {
      return [];
    }

    if (_.isNil(matchText) || matchText === '') {
      return values;
    }

    matchText = matchText.toLowerCase();

    return _.filter(values, (o:any)=> {

      let isMatch = false;
      for (let key in o) {
        if (o.hasOwnProperty(key)) {
            if (_.isString(o[key])) {
              const v = o[key].toLowerCase();
              if (v.includes(matchText) || matchText.includes(v)) {
                isMatch = true;
                break;
              }
            }
            else if(_.isArray(o[key]) || _.isObject(o[key])) {

              let everything = JSON.stringify(o[key]).toLowerCase();
              if (everything.includes(matchText)) {
                isMatch = true;
                break;
              }
            }
        }
    }
    return isMatch;

    });
  }

}
