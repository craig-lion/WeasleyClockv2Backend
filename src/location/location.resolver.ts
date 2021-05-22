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
import { LocationService } from '../location/location.service';
import { Adventure } from 'src/adventure/adventure.model';
import { AdventureService } from 'src/adventure/adventure.service';
import { UpdateLocationInput } from 'src/location/location-input.updateLocation';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateLocationInput } from './location-input.createLocation';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { VerifiedUser } from 'src/user/verifiedUser.model';

//TODO: Can I name overall resolver and then simplify mutation names i.e. Location{mutation{update}}

@Resolver(() => Location)
export class LocationResolver {
  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private adventureService: AdventureService,
  ) {}

  @ResolveField('currentUsers', () => User)
  async getCurrentUsers(@Parent() location: Location) {
    const ids = location.currentUsers.map((user) => user.id);
    const data = await this.userService.find(ids);
    return data;
  }

  @ResolveField('createdBy', () => User)
  async getCreatedBy(@Parent() location: Location) {
    const id = location.createdBy.id;
    const data = await this.userService.find([id]);
    // console.log('this is data in createdBy location resolver', data);
    return data[0];
  }

  @ResolveField('favoritedBy', () => [User], { nullable: true })
  async getCurrentLocation(@Parent() location: Location) {
    // find and users where user.favoriteLocations.id matches location.id
    const id = location.favoritedBy.map((user) => user.id);
    console.log('this is location in locationResolver: ', id);
    const data = await this.userService.find(id);
    console.log('this is data in locationResolver: ', data);
    return data;
  }

  @ResolveField('adventures', () => [Adventure], { nullable: true })
  async getAdventures(@Parent() location: Location) {
    // find any adventures where adventures.location.id matches location.id
    const id = location.id;
    console.log('adventure in locationResolver: ', id);
    return this.adventureService.findAdventuresByLocationId([id]);
  }

  @Query(() => [Location], { name: 'allLocations' })
  async locations() {
    const data = await this.locationService.allLocations();
    // console.log('data in Locations Query: ', data);
    return data;
  }

  @Query(() => Location, { name: 'Location' })
  async oneLocation(@Args('id', { type: () => Int }) id: number) {
    const data = await this.locationService.findLocations([id]);
    // console.log('data in locations resolver: ', data);
    // TODO - Same problem as all locations, createdBy shows in backend but not in graph
    return data[0];
  }

  @Mutation(() => Location, { name: 'createLocation' })
  async createLocation(
    @CurrentUser() user: VerifiedUser,
    @Args('createLocationInput')
    { name, privacy, lnglat }: CreateLocationInput,
  ) {
    const createdBy = await this.userService.find([user.id]);

    const newLocation:
      | Location
      | undefined = await this.locationService.createLocation({
      name,
      user: createdBy,
      privacy,
      lnglat,
    });
    // add new Location to user.locations
    if (newLocation) {
      await this.userService.addLocationHelper({
        currentUser: user.id,
        location: newLocation,
      });
      return newLocation;
    } else {
      throw new Error('Could not create new location');
    }
  }

  @Mutation(() => Location, { name: 'updateLocation' })
  async updateLocation(
    @Args('updateLocationInput')
    { id, name, lnglat, privacy, favoritedBy }: UpdateLocationInput,
  ) {
    return this.locationService.updateLocation({
      id,
      name,
      lnglat,
      privacy,
      favoritedBy,
    });
  }
}
