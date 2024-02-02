import { ID } from "../ID.types";

export interface SearchReservationOptions {
    userId: ID;
    dateStart?: Date;
    dateEnd?: Date;
}