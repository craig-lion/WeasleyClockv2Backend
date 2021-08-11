import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@ObjectType()
export class FriendRequestData {
  @Field(() => [User], { nullable: true })
  accepted: User[] | null;

  @Field(() => [User], { nullable: true })
  pending: User[] | null;

  @Field(() => [User], { nullable: true })
  rejected: User[] | null;

  constructor() {
    this.accepted = null;
    this.pending = null;
    this.rejected = null;
  }
}
