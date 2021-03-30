import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { CreateFriendRequestArgs } from './friendRequest-input.createFriendRequestArgs';
import { UpdateFriendRequestArgs } from './friendRequest-input.updateFriendRequestArgs';
import { FriendRequest } from './friendRequest.model';
import { FriendRequestService } from './friendRequest.service';

@Resolver(() => FriendRequest)
export class FriendRequestResolver {
  constructor(
    private friendRequestService: FriendRequestService,
    private userService: UserService,
  ) {}

  @ResolveField('createdBy', () => User)
  async getCreatedBy(@Parent() friendRequest: FriendRequest): Promise<User> {
    const id = friendRequest.createdBy.id;
    const data = await this.userService.find([id]);
    console.log('thi is createdBy in friendRequest: ', data);
    return data[0];
  }

  @ResolveField('recipient', () => User)
  async getRecipient(@Parent() friendRequest: FriendRequest): Promise<User> {
    const id = friendRequest.recipient.id;
    const data = await this.userService.find([id]);
    return data[0];
  }

  @Query(() => [FriendRequest], { name: 'AllFriendRequests' })
  async allFriendRequests(): Promise<FriendRequest[]> {
    const data = await this.friendRequestService.findAll();
    console.log('this is data in allFriendRequestsResolver: ', data);
    return data;
  }
  @Query(() => FriendRequest, { name: 'FriendRequest' })
  async oneFriendRequest(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<FriendRequest> {
    const data = await this.friendRequestService.find([id]);
    console.log('this is data in FriendRequestsResolver: ', data);

    return data[0];
  }

  @Mutation(() => FriendRequest, { name: 'createFriendRequest' })
  async createFriendRequest(
    @Args('createFriendRequest')
    { createdBy, recipient }: CreateFriendRequestArgs,
  ): Promise<FriendRequest> {
    const data = await this.friendRequestService.createFriendRequest({
      createdBy,
      recipient,
    });
    // console.log('this is data in createFriendRequest: ', data);
    return data;
  }

  @Mutation(() => FriendRequest, { name: 'updateFriendRequest' })
  async updateFriendRequest(
    @Args('updateFriendRequest')
    { id, status }: UpdateFriendRequestArgs,
  ): Promise<FriendRequest> {
    const data = await this.friendRequestService.updateFriendRequest({
      id,
      status,
    });
    console.log('this is data in updateFriendRequest: ', data);
    return data;
  }
}
