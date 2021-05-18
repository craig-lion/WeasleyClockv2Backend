import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './userAuth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants';
// import { GqlAuthGuard } from './gql-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000s' },
    }),
  ],
  providers: [
    AuthService,
    // LocalStrategy,
    JwtStrategy,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: GqlAuthGuard,
    // },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
