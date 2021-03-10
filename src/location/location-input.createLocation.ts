import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateLocationArgs {
  @Field() name: string;
  @Field(() => Int) createdBy: number;
  @Field({ nullable: true }) lnglat?: string;
  @Field({ nullable: true }) privacy?: string;
}
