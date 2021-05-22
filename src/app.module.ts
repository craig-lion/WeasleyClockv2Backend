import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Adventure } from './adventure/adventure.model';
import { AdventureModule } from './adventure/adventure.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientController } from './client/client.controller';
import { Location } from './location/location.model';
import { LocationModule } from './location/location.module';
import { AdventureRequest } from './requests/adventureRequest.model';
import { FriendRequest } from './requests/friendRequest.model';
import { RequestsModule } from './requests/requests.module';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { ClientService } from './client/client.service';
import { ClientMiddleware } from './client/client.middleware';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// console.log('looking for secret: ', process.env);

@Module({
  imports: [
    UserModule,
    LocationModule,
    AdventureModule,
    RequestsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'weasleydb.cb6bf06bnvd1.us-west-1.rds.amazonaws.com',
        port: 5432,
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Location, Adventure, FriendRequest, AdventureRequest],
        synchronize: true,
        dropSchema: false,
        logging: false,
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ headers: req.headers }),
    }),
  ],
  controllers: [AppController, ClientController],
  providers: [AppService, ClientService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientMiddleware).forRoutes(ClientController);
  }
}