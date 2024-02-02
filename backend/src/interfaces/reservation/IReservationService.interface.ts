import { ID } from "../ID.types";
import { Reservation } from "src/schemas/reservation.schema";
import { ReservationDto } from "./ReservationDto.interface";
import { SearchReservationOptions } from "./SearchReservationOptions.interface";

export interface IReservationService {
    addReservation(data: ReservationDto): Promise<Reservation>;
    removeReservation(id: ID): Promise<void>;
    getReservations(
      filter: SearchReservationOptions
    ): Promise<Array<Reservation>>;
}