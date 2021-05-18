import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateLocationInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) lnglat?: string;
  @Field({ nullable: true }) privacy?: string;
  @Field(() => [Int], { nullable: true }) favoritedBy?: [number];
  @Field(() => [Int], { nullable: true }) locations?: [number];
  // @Field(() => [Number], { nullable: true }) adventures?: [number];
}
