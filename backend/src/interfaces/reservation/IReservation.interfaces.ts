import { ObjectId } from "mongoose";
import { ID } from "../ID.types";

export interface IReservation {
    userId: ObjectId;
    hotelId: ObjectId;
    roomId: ObjectId;
    dateStart: Date;
    dateEnd: Date;
}