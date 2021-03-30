import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { Location } from '../location/location.model';
import { AdventureRequest } from 'src/requests/adventureRequest.model';

@ObjectType()
@Entity()
export class Adventure {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Date)
  @Column()
  time: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdAdventures)
  createdBy: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdOn: Date;

  @Field(() => String, { nullable: true })
  @Column()
  message: string;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.adventures)
  location: Location;

  @Field(() => AdventureRequest, { nullable: true })
  @OneToMany(
    () => AdventureRequest,
    (adventureRequest) => adventureRequest.adventure,
  )
  requests: AdventureRequest[];
}
