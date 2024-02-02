import { ID } from "../ID.types"

export interface UpdateHotelRoomParams {
    description: string,
    hotelId: ID,
    isEnabled: boolean,
    images: Array<Express.Multer.File | string>,
}