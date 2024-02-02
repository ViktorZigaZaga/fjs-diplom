import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/interfaces/ID.types";
import { IReservationService } from "src/interfaces/reservation/IReservationService.interface";
import { ReservationDto } from "src/interfaces/reservation/ReservationDto.interface";
import { SearchReservationOptions } from "src/interfaces/reservation/SearchReservationOptions.interface";
import { Reservation, ReservationDocument } from "src/schemas/reservation.schema";

@Injectable()
export class ReservationService implements IReservationService {
    constructor(
        @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>
    ) {}

    async addReservation(data: ReservationDto): Promise<ReservationDocument> {
        const { userId, dateStart, dateEnd } = data;
        const reservations = await this.getReservations({
        userId,
        dateStart,
        dateEnd,
        });
        if (reservations.length) {
        throw new BadRequestException("Даты уже зарезервированы");
        }
        const reservation = new this.ReservationModel(data);
        try {
            await reservation.save();
            return await this.ReservationModel
                .findById(reservation.id)
                .populate([
                    "user", 
                    { 
                        path: "room", 
                        populate: { path: "hotel" } 
                    }
                ])
                .select('-__v')
                .exec();
        } catch (e) {
            throw new BadRequestException(`Ошибка при установки бронирования: ${e}`);
        }
    }

    async removeReservation(id: ID): Promise<void> {
        const item = this.ReservationModel.findById(id);
        if (!item) {
            throw new BadRequestException("Бронирования с данным ID не существует");
        }
        await this.ReservationModel.findByIdAndDelete(id).exec();
    }

    async getReservations(filter: SearchReservationOptions): Promise<ReservationDocument[]> {
        const { userId } = filter;
        const parseFilter: any = {};
        userId && (parseFilter.userId = userId);
        filter.dateStart && (parseFilter.dateStart = { $gte: filter.dateStart });
        filter.dateEnd && (parseFilter.dateEnd = { $lte: filter.dateEnd });
        return await this.ReservationModel.find(parseFilter)
        .select('-__v')
        .populate([
            "user", 
            { 
                path: "room", 
                populate: { path: "hotel" } 
            }
        ])
        .exec();
    }
}