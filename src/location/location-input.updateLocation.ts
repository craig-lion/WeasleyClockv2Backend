import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class UpdateLocationArgs {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) lnglat?: string;
  @Field({ nullable: true }) privacy?: string;
  // @Field(() => [Number], { nullable: true }) favoritedBy?: [number];
  // @Field(() => [Number], { nullable: true }) adventures?: [number];
}
