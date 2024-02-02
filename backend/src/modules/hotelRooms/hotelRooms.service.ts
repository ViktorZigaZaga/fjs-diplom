import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from '../../interfaces/ID.types';
import { HotelRoom, HotelRoomDocument } from "src/schemas/hotelRoom.schema";
import { IHotelRoomService } from "src/interfaces/hotel/IHotelRoomService.interface";
import { SearchRoomsParams } from "src/interfaces/hotel/SearchRoomsParams.interface";
import { UpdateHotelRoomParams } from 'src/interfaces/hotel/UpdateHotelRoomParams.interface'
import { HotelRoomDtoValidate } from "./dto/HotelRoom.dto.validate";

@Injectable()
export class HotelRoomsService implements IHotelRoomService {
    constructor(
        @InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
    ) {}

    async create(data: Partial<HotelRoomDtoValidate>): Promise<HotelRoomDocument> {
        const room = new this.HotelRoomModel(data);
        try {
            await room.save();
            return room;
        } catch (e) {
            throw new BadRequestException(`Ошибка при создании комнаты: ${e}`);
        }
    }

    async findById(id: ID): Promise<HotelRoomDocument> {
        return await this.HotelRoomModel
            .findById(id)
            .populate('hotel')
            .select('-__v')
            .exec();
    }
    async search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
        if (params.isEnabled === undefined) {
            delete params.isEnabled;
        }
        return await this.HotelRoomModel
            .find(params)
            .populate('hotel')
            .select('-__v')
            .exec();
    }

    async update(id: ID, data: Partial<UpdateHotelRoomParams>): Promise<HotelRoomDocument> {
        return await this.HotelRoomModel.findByIdAndUpdate(
            {id}, 
            {$set: {...data, updatedAt: Date.now()}},
            {new: true}
        );
    }
}