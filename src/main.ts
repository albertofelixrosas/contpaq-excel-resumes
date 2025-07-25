import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.enableCors({
    origin: [
      configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Lanza error si vienen propiedades no permitidas
      forbidUnknownValues: true, // Asegura que los objetos no sean null o undefined
      transform: true, // Convierte tipos automáticamente (por ejemplo, de string a number)
    }),
  );

  // "ONE_DARK" es el que deje por defecto para la imagen oscura
  const choosedTheme: SwaggerThemeNameEnum = SwaggerThemeNameEnum.ONE_DARK;

  /*const WHITE_THEMES: SwaggerThemeNameEnum[] = [
    SwaggerThemeNameEnum.CLASSIC,
    SwaggerThemeNameEnum.FEELING_BLUE,
    SwaggerThemeNameEnum.FLATTOP,
    SwaggerThemeNameEnum.MATERIAL,
    SwaggerThemeNameEnum.MONOKAI,
    SwaggerThemeNameEnum.MUTED,
    SwaggerThemeNameEnum.NEWSPAPER,
    SwaggerThemeNameEnum.OUTLINE,
  ];*/

  /*
  const DARK_THEMES: SwaggerThemeNameEnum[] = [
    SwaggerThemeNameEnum.DARK,
    SwaggerThemeNameEnum.DARK_MONOKAI,
    SwaggerThemeNameEnum.DRACULA,
    SwaggerThemeNameEnum.GRUVBOX,
    SwaggerThemeNameEnum.NORD_DARK,
    SwaggerThemeNameEnum.ONE_DARK,
  ];
  */

  const config = new DocumentBuilder()
    .setTitle('API procesador de CONTPAQi industria porcina')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth() // opcional: si usas JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();
  const darkTheme = theme.getBuffer(choosedTheme);

  SwaggerModule.setup('api', app, document, {
    customCss: darkTheme,
  }); // http://localhost:<PORT>/api

  await app.listen(port);
  console.log(`🚀 Server running at http://localhost:${port}`);
}
bootstrap();
