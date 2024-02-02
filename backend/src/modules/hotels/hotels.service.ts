import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from '../../interfaces/ID.types';
import { IHotelService } from "src/interfaces/hotel/IHotelService.interface";
import { Hotel, HotelDocument } from '../../schemas/hotel.schema';
import { HotelDtoValidate } from './dto/Hotel.dto.validate';
import { SearchHotelParams } from "src/interfaces/hotel/SearchHotelParams.interface";
import { UpdateHotelParams } from "src/interfaces/hotel/UpdateHotelParams.interface";

@Injectable()
export class HotelsService implements IHotelService {
    constructor(
        @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    ) {}

    async create(data: Partial<HotelDtoValidate>): Promise<HotelDocument> {
        const hotel = new this.HotelModel(data);
        try {
            await hotel.save();
            return hotel;
        } catch (e) {
            throw new BadRequestException(`Ошибка при создании отеля: ${e}`);
        }
    }
    async findById(id: ID): Promise<HotelDocument> {
        return await this.HotelModel.findById(id).select('-__v').exec();
    }
    async search(params: SearchHotelParams): Promise<HotelDocument[]> {
        const {limit, offset, title} = params;
        const query = {
            title: { $regex: new RegExp(title, 'i') }
        }
        return await this.HotelModel
        .find(query)
        .limit(limit ?? 0)
        .skip(offset ?? 0);
    };
    async update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
        return await this.HotelModel.findByIdAndUpdate(
            {id}, 
            {$set: {...data, updatedAt: Date.now()}},
            {new: true}
        );
    };
}