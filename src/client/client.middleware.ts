import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as path from 'path'
import { ClientService } from './client.service';


@Injectable()
export class ClientMiddleware implements NestMiddleware {
  constructor(private readonly clientService: ClientService) {}
  getAssetPath(url: any) {
    const basePath = '/Users/lion/Desktop/WeasleyClockV2/March 20201/WeasleyClockv2/build';
    return path.join(basePath, url);
  }

  async use(req: Request, res: Response, next: () => void) {
    if (/[^\\/]+\.[^\\/]+$/.test(req.path)) {
      const file = this.getAssetPath(req.path);
      res.sendFile(file, (err) => {
        if (err) {
          res.status(404).end();
        }
      });
    } else {
      return next();
    }
  }
}