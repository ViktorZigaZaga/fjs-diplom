import { ID } from "../ID.types";
import { Message } from "src/schemas/message.schema";
import { SupportRequest } from "src/schemas/support.schema";
import { CreateSupportRequestDto } from "./CreateSupportRequestDto.interface";
import { MarkMessagesAsReadDto } from "./MarkMessagesAsReadDto.interface";

export interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
    markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
    getUnreadCount(supportRequest: ID): Promise<Message[]>;
}