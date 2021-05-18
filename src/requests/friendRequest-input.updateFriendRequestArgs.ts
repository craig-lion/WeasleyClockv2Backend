import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateFriendRequestInput {
  @Field(() => Int)
  id: number;

  @Field()
  status: 'accepted' | 'pending' | 'rejected';
}
