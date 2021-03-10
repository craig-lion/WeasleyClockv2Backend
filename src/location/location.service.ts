import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Location } from './location.model';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    private connection: Connection,
  ) {}

  async findLocations(id?: number[]): Promise<Location[]> {
    if (id.length === 0) {
      console.log('check');
      return null;
    }
    const options = {
      where: id.map((id) => {
        return { id };
      }),
      relations: ['createdBy'],
    };
    const data = await this.locationsRepository.find(options);
    return data;
  }

  findLocation(id: number): Promise<Location> {
    return this.locationsRepository.findOne(id);
  }

  async removeLocation(id: number): Promise<void> {
    await this.locationsRepository.delete(id);
  }

  //TODO: when createing location graph returns user 1 even if createdBy different user - data is entered correctly still

  async createLocation({ name, createdBy, lnglat, privacy }) {
    const queryRunner = this.connection.createQueryRunner();
    const location = new Location();
    location.name = name;
    location.createdBy = createdBy;
    location.createdOn = new Date();
    location.privacy = privacy || 'private';
    location.lnglat = lnglat || '37.773972, -122.431297';
    location.favoritedBy = [createdBy];

    console.log('this is location', location);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(location);
      await queryRunner.commitTransaction();
      return location;
    } catch (err) {
      console.error(err);
      // if we have errors we rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  // TODO: either us separate @Args or inline Args for everything

  async updateLocation({
    id,
    name,
    lnglat,
    privacy,
    favoritedBy,
    // adventures,
  }) {
    const queryRunner = this.connection.createQueryRunner();
    const location = new Location();
    location.id = id;
    if (name) {
      location.name = name;
    }
    if (lnglat) {
      location.lnglat = lnglat;
    }
    if (privacy) {
      location.privacy = privacy;
    }
    if (favoritedBy) {
      location.favoritedBy = favoritedBy;
    }
    // location.adventures = adventures;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      return await queryRunner.manager.save(location);

      await queryRunner.commitTransaction();
      return location;
    } catch (err) {
      // if we have errors rollback the changes
      console.log('err:', err);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
