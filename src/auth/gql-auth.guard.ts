import {
  CanActivate,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext, Parent } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthenticationError } from 'apollo-server-express';
import { jwtConstants } from './constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /* 
  This code comes from Nestjs docs
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  */

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    return super.canActivate(new ExecutionContextHost([req]));
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new AuthenticationError('GqlAuthGuard');
    }
    return user;
  }
}

//TODO - ONLY USE AUTHGUARD
// @Injectable()
// export class GqlAuthGuard2 implements CanActivate {
//   async canActivate(context: ExecutionContext) {
//     const ctx = GqlExecutionContext.create(context).getContext();
//     console.log('this is ctx in AuthGuard: ', ctx.headers);
//     // console.log('this is ctx in AuthGuard: ', ctx);
//     if (!ctx.headers.authorization) {
//       console.log('failwhale');
//       return false;
//     }
//     ctx.user = await this.validateToken(ctx.headers.authorization);
//     console.log('were in');
//     return true;
//   }

//   async validateToken(auth: string) {
//     if (auth.split(' ')[0] !== 'Bearer') {
//       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
//     }
//     const token = auth.split(' ')[1];
//     try {
//       return await jwt.verify(token, jwtConstants.secret);
//     } catch (err) {
//       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
//     }
//   }
// }
