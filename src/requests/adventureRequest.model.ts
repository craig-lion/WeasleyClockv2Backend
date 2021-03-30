import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.model';
import { Adventure } from '../adventure/adventure.model';

@ObjectType()
@Entity()
export class AdventureRequest {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.adventures)
  createdBy: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdOn: Date;

  @Field(() => String)
  @Column()
  status: 'pending' | 'accepted' | 'rejected';

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.adventures)
  recipient: User;

  @Field(() => Adventure)
  @ManyToOne(() => Adventure, (adventure) => adventure.requests)
  adventure: Adventure;
}
