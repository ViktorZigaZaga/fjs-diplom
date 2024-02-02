import { ObjectId } from "mongoose";

export interface IHotelRoom {
  hotel: ObjectId;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}