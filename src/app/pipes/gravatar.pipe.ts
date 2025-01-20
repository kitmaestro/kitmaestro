import { Pipe, PipeTransform } from '@angular/core';
import { sha512_256 } from 'js-sha512';

@Pipe({
  name: 'gravatar'
})
export class GravatarPipe implements PipeTransform {

  transform(value: string): string {
    return 'https://gravatar.com/avatar/' + sha512_256(value.trim().toLowerCase());
  }

}
