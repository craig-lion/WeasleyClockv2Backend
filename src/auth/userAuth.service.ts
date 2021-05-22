import { Injectable } from '@nestjs/common';
import { VerifiedUser } from 'src/user/verifiedUser.model';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

export class JwtToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<VerifiedUser | boolean> {
    const user = await this.userService.findByName(username);

    if (user) {
      bcrypt.compare(pass, user[0].password, (err, res) => {
        if (err) {
          // throw new Error('We Have A Problem Validating');
          return false;
        }
        if (res) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = user[0];
          const verifiedUser: VerifiedUser = rest;
          return verifiedUser;
        }
      });
    }
    return false;
  }

  async createToken(verifiedUser: VerifiedUser) {
    return {
      token: this.jwtService.sign(verifiedUser),
    };
  }

  async getSecret() {
    return this.configService.get('SECRET');
  }
}
