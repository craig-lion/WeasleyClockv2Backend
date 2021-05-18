import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFriendRequestInput {
  @Field()
  recipient: number;
}
