import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './userAuth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '60000s' },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: GqlAuthGuard,
    // },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
