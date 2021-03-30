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
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateAdventureArgs } from './adventure-input.createAdventure';
import { UpdateAdventureArgs } from './adventure-input.updateAdventureArgs';
import { Adventure } from './adventure.model';
import { AdventureService } from './adventure.service';

@Resolver(() => Adventure)
export class AdventureResolver {
  constructor(
    private adventureService: AdventureService,
    private userService: UserService,
    private locationService: LocationService,
  ) {}

  @ResolveField('createdBy', () => User)
  async getCreatedBy(@Parent() adventure: Adventure) {
    // find the user where user.id matches adventure.createdBy.id
    const id = adventure.createdBy.id;
    const data = await this.userService.find([id]);
    return data;
  }

  @ResolveField('location', () => Location)
  async getLocation(@Parent() adventure: Adventure) {
    // find the location where location.id matches adventure.location.id
    const id = adventure.location.id;
    const data = await this.locationService.findLocations([id]);
    return data;
  }

  @Query(() => [Adventure], { name: 'allAdventures' })
  async adventures() {
    const data = await this.adventureService.findAllAdventures();
    console.log('this is data in All Adventures Query: ', data);
    return data;
  }

  @Query(() => Adventure, { name: 'Adventure' })
  async oneLocation(@Args('id', { type: () => Int }) id: number) {
    const data = await this.adventureService.findAdventuresById([id]);
    // console.log('data in locations resolver: ', data);
    return data;
  }

  @Mutation(() => Adventure, { name: 'createAdventure' })
  async createAdventure(
    @Args('createAdventure')
    { name, createdBy, location, message, time }: CreateAdventureArgs,
  ) {
    const data = await this.adventureService.createAdventure({
      name,
      createdBy,
      location,
      message,
      time,
    });
    console.log('this is data in createAdventure: ', data);
    return data;
  }

  @Mutation(() => Adventure, { name: 'updateAdventure' })
  async updateAdventure(
    @Args('adventure')
    { id, name, location, message, time }: UpdateAdventureArgs,
  ) {
    const data = await this.adventureService.updateAdventure({
      id,
      name,
      location,
      message,
      time,
    });
    console.log('this is data in createAdventure: ', data);
    return data;
  }
}
