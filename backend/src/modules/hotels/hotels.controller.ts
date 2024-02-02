import { Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, } from "@nestjs/common";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard'
import { ID } from "src/interfaces/ID.types";
import { HotelsService } from "./hotels.service";
import { SearchHotelParams } from "src/interfaces/hotel/SearchHotelParams.interface";
import { UpdateHotelParams } from "src/interfaces/hotel/UpdateHotelParams.interface";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { HotelDtoValidate } from "./dto/Hotel.dto.validate";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('api')
export class HotelsController {
    constructor(private hotelsService: HotelsService) {}

    @Post('/admin/hotels/')
    async addHotel(
        @Body(DtoValidationPipe) hotelDtoValidate: HotelDtoValidate
    ) {
        const hotel = await this.hotelsService.create(hotelDtoValidate);
        return { 
            id: hotel._id, 
            title: hotel.title, 
            description: hotel.description
        };
    }

    @Get('/admin/hotels/')
    async searchListHotels(
        @Query() searchHotelParams: SearchHotelParams
    ) {
        const searchHotels = await this.hotelsService.search(searchHotelParams);
        const result = searchHotels.map((item) => ({ 
            id: item._id.toString(), 
            title: item.title, 
            description: item.description
        }));

        return result;
    }

    @Put('/admin/hotels/:id')
    async updateHotel(
        @Param('id') id: ID, 
        @Body() updateHotelParams: UpdateHotelParams,
    ){
        return await this.hotelsService.update(id, updateHotelParams)
    }
}

