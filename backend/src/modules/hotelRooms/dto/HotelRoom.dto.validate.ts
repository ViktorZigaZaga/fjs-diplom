import { IsArray, IsBoolean, IsString, IsDefined, IsDate} from "class-validator";
import { ObjectId } from "mongoose";
import { HotelRoom } from "src/schemas/hotelRoom.schema";

export class HotelRoomDtoValidate extends HotelRoom {
    @IsDefined()
    hotel: ObjectId;
  
    @IsString()
    description: string;

    @IsArray() 
    images: string[];
  
    @IsDefined() @IsDate()
    createdAt: Date;

    @IsDefined() @IsDate()
    updatedAt: Date;

    @IsDefined() @IsBoolean()
    isEnabled: boolean;
}