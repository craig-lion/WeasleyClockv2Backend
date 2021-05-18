import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { VerifiedUser } from 'src/user/verifiedUser.model';
import { Connection, Repository } from 'typeorm';
import { FriendRequest } from './friendRequest.model';
import { UpdateFriendRequestData } from './friendRequest.resolver';

interface CreatedBy {
  name: string;
}

interface Recipient {
  name: string;
}

export class QueryOptions {
  relations: string[];
  where?: {
    createdBy: CreatedBy;
    recipient: Recipient;
  };
}

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private connection: Connection,
    private userService: UserService,
  ) {}

  async findAll(): Promise<FriendRequest[]> {
    const options = {
      relations: ['createdBy', 'recipient'],
    };
    console.log('this is options in findAll friendRequestResolver: ', options);
    const data = await this.friendRequestRepository.find(options);
    // console.log('data in findAllFriendRequests: ', data);
    return data;
  }

  async findUserRequests(id: number): Promise<FriendRequest[]> {
    const options = {
      where: [{ recipient: { id } }, { createdBy: { id } }],
      relations: ['createdBy', 'recipient'],
    };
    // console.log('this is options: ', options.where);
    const data = await this.friendRequestRepository.find(options);
    console.log('data in findUserRequests: ', data.length);
    return data;
  }

  async findOneRequest(
    createdById: number,
    recipientId: number,
  ): Promise<FriendRequest> {
    const options = {
      where: [
        { recipient: { id: recipientId } },
        { createdBy: { id: createdById } },
      ],
      relations: ['createdBy', 'recipient'],
    };
    const findOneRequestData: FriendRequest[] = await this.friendRequestRepository.find(
      options,
    );

    return findOneRequestData[0];
  }

  async find(ids: number[]): Promise<FriendRequest[]> {
    console.log('friendRequest');
    if (ids.length === 0) {
      throw new Error('Please Provide Ids');
    }
    const options = {
      where: ids.map((id) => {
        return { id };
      }),
      relations: ['createdBy', 'recipient'],
    };
    console.log('this is options: ', options);
    const data = await this.friendRequestRepository.find(options);
    console.log('data in friendRequestFind: ', data);
    return data;
  }

  async findPendingFriendsByName(
    name: string,
  ): Promise<FriendRequest[] | null> {
    const options = {
      where: [
        { recipient: { name } },
        { createdBy: { name } },
        { status: 'pending' },
      ],
      relations: ['createdBy', 'recipient'],
    };
    // console.log('this is options: ', options.where);
    const data = await this.friendRequestRepository.find(options);
    // console.log('data in findUserFriends: ', data);
    return data;
  }

  // TODO - Probalby should use name for all service methods instead of id
  async findFriendsByName(name: string): Promise<FriendRequest[] | null> {
    const options = {
      where: [
        { recipient: { name } },
        { createdBy: { name } },
        { status: 'accepted' },
      ],
      relations: ['createdBy', 'recipient'],
    };
    // console.log('this is options: ', options.where);
    const data = await this.friendRequestRepository.find(options);
    // console.log('data in findUserFriends: ', data);
    return data;
  }

  async removeFriendRequest(id: number): Promise<void> {
    await this.friendRequestRepository.delete(id);
  }

  async createFriendRequest({
    user,
    recipient,
  }: {
    user: VerifiedUser;
    recipient: number;
  }): Promise<FriendRequest> {
    const queryRunner = this.connection.createQueryRunner();
    const friendRequest = new FriendRequest();
    const creatorUser = await this.userService.findOne(user.id);
    const recieverUser = await this.userService.findOne(recipient);
    friendRequest.createdBy = creatorUser;
    friendRequest.recipient = recieverUser;
    friendRequest.createdOn = new Date();
    friendRequest.status = 'pending';

    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(friendRequest);

      // console.log('friendRequest before commit: ', friendRequest);
      await queryRunner.commitTransaction();
    } catch (err) {
      // if we have errors we rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      return friendRequest;
    }
  }

  async updateFriendRequest(
    updateFriendRequestData: UpdateFriendRequestData,
  ): Promise<FriendRequest> {
    const { userId, recipientId, status } = updateFriendRequestData;
    const queryRunner = this.connection.createQueryRunner();
    const friendRequest = await this.findOneRequest(userId, recipientId);
    const newRequest = friendRequest;
    newRequest.status = status;
    if (status === 'accepted') {
      newRequest.acceptedOn = new Date();
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(newRequest);

      await queryRunner.commitTransaction();
      // console.log('this is newRequestUpdate: ', newRequest);
    } catch (err) {
      // if we have errors rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      return newRequest;
    }
  }
}
