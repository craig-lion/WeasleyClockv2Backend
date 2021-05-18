import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Adventure } from 'src/adventure/adventure.model';
import { User } from '../user/user.model';

@ObjectType()
@Entity()
export class Location {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({
    unique: true,
  })
  name: string;

  @Field(() => String, { nullable: true })
  @Column()
  lnglat: string;

  @Field(() => String)
  @Column()
  privacy: 'public' | 'private' | 'friends';

  @Field(() => Date)
  @CreateDateColumn()
  createdOn: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdLocations)
  createdBy: User;

  @Field(() => User, { nullable: true })
  @ManyToMany(() => User, (user) => user.locations)
  currentUsers: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.favoriteLocations)
  favoritedBy: User[];

  @Field(() => [Adventure], { nullable: true })
  @OneToMany(() => Adventure, (adventure) => adventure.location)
  adventures: Adventure[];
}
