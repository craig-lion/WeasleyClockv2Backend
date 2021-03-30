import { Injectable } from '@nestjs/common';

// TODO - Possibly delete file

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
