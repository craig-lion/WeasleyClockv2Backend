import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdventureRequestService } from './adventureRequest.service';
import { UserModule } from 'src/user/user.module';
import { LocationModule } from 'src/location/location.module';
import { AdventureModule } from 'src/adventure/adventure.module';
import { FriendRequestService } from './friendRequest.service';
import { AdventureRequest } from './adventureRequest.model';
import { FriendRequest } from './friendRequest.model';
import { FriendRequestResolver } from './friendRequest.resolver';
import { AdventureRequestResolver } from './adventureRequest.resolver';

// TODO: Do I need to import every entity for every model?

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => LocationModule),
    forwardRef(() => AdventureModule),
    TypeOrmModule.forFeature([FriendRequest, AdventureRequest]),
  ],
  providers: [
    FriendRequestService,
    FriendRequestResolver,
    AdventureRequestService,
    AdventureRequestResolver,
  ],
  exports: [FriendRequestService, AdventureRequestService],
})
export class RequestsModule {}
