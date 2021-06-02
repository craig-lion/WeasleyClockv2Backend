import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth/userAuth.service';

//TODO Possibly delete this file

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req): Promise<any> {
  //   return this.authService.createToken(req.user);
  // }
}
