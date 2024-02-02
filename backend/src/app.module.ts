import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { HotelRoomsModule } from './modules/hotelRooms/hotelRooms.module';
import { ReservationModule } from './modules/reservations/reservations.module';
import { SupportRequestModule } from './modules/supportRequests/supportRequest.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL_CONNECTION || "mongodb://127.0.0.1:27017/mydb"),
    EventEmitterModule.forRoot({      
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 100,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    MulterModule.register({ dest: '../public/uploads' }),
    AuthModule,
    UsersModule,
    HotelsModule,
    HotelRoomsModule,
    ReservationModule,
    SupportRequestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
],
})
export class AppModule {}
