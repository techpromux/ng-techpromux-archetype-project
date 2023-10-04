import {Injectable} from '@angular/core';
import {v4 as uuid4} from 'uuid';

@Injectable()
export class UtilUuidService {

  uuid(): string {
    return uuid4();
  }
}
