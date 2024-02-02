import { ID } from "../ID.types";
import { Message } from "src/schemas/message.schema";
import { SupportRequest } from "src/schemas/support.schema";
import { GetChatListParams } from "./GetChatListParams.interface";
import { SendMessageDto } from "./SendMessageDto.interface";

export interface ISupportRequestService {
    findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
    sendMessage(data: SendMessageDto): Promise<Message>;
    getMessages(supportRequest: ID): Promise<Message[]>;
    subscribe(
      handler: (supportRequest: SupportRequest, message: Message) => void
    ): () => void;
}