import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GqlAuthGuard } from './auth/gql-auth.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log('log');
  const app = await NestFactory.create(AppModule);
  console.log('its big its heavy its wood');
  const configService = app.get(ConfigService);
  const secret = configService.get('SECRET');
  const reflector: Reflector = app.get(Reflector);
  const port = configService.get('PORT');
  const test = process.env.PORT;
  console.log('this is process.env: ', test);
  console.log('this is port: ', port);
  console.log('secret');
  app.useGlobalGuards(new GqlAuthGuard(secret, reflector));
  await app.listen(port || 3000);
}
bootstrap();
