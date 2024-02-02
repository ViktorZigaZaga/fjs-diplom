import { Body, Controller, Get, Param, Post, Put, Query, Request, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';
import { ID } from "src/interfaces/ID.types";
import { HotelsService } from "../hotels/hotels.service";
import { HotelRoomsService } from "./hotelRooms.service";
import { MulterFilesInterceptor } from 'src/interceptors/fileUpload.interception';
import { UpdateHotelRoomParams } from "src/interfaces/hotel/UpdateHotelRoomParams.interface";
import { SearchRoomsParams } from "src/interfaces/hotel/SearchRoomsParams.interface";
import { HotelRoomDocument } from "src/schemas/hotelRoom.schema";
import { HotelDocument } from "src/schemas/hotel.schema";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { HotelRoomDtoValidate } from "./dto/HotelRoom.dto.validate";


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api')
export class HotelRoomsController {
    constructor(
        private hotelsService: HotelsService,
        private hotelRoomsService: HotelRoomsService,
    ) {}

    @Roles('admin')
    @Post('/admin/hotel-rooms/')
    @UseInterceptors(MulterFilesInterceptor())
    async addHotelRooms(
        @Body(DtoValidationPipe) hotelRoomDtoValidate: HotelRoomDtoValidate,
        @UploadedFiles() files: Array<Express.Multer.File>,
        ) {
        const hotelId = await this.hotelsService.findById(hotelRoomDtoValidate.hotel);
        const data = {
            hotel: hotelId._id,
            description: hotelRoomDtoValidate.description,
            images: files.map((file) => file.filename),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const hotelRoom = await this.hotelRoomsService.create(data);

        return {
            id: hotelRoom._id,
            description: hotelRoom.description,
            images: hotelRoom.images,
            isEnabled: hotelRoom.isEnabled,
            hotel: hotelRoom.hotel,
        };
    }

    @Roles('admin')
    @Put('/admin/hotel-rooms/:id')
    @UseInterceptors(MulterFilesInterceptor())
    async updateHotelRoom(
        @Param('id') id: ID, 
        @Body() updateHotelRoomParams: UpdateHotelRoomParams,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        let data = Object.assign({}, updateHotelRoomParams, {
            images: files.map((file) => file.filename),
        });
        if(updateHotelRoomParams.images?.length) {
            data.images.push(...updateHotelRoomParams.images)
        }
        await this.hotelRoomsService.update(id, data);
    }


    @Roles('client', 'admin', 'manager')
    @Get('/common/hotel-rooms/')
    async searchHotelRooms(
        @Query() searchRoomsParams: SearchRoomsParams, 
        @Request() req: any
    ) {
        const rooms = (await this.hotelRoomsService.search(searchRoomsParams)) as (HotelRoomDocument & {hotel: HotelDocument})[];
        return rooms.map((room) => {
            const {id, description, images, hotel} = room;
            return {
                id,
                description,
                images,
                hotel: {
                  id: hotel.id,
                  title: hotel.title,
                },
            }
        })
    }

    @Roles('client', 'admin', 'manager')
    @Get('/common/hotel-rooms/:id')
    async getRoom(@Param('id') id: ID) {
        const {  
            id: roomId,
            description,
            images,
            hotel, 
        } = (await this.hotelRoomsService.findById(id)) as HotelRoomDocument & {
            hotel: HotelDocument;
          };

        return {
            id: roomId,
            description,
            images,
            hotel: {
              id: hotel._id,
              description: hotel.description,
              title: hotel.title,
            },
        }
    }
}

