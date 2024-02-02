import { ID } from "../ID.types";

export interface CreateSupportRequestDto {
    userId: ID;
    text: string;
}