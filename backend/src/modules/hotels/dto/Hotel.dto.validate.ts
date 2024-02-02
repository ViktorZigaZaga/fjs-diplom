import { IsEmpty, IsString, IsDate } from "class-validator";
import { Hotel } from "src/schemas/hotel.schema";

export class HotelDtoValidate extends Hotel {
    @IsEmpty() @IsString()
    title: string;
  
    @IsString()
    description: string;
  
    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}