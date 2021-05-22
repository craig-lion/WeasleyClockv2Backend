import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GqlAuthGuard } from './auth/gql-auth.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const secret = configService.get('SECRET');
  const reflector: Reflector = app.get(Reflector);
  app.useGlobalGuards(new GqlAuthGuard(secret, reflector));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
