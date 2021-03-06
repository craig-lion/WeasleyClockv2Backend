import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { Connection, Repository } from 'typeorm';
import { Location } from './location.model';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    private connection: Connection,
  ) {}

  async findLocations(ids: number[]): Promise<Location[]> {
    if (ids.length === 0) {
      // console.log('this is what is happening');
      return [];
    }
    const options = {
      where: ids.map((id) => {
        return { id };
      }),
      relations: ['createdBy'],
    };
    // console.log('this is options in findLocations locationService: ', options);
    const data = await this.locationsRepository.find(options);
    return data;
  }

  async allLocations(): Promise<Location[]> {
    const options = {
      relations: ['createdBy'],
    };
    return this.locationsRepository.find(options);
  }

  async allPublicLocations(): Promise<Location[]> {
    const options = {
      // where: { privacy: 'public' },
      relations: ['createdBy'],
    };
    const data = await this.locationsRepository.find(options);

    console.log('data in all Public Locations: ', data);

    return data;
  }
  async allFriendLocations(user: User): Promise<Location[]> {
    const friendIds: number[] = user.friends
      .filter((friend) => friend.status === 'accepted')
      .map((friend) => friend.id);

    const options = {
      where: {
        createdBy: [...friendIds],
        privacy: 'friends',
      },
      relations: ['createdBy'],
    };
    return this.locationsRepository.find(options);
  }

  async removeLocation(id: number): Promise<void> {
    await this.locationsRepository.delete(id);
  }

  //TODO: when createing location graph returns user 1 even if createdBy different user - data is entered correctly still

  async createLocation({ name, user, lnglat, privacy }) {
    const queryRunner = this.connection.createQueryRunner();
    const location = new Location();
    location.name = name;
    location.createdBy = user[0];
    location.createdOn = new Date();
    location.privacy = privacy || 'private';
    location.lnglat = lnglat || '37.773972, -122.431297';
    location.favoritedBy = [user[0]];

    console.log('this is location in createLocation', location);

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
    const location: Location = (await this.findLocations([id]))[0];
    if (name) {
      location.name = name;
    }
    if (lnglat) {
      location.lnglat = lnglat;
    }
    if (privacy) {
      location.privacy = privacy;
      console.log('privacy: ', location.privacy);
    }
    if (favoritedBy) {
      location.favoritedBy = favoritedBy;
    }
    // location.adventures = adventures;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(location);

      await queryRunner.commitTransaction();
      // return location;
    } catch (err) {
      // if we have errors rollback the changes
      console.log('err:', err);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      return location;
    }
  }
}
