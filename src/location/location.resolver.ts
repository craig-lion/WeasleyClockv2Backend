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
// import { Adventure } from 'src/adventure/adventure.model';
// import { AdventureService } from 'src/adventure/adventure.service';
import { UpdateLocationArgs } from 'src/location/location-input.updateLocation';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateLocationArgs } from './location-input.createLocation';

//TODO: Can I name overall resolver and then simplify mutation names i.e. Location{mutation{update}}

@Resolver(() => Location)
export class LocationResolver {
  constructor(
    private userService: UserService,
    private locationService: LocationService, // private adventureService: AdventureService,
  ) {}

  @ResolveField('createdBy', () => User, { nullable: true })
  async getCreatedBy(@Parent() location: Location) {
    const id = location.createdBy.id;
    const data = await this.userService.findUser(id);
    return data;
  }

  // TODO: Can I pass array?

  @ResolveField('favoritedBy', () => [User], { nullable: true })
  async getCurrentLocation(@Parent() user: User) {
    const { id } = user;
    return this.userService.findUser(id);
  }

  // @ResolveField('adventures', () => [Adventure])
  // async getFavoriteLocations(@Parent() adventure: Adventure) {
  //   const { id } = adventure;
  //   return this.locationService.findLocation(id);
  // }

  @Query(() => [Location], { name: 'allLocations' })
  async locations() {
    const data = await this.locationService.findLocations();
    console.log(
      'data in Locations Query: ',
      data.map((data) => Object.keys(data)),
    );
    return data;
  }

  @Query(() => Location, { name: 'Location' })
  async oneLocation(@Args('id', { type: () => Int }) id: number) {
    const data = await this.locationService.findLocation(id);
    console.log('data in locations resolver: ', data);
    return data;
  }

  @Mutation(() => Location, { name: 'createLocation' })
  async createLocation(
    @Args('location') { name, createdBy, privacy, lnglat }: CreateLocationArgs,
  ) {
    return this.locationService.createLocation({
      name,
      createdBy,
      privacy,
      lnglat,
    });
  }

  @Mutation(() => Location, { name: 'updateLocation' })
  async updateLocation(
    @Args()
    {
      id,
      name,
      lnglat,
      privacy,
      favoritedBy,
    }: // adventures,
    UpdateLocationArgs,
  ) {
    return this.locationService.updateLocation({
      id,
      name,
      lnglat,
      privacy,
      favoritedBy,
      // adventures,
    });
  }
}
