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
import { FriendRequestService } from 'src/requests/friendRequest.service';
import { FriendRequest } from 'src/requests/friendRequest.model';

//TODO: Can I name overall resolver and then simplify mutation names i.e. user{mutation{update}}

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private locationService: LocationService, // private adventureRequestService: AdventureRequestService,
    private friendRequestService: FriendRequestService,
  ) {}

  @ResolveField('currentLocation', () => Location, { nullable: true })
  async getCurrentLocation(@Parent() user: User) {
    console.log('this is user in oneUSer: ', user.currentLocation);
    const id = user.currentLocation?.id;
    if (!id) {
      console.log('no id currentLocation');
      return null;
    }
    const data = await this.locationService.findLocations([id]);
    return data[0];
    console.log('this is another thing thats happening');
  }

  @ResolveField('favoriteLocations', () => [Location], { nullable: true })
  async getFavoriteLocations(@Parent() user: User) {
    const id = user.favoriteLocations?.map((location) => location);
    // console.log(
    //   'user.map: ',
    //   user.favoriteLocations.map((location) => console.log(location)),
    // );
    console.log(
      'this is user.favoriteLocations: ',
      user.favoriteLocations,
      typeof user.favoriteLocations,
    );
    console.log('this is id: ', id);
    return this.locationService.findLocations([1]);
  }

  @ResolveField('createdLocations', () => [Location], { nullable: true })
  async getCreatedLocations(@Parent() user: User) {
    const ids = user.createdLocations.map((location) => location.id);
    // console.log('this should be ids in createdLocations: ', ids);
    return this.locationService.findLocations(ids);
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

  @ResolveField('friends', () => [FriendRequest])
  async getFriends(
    @Parent() friendRequest: FriendRequest,
  ): Promise<FriendRequest[] | null> {
    const { id } = friendRequest;
    const data = await this.friendRequestService.findUserFiends(id);
    // console.log('friends Field Resolver: ', data);
    return data;
  }

  @Query(() => [User], { name: 'allUsers' })
  async users() {
    const data = await this.userService.findUsers();
    // console.log('this is data in AllUSers: ', data);
    return data;
  }

  // TODO - If I type it [User] I don't have to do data[0] change all if true

  @Query(() => [User], { name: 'user' })
  async oneUser(@Args('id', { type: () => Int }) id: number) {
    const data = await this.userService.find([id]);
    // console.log('this is data in oneUser: ', data);
    return data;
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('currentLocation', { nullable: true }) currentLocation?: number,
  ) {
    return await this.userService.createUser(name, password, currentLocation);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    // TODO: should be UpdateUserArgs
    @Args()
    { id, name, password, currentLocation, favoriteLocations }: UpdateUserInput,
  ) {
    // console.log({ id, name, password, currentLocation });
    let currentLocationObj;

    if (currentLocation) {
      currentLocationObj = await this.locationService.findLocations([
        currentLocation,
      ]);
    }
    return this.userService.updateUser({
      id,
      name,
      password,
      currentLocationObj,
      favoriteLocations,
    });
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    this.userService.removeUser(id);
    return true;
  }
}
