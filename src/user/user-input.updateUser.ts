import { Field, InputType, Int } from '@nestjs/graphql';
import { Location } from 'src/location/location.model';
// import { FriendRequest } from 'src/requests/friendRequest.model';
import { User } from './user.model';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => Location, { nullable: true })
  currentLocation?: Location;

  // @Field(() => [Location], { nullable: true })
  // favoriteLocations?: Location[];

  // @Field(() => [FriendRequest], { nullable: true })
  // friends?: FriendRequest[];
}
