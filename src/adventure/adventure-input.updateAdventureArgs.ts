import { InputType, Field, Int } from '@nestjs/graphql';
// import { AdventureRequest } from 'src/requests/adventureRequest.model';

@InputType()
export class UpdateAdventureArgs {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Date, { nullable: true })
  time?: Date;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Int)
  location?: number;
}
