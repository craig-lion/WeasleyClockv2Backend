import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Adventure } from './adventure.model';

@Injectable()
export class AdventureService {
  constructor(
    @InjectRepository(Adventure)
    private adventuresRepository: Repository<Adventure>,
    private connection: Connection,
  ) {}

  findAllAdventures(): Promise<Adventure[]> {
    return this.adventuresRepository.find({
      relations: ['location', 'createdBy'],
    });
  }

  async findAdventuresById(ids: number[]): Promise<Adventure[]> {
    if (ids.length === 0) {
      console.log('check');
      throw new Error('Must provide id');
    }
    const options = {
      where: ids.map((id) => {
        return { id };
      }),
      relations: ['location', 'createdBy'],
    };
    console.log('this is options: ', options);
    const data = await this.adventuresRepository.find(options);
    console.log('this is data in findAdventureByID:', data);
    return data;
  }

  async findAdventuresByLocationId(ids: number[]): Promise<Adventure[]> {
    if (ids.length === 0) {
      console.log('check');
      throw new Error('Must provide id');
    }
    const options = {
      where: ids.map((id) => {
        return { location: { id } };
      }),
      relations: ['location', 'createdBy'],
    };
    // console.log('this is options: ', options);
    const data = await this.adventuresRepository.find(options);
    // console.log('data in findAdventuresByLocationId: ', data);
    return data;
  }

  async removeAdventure(id: number): Promise<void> {
    await this.adventuresRepository.delete(id);
  }

  async createAdventure({ name, createdBy, location, message, time }) {
    const queryRunner = this.connection.createQueryRunner();
    const adventure = new Adventure();
    adventure.name = name;
    adventure.createdBy = createdBy;
    adventure.location = location;
    adventure.time = time || new Date();
    adventure.message = message || '';

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(adventure);

      await queryRunner.commitTransaction();
      return adventure;
    } catch (err) {
      // if we have errors we rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
  async updateAdventure({ id, name, location, message, time }) {
    const queryRunner = this.connection.createQueryRunner();
    // How do I grab just 1 adventure in one step
    const adventures = await this.findAdventuresById([id]);
    const newAdventure = adventures[0];
    if (name) {
      newAdventure.name = name;
    }
    if (location) {
      newAdventure.location = location;
    }
    if (time) {
      newAdventure.time = time;
    }
    if (message) {
      newAdventure.message = message;
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(newAdventure);

      await queryRunner.commitTransaction();
      return newAdventure;
    } catch (err) {
      // if we have errors rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
