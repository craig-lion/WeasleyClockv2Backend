import { InputType, Field, Int } from '@nestjs/graphql';
// import { AdventureRequest } from 'src/requests/adventureRequest.model';

@InputType()
export class CreateAdventureArgs {
  @Field(() => String)
  name: string;

  @Field(() => Date, { nullable: true })
  time?: Date;

  @Field(() => Int)
  createdBy: number;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Int)
  location: number;
}
