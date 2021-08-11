import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { VerifiedUser } from 'src/user/verifiedUser.model';
import { CreateFriendRequestInput } from './friendRequest-input.createFriendRequestArgs';
import { UpdateFriendRequestInput } from './friendRequest-input.updateFriendRequestArgs';
import { FriendRequest } from './friendRequest.model';
import { FriendRequestService } from './friendRequest.service';
import { FriendRequestData } from '../user/friendRequestData.model';

export class UpdateFriendRequestData {
  userId: number;
  recipientId: number;
  status: 'rejected' | 'accepted' | 'pending';
  constructor(
    userID: number,
    recipientId: number,
    status: 'rejected' | 'accepted' | 'pending',
  ) {
    this.userId = this.userId;
    this.recipientId = recipientId;
    this.status = status;
  }
}

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

  @Query(() => [FriendRequest], { name: 'allFriendRequests' })
  async allFriendRequests(): Promise<FriendRequest[]> {
    const data = await this.friendRequestService.findAll();
    console.log('this is data in allFriendRequestsResolver: ', data);
    return data;
  }

  // TODO - Replace Name Args with user.name from context
  @Query(() => FriendRequestData, { name: 'userfriendRequests' })
  async oneUserFriendRequests(
    @CurrentUser() user: VerifiedUser,
  ): Promise<FriendRequestData | null> {
    const allRequests: FriendRequest[] = await this.friendRequestService.findUserRequests(
      user.id,
    );
    const acceptedFriends: FriendRequest[] = allRequests.filter(
      (friend) => friend.status === 'accepted',
    );
    const pendingFriends: FriendRequest[] = allRequests.filter(
      (friend) => friend.status === 'pending',
    );
    const rejectedFriends: FriendRequest[] = allRequests.filter(
      (friend) => friend.status === 'rejected',
    );
    const friendRequestData = new FriendRequestData();

    if (acceptedFriends.length) {
      const acceptedData: User[] = await this.userService.find(
        acceptedFriends.map((friend) => {
          if (friend.createdBy.id === user.id) {
            return friend.recipient.id;
          } else {
            return friend.createdBy.id;
          }
        }),
      );
      friendRequestData.accepted = acceptedData;
    }

    if (pendingFriends.length) {
      const pendingData: User[] = await this.userService.find(
        pendingFriends.map((friend) => {
          if (friend.createdBy.id === user.id) {
            return friend.recipient.id;
          } else {
            return friend.createdBy.id;
          }
        }),
      );
      friendRequestData.pending = pendingData;
    }

    if (rejectedFriends.length) {
      const rejectedData: User[] = await this.userService.find(
        pendingFriends.map((friend) => {
          if (friend.createdBy.id === user.id) {
            return friend.recipient.id;
          } else {
            return friend.createdBy.id;
          }
        }),
      );
      friendRequestData.rejected = rejectedData;
    }

    // console.log(
    //   'this is fullData in FriendRequests Resolver: ',
    //   friendRequestData,
    // );
    return friendRequestData;
  }

  @Mutation(() => FriendRequest, { name: 'createFriendRequest' })
  async createFriendRequest(
    @CurrentUser() user: VerifiedUser,
    @Args('createFriendRequestInput')
    { recipient }: CreateFriendRequestInput,
  ): Promise<FriendRequest> {
    const data = await this.friendRequestService.createFriendRequest({
      user,
      recipient,
    });
    // console.log('this is data in createFriendRequest: ', data);
    return data;
  }

  @Mutation(() => FriendRequest, { name: 'updateFriendRequest' })
  async updateFriendRequest(
    @CurrentUser() user: VerifiedUser,
    @Args('updateFriendRequestInput')
    { id, status }: UpdateFriendRequestInput,
  ): Promise<FriendRequest> {
    console.log('just checking');
    const updateFriendRequestData = new UpdateFriendRequestData(
      user.id,
      id,
      status,
    );
    const data = await this.friendRequestService.updateFriendRequest(
      updateFriendRequestData,
    );
    console.log('this is data in updateFriendRequest: ', data);
    return data;
  }
}
