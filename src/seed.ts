import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const seeder = app.get(SeedService);
  await seeder.seed();
  await app.close();
}

bootstrap();
