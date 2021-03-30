import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.model';

@ObjectType()
@Entity()
export class FriendRequest {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.friends)
  createdBy: User;

  @Field(() => Date)
  @Column()
  createdOn: Date;

  @Field(() => String)
  @Column()
  status: 'pending' | 'accepted' | 'rejected';

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.friends)
  recipient: User;
}
