import { ID } from "../ID.types";

export interface MarkMessagesAsReadDto {
    user: ID;
    supportRequest: ID;
    createdBefore: Date;
}