import { ID } from "../ID.types";
import { Message } from "src/schemas/message.schema";
import { MarkMessagesAsReadDto } from "./MarkMessagesAsReadDto.interface";

export interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
    getUnreadCount(supportRequest: ID): Promise<Message[]>;
    closeRequest(supportRequest: ID): Promise<void>;
}