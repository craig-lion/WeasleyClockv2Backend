import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { LocationModule } from '../location/location.module';
import { Adventure } from '../adventure/adventure.model';
import { AdventureService } from './adventure.service';
import { AdventureResolver } from './adventure.resolver';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => LocationModule),
    TypeOrmModule.forFeature([Adventure]),
  ],
  providers: [AdventureService, AdventureResolver],
  exports: [AdventureService],
})
export class AdventureModule {}
