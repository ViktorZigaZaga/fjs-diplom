import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filters/HttpException.filter';
import { WsAdapter } from './adapters/ws.adapter';
import * as dotenv from 'dotenv';
dotenv.config()

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(cookieParser());

  await app.listen(PORT, () => {
    console.log(`Server started on port = ${PORT}`);
  });
}
bootstrap();
