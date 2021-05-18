import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field() name: string;
  @Field({ nullable: true }) lnglat?: string;
  @Field({ nullable: true }) privacy?: string;
}
