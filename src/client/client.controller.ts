import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/publicRoute.decorator';
import { ClientService } from './client.service';

@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Get('*')
  public async get() {
    return this.clientService.getApp();
  }
}