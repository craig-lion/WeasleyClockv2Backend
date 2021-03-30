import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdventureModule } from 'src/adventure/adventure.module';
import { UserModule } from 'src/user/user.module';
import { Location } from '../location/location.model';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AdventureModule),
    TypeOrmModule.forFeature([Location]),
  ],
  providers: [LocationService, LocationResolver],
  exports: [LocationService],
})
export class LocationModule {}
