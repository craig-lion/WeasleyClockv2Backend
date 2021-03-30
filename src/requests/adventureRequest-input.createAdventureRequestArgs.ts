import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAdventureRequestArgs {
  @Field(() => Int)
  createdBy: number;

  @Field(() => Int)
  recipient: number;

  @Field(() => Int)
  adventure: number;
}
