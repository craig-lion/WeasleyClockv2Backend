import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAdventureRequestArgs {
  @Field(() => Int)
  id: number;

  @Field()
  status: 'private' | 'public' | 'rejected';
}
