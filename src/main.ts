import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalSetupValidations, setUpCookies, setupCors, setupHelmets } from './common/secuirities/secuirity';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 20971520,
    }),
  );

  //await trackSecurity(app); //very trackcode in middleware
  await globalSetupValidations(app);
  //await setupSwagger(app);
  await setUpCookies(app);
  try {
    await Promise.all([setupCors(app), setupHelmets(app)]);
    await app.listen(process.env.PORT, '');
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}
bootstrap();
