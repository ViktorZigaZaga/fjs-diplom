import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/interfaces/ID.types";
import { CreateSupportRequestDto } from "src/interfaces/support/CreateSupportRequestDto.interface";
import { ISupportRequestClientService } from "src/interfaces/support/ISupportRequestClientService.interface";
import { MarkMessagesAsReadDto } from "src/interfaces/support/MarkMessagesAsReadDto.interface";
import { MessageDocument } from "src/schemas/message.schema";
import { SupportRequest, SupportRequestDocument } from "src/schemas/support.schema";

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {
    constructor(
        @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>
    ) {}

    async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument> {
        const model = new this.SupportRequestModel(data);
        model.createdAt = new Date();
        model.isActive = true;
        await model.save();
        return model;
    }
    async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
        (await this.SupportRequestModel.findById(params.supportRequest).select('-__v').exec())?.messages
            .filter(message => message.author != params.user)
            .filter(message => message.sentAt < params.createdBefore)
            .forEach(message => {
                message.readAt = new Date();
                message.save();
            })

    }
    async getUnreadCount(supportRequest: ID): Promise<MessageDocument[]> {
        return (await this.SupportRequestModel.findById(supportRequest).select('-__v').exec())?.messages
            .filter(message => !message.readAt) || [];
    }
}