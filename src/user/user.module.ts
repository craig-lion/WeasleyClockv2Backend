import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { LocationModule } from 'src/location/location.module';
import { AdventureModule } from 'src/adventure/adventure.module';
import { RequestsModule } from 'src/requests/requests.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => LocationModule),
    forwardRef(() => AdventureModule),
    forwardRef(() => RequestsModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
