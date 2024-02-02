import { ID } from "../ID.types";

export interface SendMessageDto {
    author: ID;
    supportRequest: ID;
    text: string;
}