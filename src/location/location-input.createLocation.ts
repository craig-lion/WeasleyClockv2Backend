import { Field, InputType, Int } from '@nestjs/graphql';

// @InputType()
// class UserDTO {
//   @Field()
//   id: number;
// }
@InputType()
export class CreateLocationArgs {
  @Field() name: string;
  @Field(() => Int) createdBy: number;
  @Field({ nullable: true }) lnglat?: string;
  @Field({ nullable: true }) privacy?: string;
}
