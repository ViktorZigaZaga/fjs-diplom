import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/interfaces/ID.types";
import { ISupportRequestService } from "src/interfaces/support/ISupportRequestService.interface";
import { GetChatListParams } from "src/interfaces/support/GetChatListParams.interface";
import { SendMessageDto } from "src/interfaces/support/SendMessageDto.interface";
import { Message, MessageDocument } from "src/schemas/message.schema";
import { SupportRequest, SupportRequestDocument } from "src/schemas/support.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class SupportRequestService implements ISupportRequestService {
    public chatEmitter: EventEmitter2;
    constructor(
        @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private MessageModel: Model<MessageDocument>
    ) {
        this.chatEmitter = new EventEmitter2();
    }

    async findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]> {
        return await this.SupportRequestModel.find(params).select('-__v').exec();
    }

    async sendMessage(data: SendMessageDto): Promise<MessageDocument> {
        const request = await this.SupportRequestModel.findById(data.supportRequest).select('-__v').exec();
        if (!request) {
            throw new Error(`Unable to find supportRequest with id ${data.supportRequest}`);
        }
        const message = new this.MessageModel(data);
        message.sentAt = new Date();
        await message.save();
        request.messages.push(message);
        await request.save();
        this.chatEmitter.emit('newMessage', { request, message });
        return message;
    }

    async getMessages(supportRequest: ID): Promise<MessageDocument[]> {
        return (await (this.SupportRequestModel.findById(supportRequest).select('-__v').exec())).messages || [];
    }

    subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
        this.chatEmitter.on('newMessage', ({ supportRequest, message }) => {
            handler(supportRequest, message);
        });
        return;
    }
}