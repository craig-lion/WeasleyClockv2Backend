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
import { UpdateLocationArgs } from 'src/location/location-input.updateLocation';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateLocationArgs } from './location-input.createLocation';

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
    return data[0];
  }

  // @ResolveField('favoritedBy', () => [User], { nullable: true })
  // async getCurrentLocation(@Parent() location: Location) {
  //   // find and users where user.favoriteLocations.id matches location.id
  //   const id = location.favoritedBy?.map((user) => user.id);
  //   console.log('this is location in locationResolver: ', id);
  //   return this.userService.find(id);
  // }

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
    // TODO -  Why is data loading in backend but null in graph for createdBy
    console.log('data in Locations Query: ', data);
    return data;
  }

  @Query(() => Location, { name: 'Location' })
  async oneLocation(@Args('id', { type: () => Int }) id: number) {
    const data = await this.locationService.findLocations([id]);
    console.log('data in locations resolver: ', data);
    // TODO - Same problem as all locations, createdBy shows in backend but not in graph
    return data[0];
  }

  @Mutation(() => Location, { name: 'createLocation' })
  async createLocation(
    @Args('createLocation')
    { name, createdBy, privacy, lnglat }: CreateLocationArgs,
  ) {
    const user = this.userService.find([createdBy]);

    return this.locationService.createLocation({
      name,
      user,
      privacy,
      lnglat,
    });
  }

  @Mutation(() => Location, { name: 'updateLocation' })
  async updateLocation(
    @Args()
    { id, name, lnglat, privacy, favoritedBy }: UpdateLocationArgs,
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
