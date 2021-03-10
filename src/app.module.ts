import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Location } from './location/location.model';
import { LocationModule } from './location/location.module';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
// import { TypeOrmModule}

@Module({
  imports: [
    UserModule,
    LocationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'weasleydb.cb6bf06bnvd1.us-west-1.rds.amazonaws.com',
      port: 5432,
      username: 'lion',
      password: 'dumxAb-netwod-7sosza',
      database: 'weasleydb',
      entities: [
        User,
        Location,
        // Adventure,
        // FriendRequest,
        // AdventureRequest,
      ],
      synchronize: false,
      dropSchema: false,
      logging: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
