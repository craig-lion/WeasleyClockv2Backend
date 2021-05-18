import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => [Int], { nullable: true })
  locations?: [number];

  @Field(() => Int, { nullable: true })
  currentLocation?: number;

  @Field(() => [Int], { nullable: true })
  favoriteLocations?: [number];
}
