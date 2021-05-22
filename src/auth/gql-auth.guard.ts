import {
  CanActivate,
  HttpException,
  HttpStatus,
  Injectable,
  ExecutionContext,
} from '@nestjs/common';

import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly jwtSecret: string,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext();


    if (!ctx.headers) {
      console.log('failwhale');
      return false;
    }

    ctx.user = await this.validateToken(ctx.headers.authorization);

    console.log('were in');
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    try {
      return await jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
