import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AdventureRequest } from './adventureRequest.model';

@Injectable()
export class AdventureRequestService {
  constructor(
    @InjectRepository(AdventureRequest)
    private adventureRequestRepository: Repository<AdventureRequest>,
    private connection: Connection,
  ) {}

  async findAll(): Promise<AdventureRequest[]> {
    const data = await this.adventureRequestRepository.find({
      relations: ['createdBy', 'recipient', 'adventure'],
    });
    // console.log('data in findAllFriendRequests: ', data);
    return data;
  }

  async find(ids: number[]) {
    if (ids.length === 0) {
      console.log('check');
      throw new Error('Must Provide Ids');
    }
    const options = {
      where: ids.map((id) => {
        return { id };
      }),
      relations: ['createdBy', 'recipient', 'adventure'],
    };
    console.log('this is options: ', options);
    const data = await this.adventureRequestRepository.find(options);
    // console.log('data in AdventureRequestFind: ', data);
    return data;
  }

  async removeAdventureRequest(id: number): Promise<void> {
    await this.adventureRequestRepository.delete(id);
  }

  async createAdventureRequest({ createdBy, recipient, adventure }) {
    const queryRunner = this.connection.createQueryRunner();
    const adventureRequest = new AdventureRequest();
    adventureRequest.createdBy = createdBy;
    adventureRequest.recipient = recipient;
    adventureRequest.status = 'pending';
    adventureRequest.adventure = adventure;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(adventureRequest);

      await queryRunner.commitTransaction();
      console.log('createAdventureRequest: ', adventureRequest);
      return adventureRequest;
    } catch (err) {
      // if we have errors we rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async updateAdventureRequest({ id, status }) {
    const queryRunner = this.connection.createQueryRunner();
    const adventureRequest = new AdventureRequest();
    adventureRequest.id = id;
    adventureRequest.status = status;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(adventureRequest);

      await queryRunner.commitTransaction();
    } catch (err) {
      // if we have errors rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
