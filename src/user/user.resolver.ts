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
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { AuthService } from 'src/auth/userAuth.service';
import { VerifiedUser } from './verifiedUser.model';
import { DataToken } from 'src/auth/user.DataToken';
import { FriendRequestData } from 'src/requests/friendRequestData.model';
import { FriendRequest } from 'src/requests/friendRequest.model';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/auth/publicRoute.decorator';

//TODO: Can I name overall resolver and then simplify mutation names i.e. user{mutation{update}}

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private locationService: LocationService, // private adventureRequestService: AdventureRequestService,
    private friendRequestService: FriendRequestService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ResolveField('currentLocation', () => Location, { nullable: true })
  async getCurrentLocation(@Parent() user: User) {
    // console.log('this is user in oneUSer: ', user.currentLocation);
    const id = user.currentLocation?.id;
    if (!id) {
      console.log('no id currentLocation');
      return null;
    }
    const data = await this.locationService.findLocations([id]);
    return data[0];
  }

  @ResolveField('locations', () => [Location], { nullable: true })
  async getLocations(@Parent() user: User) {
    // console.log('this is user in locations resolveField: ', user);
    const ids: number[] = user.locations.map((location) => location.id);
    // console.log(
    //   'user.map: ',
    //   user.favoriteLocations.map((location) => console.log(location)),
    // );
    console.log('this is ids: ', ids);
    // console.log('this is type of id: ', typeof id);
    // console.log(
    //   'this is user.favoriteLocations: ',
    //   user.favoriteLocations,
    //   typeof user.favoriteLocations,
    // );
    const data = await this.locationService.findLocations(ids);
    // console.log('thi s is data in user.locations resolver: ', data);
    return data;
  }

  @ResolveField('favoriteLocations', () => [Location], { nullable: true })
  async getFavoriteLocations(@Parent() user: User) {
    // console.log('this is user in favoriteLocations resolver: ', user);
    const id = user.favoriteLocations.map((location) => location.id);
    // console.log(
    //   'user.map: ',
    //   user.favoriteLocations.map((location) => console.log(location)),
    // );
    // console.log('this is id: ', id);
    // console.log('this is type of id: ', typeof id);
    // console.log(
    //   'this is user.favoriteLocations: ',
    //   user.favoriteLocations,
    //   typeof user.favoriteLocations,
    // );
    const data = await this.locationService.findLocations(id);
    // console.log('thi s is data in user.favoriteLocations resolver: ', data);
    return data;
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

  @ResolveField('friends', () => FriendRequestData)
  async getFriends(@Parent() user: User): Promise<FriendRequestData | null> {
    const { id } = user;
    const friendsData = new FriendRequestData();
    const allRequests: FriendRequest[] = await this.friendRequestService.findUserRequests(
      id,
    );
    // ACCEPTED
    const acceptedFriends: FriendRequest[] = allRequests.filter(
      (request) => request.status === 'accepted',
    );
    if (acceptedFriends.length) {
      const acceptedIds: number[] = acceptedFriends.map((friend) => {
        if (friend.recipient.id === id) {
          return friend.createdBy.id;
        } else {
          return friend.recipient.id;
        }
      });
      const acceptedData: User[] = await this.userService.find(acceptedIds);

      friendsData.accepted = acceptedData;
    }
    // PENDING
    const pendingFriends: FriendRequest[] = allRequests.filter(
      (request) => request.status === 'pending',
    );
    if (pendingFriends.length) {
      const pendingIds: number[] = pendingFriends.map((friend) => {
        if (friend.recipient.id === id) {
          return friend.createdBy.id;
        } else {
          return friend.recipient.id;
        }
      });
      const pendingData: User[] = await this.userService.find(pendingIds);
      friendsData.pending = pendingData;
    }
    // REJECTED
    const rejectedFriends: FriendRequest[] = allRequests.filter(
      (request) => request.status === 'rejected',
    );
    if (rejectedFriends.length) {
      const rejectedIds: number[] = rejectedFriends.map((friend) => {
        if (friend.recipient.id === id) {
          return friend.createdBy.id;
        } else {
          return friend.recipient.id;
        }
      });
      const rejectedData: User[] = await this.userService.find(rejectedIds);
      friendsData.rejected = rejectedData;
    }
    return friendsData;
  }

  @Query(() => [User], { name: 'allUsers' })
  async users() {
    const data = await this.userService.findUsers();
    console.log('this is data in AllUSers: ', data.length);
    return data;
  }

  // TODO - If I type it [User] I don't have to do data[0] change all if true

  @Query(() => [User], { name: 'user' })
  async oneUser(@CurrentUser() user: User) {
    // TODO - Route should access currentUser and get name from there
    const data = await this.userService.findByName(user.name);
    return data;
  }

  @Query(() => [User], { name: 'userNotFriends' })
  async userNotFriends(@CurrentUser() user: VerifiedUser) {
    // Get All FriendRequests
    const requests: FriendRequest[] = await this.friendRequestService.findUserRequests(
      user.id,
    );
    // console.log('this is requests: ', requests.length);
    // Capture all userNames from friendRequests
    const nameSet: Set<number> = new Set();
    requests.forEach(
      (friendRequest) => (
        nameSet.add(friendRequest.createdBy.id),
        nameSet.add(friendRequest.recipient.id)
      ),
    );
    // Search for all users where name is not in nameSet
    const data: User[] = await this.userService.findUsers(nameSet);

    return data;
  }

  @Query(() => User)
  me(@CurrentUser() user: VerifiedUser) {
    console.log('this is me: ', user);
    return user;
  }

  @Mutation(() => DataToken, { name: 'login' })
  @Public()
  async login(
    @Args('name') name: string,
    @Args('password') password: string,
  ): Promise<DataToken | string> {
    const verifiedUser: VerifiedUser | null = await this.userService.verifyUser(
      name,
      password,
    );
    if (!verifiedUser) {
      return `Login Failed`;
    } else {
      const data: DataToken = await this.authService.createToken(verifiedUser);
      return data;
    }
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
  // @UseGuards(new GqlAuthGuard())
  async updateUser(
    // TODO: should be UpdateUserArgs
    // TODO: update user should get user.id from context
    @CurrentUser() user: VerifiedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args()
    {
      name,
      password,
      locations,
      currentLocation,
      favoriteLocations,
    }: UpdateUserInput,
  ) {
    let currentLocationObj;
    let locationsArray: Location[] = [];
    let favoriteLocationsArray: Location[] = [];

    if (locations) {
      locationsArray = await this.locationService.findLocations(locations);
    }
    if (currentLocation) {
      currentLocationObj = await this.locationService.findLocations([
        currentLocation,
      ]);
    }
    if (favoriteLocations) {
      favoriteLocationsArray = await this.locationService.findLocations(
        favoriteLocations,
      );
    }
    return this.userService.updateUser({
      currentUser: id,
      newName: name,
      password,
      locationsArray,
      currentLocationObj,
      favoriteLocationsArray,
    });
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    this.userService.removeUser(id);
    return true;
  }
}
