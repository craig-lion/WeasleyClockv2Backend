import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, FindManyOptions, Repository } from 'typeorm';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async findUsers(): Promise<User[]> {
    console.log('users', await this.usersRepository.find());
    return this.usersRepository.find();
  }

  findAll(options?: FindManyOptions<User>) {
    return this.usersRepository.find(options);
  }

  async findUser(id: number): Promise<User> {
    console.log(
      'id',
      id,
      'this should be a user: ',
      await this.usersRepository.findOne(id),
    );
    return await this.usersRepository.findOne(id);
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

  async updateUser(updateUserData) {
    const queryRunner = this.connection.createQueryRunner();
    const { id, name, password, currentLocation } = updateUserData;
    const user: User = await this.findUser(id);
    console.log('user after find: ', user);
    user.id = id;
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = password;
    }
    if (currentLocation) {
      user.currentLocation = currentLocation;
    }
    // user.favoriteLocations = favoriteLocations;
    // user.friends = friends;
    // console.log('user', user);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      console.log('user after commit', user);
      return user;
    } catch (err) {
      // if we have errors rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
