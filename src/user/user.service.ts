import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async findUsers(): Promise<User[]> {
    // console.log('users', await this.usersRepository.find());
    return this.usersRepository.find({
      relations: [
        'currentLocation',
        'createdLocations',
        'favoriteLocations',
        'friends',
      ],
    });
  }

  async find(ids: number[]) {
    if (ids.length === 0) {
      console.log('check');
      throw new Error('Please Provide Ids');
    }
    const options = {
      where: ids.map((id) => {
        return { id };
      }),
      relations: [
        'currentLocation',
        'createdLocations',
        'favoriteLocations',
        'friends',
      ],
    };
    // console.log('this is options: ', options);
    const data = await this.usersRepository.find(options);
    // console.log('this is data: ', data);
    return data;
  }
  async findByName(name: string) {
    const options = {
      where: { name },
      relations: ['currentLocation', 'createdLocations', 'favoriteLocations'],
    };
    console.log('this is options: ', options);
    const data = await this.usersRepository.find(options);
    return data;
  }

  async removeUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createUser(name, password, currentLocation) {
    const queryRunner = this.connection.createQueryRunner();
    const user = new User();
    user.name = name;
    user.password = password;
    user.currentLocation = currentLocation;

    console.log(user);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return user;
    } catch (err) {
      // if we have errors we rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return `New User ${name} Created`;
  }

  async updateUser({
    id,
    name,
    password,
    currentLocationObj,
    favoriteLocations,
  }) {
    const queryRunner = this.connection.createQueryRunner();
    // console.log('this is id in updateUser: ', id);
    const user = await this.find([id]);
    console.log('user after find: ', user);

    if (name) {
      user[0].name = name;
    }
    if (password) {
      user[0].password = password;
    }
    if (currentLocationObj) {
      user[0].currentLocation = currentLocationObj[0];
    }
    if (favoriteLocations) {
      user[0].favoriteLocations = favoriteLocations;
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log('user before save', user);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      // console.log('user after commit', user);
      return user[0];
    } catch (err) {
      // if we have errors rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
