import {Injectable, PipeTransform} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirstNameService implements PipeTransform{
    transform(value: string, index = 0): string {
        if (value) {
            const split = value.split(' ');

            return split.length ? split[index] : value;
        }

        return value;
    }
  constructor() { }
}
