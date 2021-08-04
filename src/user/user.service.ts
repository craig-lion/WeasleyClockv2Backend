import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, Not, In } from 'typeorm';
import { User } from './user.model';
import { Location } from 'src/location/location.model';
import { VerifiedUser } from './verifiedUser.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  saltRounds = 10;
  async findUsers(notTheseUsers?: Set<number>): Promise<User[]> {
    // TODO - DO NOT RETURN PASSWORD
    const options = {
      relations: [
        'currentLocation',
        'locations',
        // 'createdLocations',
        // 'favoriteLocations',
        'friends',
      ],
    };
    if (notTheseUsers) {
      const nameArray = Array.from(notTheseUsers);
      (options['where'] = [
        {
          id: Not(In(nameArray)),
        },
      ]),
        console.log('this is nameArray: ', nameArray);
    }
    return this.usersRepository.find(options);
  }

  async find(ids: number[]): Promise<User[]> {
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
        'locations',
        // 'createdLocations',
        // 'favoriteLocations',
        'friends',
      ],
    };
    // console.log('this is options: ', options);
    const data = await this.usersRepository.find(options);
    // console.log('this is data: ', data);
    return data;
  }

  async findOne(id: number): Promise<User> {
    const options = {
      where: { id },
      relations: ['currentLocation', 'locations', 'friends'],
    };
    console.log('this is options: ', options);
    const data = await this.usersRepository.find(options);
    // console.log('data in userService findeOne: ', data);
    return data[0];
  }

  async verifyUser(
    name: string,
    password: string,
  ): Promise<VerifiedUser | null> {
    const user = await this.findByName(name);
    // console.log('this is user: ', user);

    const passwordsDidMatch: boolean = await bcrypt.compare(
      password,
      user[0].password,
    );

    if (passwordsDidMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user[0];
      const verifiedUser: VerifiedUser = rest;
      return verifiedUser;
    }

    return null;
  }

  // TODO - methods should return User not USer[]
  async findByName(name: string): Promise<User[] | boolean> {
    const options = {
      where: { name },
      relations: [
        'currentLocation',
        'locations',
        // 'createdLocations',
        // 'favoriteLocations',
        'friends',
      ],
    };
    // console.log('this is options: ', options);
    // Find User
    const data = await this.usersRepository.find(options);
    // console.log('returned user in FindByname Pre Pass: ', data[0]);

    return data;
  }

  async removeUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // TODO - currentLocation should be shaped as currentLocation.id = number
  async createUser(
    name: string,
    password: string,
    currentLocation,
  ): Promise<User> {
    const queryRunner = this.connection.createQueryRunner();
    const user = new User();
    user.name = name;
    user.currentLocation = currentLocation;

    // await bcrypt.hash(password, this.saltRounds, (err, hash) => {
    //   if (err) throw new Error('Problem Hashing Password');
    //   console.log('this is hash: ', hash);
    //   user.password = hash;
    // });

    const hashedPass = await bcrypt.hash(password, this.saltRounds);
    user.password = hashedPass;

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
    return user;
  }
  // TODO - type inputs properly

  async updateUser({
    currentUser,
    newName,
    password,
    locationsArray,
    currentLocationObj,
    favoriteLocationsArray,
  }: {
    currentUser: number;
    newName: string | undefined;
    password: string | undefined;
    locationsArray: Location[];
    currentLocationObj: any;
    favoriteLocationsArray: Location[];
  }) {
    const queryRunner = this.connection.createQueryRunner();
    console.log('this is id in updateUser: ', currentUser);
    const user = await this.findOne(currentUser);
    console.log('user after find: ', user);

    if (newName) {
      user.name = newName;
    }
    if (password) {
      bcrypt.hash(password, this.saltRounds, (err, hash) => {
        if (err) throw new Error('Problem Hashing Password');
        user.password = hash;
      });
    }
    if (currentLocationObj) {
      // console.log('this is currentLocationObj: ', currentLocationObj);
      user.currentLocation = currentLocationObj[0];
    }
    if (locationsArray) {
      // console.log('this is locationsArrray: ', locationsArray);
      user.locations = [...user.locations, ...locationsArray];
    }
    if (favoriteLocationsArray) {
      // TODO - why is favorite locations not iterable?
      // user.favoriteLocations = [...user.favoriteLocations, ...favoriteLocationsArray];
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log('user before save', user);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      // console.log('user after commit', user);
      return user;
    } catch (err) {
      // if we have errors rollback the changes
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
  async addLocationHelper({
    currentUser,
    location,
  }: {
    currentUser: number;
    location: Location;
  }) {
    const queryRunner = this.connection.createQueryRunner();
    console.log('this is id in updateUser: ', currentUser);
    const user = await this.findOne(currentUser);
    console.log('user after find: ', user);

    user.locations = [...user.locations, location];

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log('user before save', user);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      // console.log('user after commit', user);
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
