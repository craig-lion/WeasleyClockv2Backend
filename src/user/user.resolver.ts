import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { Location } from 'src/location/location.model';
import { LocationService } from 'src/location/location.service';
import { UpdateUserInput } from './user-input.updateUser';
// import { AdventureRequest } from 'src/requests/adventureRequest.model';
import { User } from './user.model';
import { UserService } from './user.service';
// import { AdventureRequestService } from '../requests/adventureRequest.service';
// import { FriendRequestService } from 'src/requests/friendRequest.service';
// import { FriendRequest } from 'src/requests/friendRequest.model';

//TODO: Can I name overall resolver and then simplify mutation names i.e. user{mutation{update}}

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private locationService: LocationService, // private adventureRequestService: AdventureRequestService, // private friendRequestService: FriendRequestService,
  ) {}

  @ResolveField('currentLocation', () => Location, { nullable: true })
  async getCurrentLocation(@Parent() location: Location) {
    const { id } = location;
    return this.locationService.findLocation(id);
  }

  // TODO: Can I pass array?

  @ResolveField('favoriteLocations', () => [Location], { nullable: true })
  async getFavoriteLocations(@Parent() location: Location) {
    const { id } = location;
    return this.locationService.findLocation(id);
  }

  @ResolveField('createdLocations', () => [Location], { nullable: true })
  async getCreatedLocations(@Parent() location: Location) {
    const { id } = location;
    return this.locationService.findLocation(id);
  }

  // @ResolveField('createdAdventures', () => [AdventureRequest])
  // async getCreatedAdventures(@Parent() adventureRequest: AdventureRequest) {
  //   const { id } = adventureRequest;
  //   this.adventureRequestService.findAdventureRequest(id);
  // }

  // @ResolveField('adventures', () => [AdventureRequest])
  // async getInvitedAdventures(@Parent() adventureRequest: AdventureRequest) {
  //   const { id } = adventureRequest;
  //   this.adventureRequestService.findAdventureRequest(id);
  // }

  // @ResolveField('friends', () => [FriendRequest])
  // async getFriends(@Parent() friendRequest: FriendRequest) {
  //   const { id } = friendRequest;
  //   this.friendRequestService.findFriendRequest(id);
  // }

  @Query(() => String)
  async userTest() {
    return 'yarrr this be a Usertest';
  }
  @Query(() => [User], { name: 'allUsers' })
  async users() {
    return this.userService.findUsers();
  }
  @Query(() => User, { name: 'user' })
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findUser(id);
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('currentLocation', { nullable: true }) currentLocation?: number,
  ) {
    return this.userService.createUser(name, password, currentLocation);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('id') id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('password', { nullable: true }) password?: number,
    @Args('currentLocation', { nullable: true }) currentLocation?: number,
    // @Args('updateUserData') updateUserData: UpdateUserInput,
  ) {
    // console.log({ id, name, password, currentLocation });
    return this.userService.updateUser({ id, name, password, currentLocation });
    // return this.userService.updateUser(updateUserData)
  }
}
