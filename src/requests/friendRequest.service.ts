import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { FriendRequest } from './friendRequest.model';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private connection: Connection,
  ) {}

  async findAll(): Promise<FriendRequest[]> {
    const data = await this.friendRequestRepository.find({
      relations: ['createdBy', 'recipient'],
    });
    // console.log('data in findAllFriendRequests: ', data);
    return data;
  }

  async find(ids: number[]) {
    if (ids.length === 0) {
      throw new Error('Please Provide Ids');
    }
    const options = {
      where: ids.map((id) => {
        return { id };
      }),
      relations: ['createdBy', 'recipient'],
    };
    // console.log('this is options: ', options);
    const data = await this.friendRequestRepository.find(options);
    // console.log('data in friendRequestFind: ', data);
    return data;
  }

  async findUserFiends(id: number): Promise<FriendRequest[] | null> {
    const options = {
      where: [{ recipient: { id } }, { createdBy: { id } }],
      relations: ['createdBy', 'recipient'],
    };
    console.log('this is options: ', options.where);
    const data = await this.friendRequestRepository.find(options);
    console.log('data in findUserFriends: ', data);
    return data;
  }

  async removeFriendRequest(id: number): Promise<void> {
    await this.friendRequestRepository.delete(id);
  }

  async createFriendRequest({ createdBy, recipient }): Promise<FriendRequest> {
    const queryRunner = this.connection.createQueryRunner();
    const friendRequest = new FriendRequest();
    friendRequest.createdBy = createdBy;
    friendRequest.recipient = recipient;
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

  async updateFriendRequest({ id, status }): Promise<FriendRequest> {
    const queryRunner = this.connection.createQueryRunner();
    const friendRequest = await this.find([id]);
    const newRequest = friendRequest[0];

    newRequest.id = id;
    newRequest.status = status;

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
