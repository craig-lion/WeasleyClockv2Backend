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
// import { Adventure } from '../adventure/adventure.model';
// import { AdventureRequest } from 'src/requests/adventureRequest.model';
// import { FriendRequest } from 'src/requests/friendRequest.model';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({
    unique: true,
  })
  name: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => Location, { nullable: true })
  @ManyToOne(() => Location, (location) => location.favoritedBy)
  currentLocation?: Location;

  // @Field(() => [Location], { nullable: true })
  // @ManyToMany(() => Location)
  // @JoinTable()
  // favoriteLocations?: Location[];

  @Field(() => [Location], { nullable: true })
  @ManyToMany(() => Location)
  @JoinTable({
    name: 'user_favoriteLocations',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'locationId', referencedColumnName: 'id' },
  })
  favoriteLocations?: Location[];

  @Field(() => [Location], { nullable: true })
  @OneToMany(() => Location, (location) => location.createdBy)
  createdLocations?: Location[];

  // @Field(() => [Adventure], { nullable: true })
  // @OneToMany(() => Adventure, (adventure) => adventure.createdBy)
  // createdAdventures?: Adventure[];

  // @Field(() => [AdventureRequest], { nullable: true })
  // @OneToMany(
  //   () => AdventureRequest,
  //   (adventureRequest) => adventureRequest.recipient,
  // )
  // adventures?: AdventureRequest[];

  // @Field(() => [FriendRequest], { nullable: true })
  // @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.recipient)
  // friends?: FriendRequest[];
}
