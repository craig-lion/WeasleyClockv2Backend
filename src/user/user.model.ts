import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Location } from '../location/location.model';
import { Adventure } from '../adventure/adventure.model';
import { AdventureRequest } from 'src/requests/adventureRequest.model';
import { FriendRequest } from 'src/requests/friendRequest.model';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({
    unique: true,
    nullable: true,
  })
  name: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => Location, { nullable: true })
  @ManyToOne(() => Location, (location) => location.currentUsers)
  currentLocation: Location;

  @Field(() => [Location], { nullable: true })
  @ManyToMany(() => Location, (location) => location.currentUsers)
  @JoinTable({
    name: 'user_locations',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'locationId', referencedColumnName: 'id' },
  })
  locations: Location[];

  @Field(() => [Location], { nullable: true })
  @ManyToMany(() => Location, (location) => location.currentUsers, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_favoriteLocations',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'locationId', referencedColumnName: 'id' },
  })
  favoriteLocations: Location[];

  // make sure created Locations can be empty but always at least returns emptry array

  @Field(() => [Location], { nullable: true })
  @OneToMany(() => Location, (location) => location.createdBy)
  createdLocations: Location[];

  @Field(() => [Adventure], { nullable: true })
  @OneToMany(() => Adventure, (adventure) => adventure.createdBy)
  createdAdventures: Adventure[];

  @Field(() => [AdventureRequest], { nullable: true })
  @OneToMany(
    () => AdventureRequest,
    (adventureRequest) => adventureRequest.recipient,
  )
  adventures?: AdventureRequest[];

  @Field(() => [FriendRequest], { nullable: true })
  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.recipient)
  friends: FriendRequest[];
}
