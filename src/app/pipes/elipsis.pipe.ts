import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elipsis',
  standalone: true
})
export class ElipsisPipe implements PipeTransform {

  transform(value: string, max: number = 30): string {
    return value.length < (max + 3) ? value : value.slice(0, max) + '...';
  }

}
