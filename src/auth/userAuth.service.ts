import { Injectable } from '@nestjs/common';
import { User } from '../user/user.model';
import { VerifiedUser } from 'src/user/verifiedUser.model';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

export class JwtToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
    console.log('this is verifiedUser in createToken: ', verifiedUser);
    return {
      token: this.jwtService.sign(verifiedUser),
    };
  }
}
