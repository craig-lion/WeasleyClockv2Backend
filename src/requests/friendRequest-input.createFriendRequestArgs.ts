import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFriendRequestArgs {
  @Field(() => Int)
  createdBy: number;

  @Field(() => Int)
  recipient: number;
}
