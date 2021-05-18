import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DataToken {
  @Field()
  token: string;
}
