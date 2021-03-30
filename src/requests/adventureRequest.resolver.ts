import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { Adventure } from 'src/adventure/adventure.model';
import { AdventureService } from 'src/adventure/adventure.service';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateAdventureRequestArgs } from './adventureRequest-input.createAdventureRequestArgs';
import { UpdateAdventureRequestArgs } from './adventureRequest-input.updateAdventureRequestArgs';
import { AdventureRequest } from './adventureRequest.model';
import { AdventureRequestService } from './adventureRequest.service';

@Resolver(() => AdventureRequest)
export class AdventureRequestResolver {
  constructor(
    private adventureRequestService: AdventureRequestService,
    private userService: UserService,
    private adventureService: AdventureService,
  ) {}

  @ResolveField('createdBy', () => User)
  async getCreatedBy(@Parent() adventureRequest: AdventureRequest) {
    const id = adventureRequest.createdBy.id;
    const data = await this.userService.find([id]);
    return data;
  }

  @ResolveField('recipient', () => User)
  async getRecipient(@Parent() adventureRequest: AdventureRequest) {
    const id = adventureRequest.recipient.id;
    const data = await this.userService.find([id]);
    return data;
  }

  @ResolveField('adventure', () => Adventure)
  async getAdventure(@Parent() adventureRequest: AdventureRequest) {
    console.log('this is adventureRequest: ', adventureRequest);
    const id = adventureRequest.adventure.id;
    const data = await this.adventureService.findAdventuresByLocationId([id]);
    console.log(
      'this is data in getAdventure adventureRequest Resolver: ',
      data,
    );
    return data;
  }

  @Query(() => [AdventureRequest], { name: 'AllAdventureRequests' })
  async allAdventureRequests() {
    const data = await this.adventureRequestService.findAll();
    console.log('this is data in allAdventureRequestsResolver: ', data);
    return data;
  }
  @Query(() => AdventureRequest, { name: 'AdventureRequest' })
  async oneAdventureRequest(@Args('id', { type: () => Int }) id: number) {
    const data = await this.adventureRequestService.find([id]);
    console.log(
      'this is data in oneAdventureRequestResolver: ',
      data,
      'isArray?',
      Array.isArray(data),
    );
    // ToDo returning data correctly but it seems that it is not in the expected shape?
    return data[0];
  }

  @Mutation(() => AdventureRequest, { name: 'createAdventureRequest' })
  async createAdventureRequest(
    @Args('createAdventureRequest')
    { createdBy, recipient, adventure }: CreateAdventureRequestArgs,
  ) {
    const data = await this.adventureRequestService.createAdventureRequest({
      createdBy,
      recipient,
      adventure,
    });
    console.log('this is data in createAdventureRequest: ', data);
    return data;
  }

  @Mutation(() => AdventureRequest, { name: 'updateAdventureRequest' })
  async updateAdventureRequest(
    @Args('updateAdventureRequest')
    { id, status }: UpdateAdventureRequestArgs,
  ) {
    const data = await this.adventureRequestService.updateAdventureRequest({
      id,
      status,
    });
    console.log('this is data in updateFriendRequest: ', data);
    return data;
  }
}
