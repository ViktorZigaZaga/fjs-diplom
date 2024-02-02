import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/interfaces/ID.types";
import { ISupportRequestEmployeeService } from "src/interfaces/support/ISupportRequestEmployeeService.interface";
import { MarkMessagesAsReadDto } from "src/interfaces/support/MarkMessagesAsReadDto.interface";
import { Message } from "src/schemas/message.schema";
import { SupportRequest, SupportRequestDocument } from "src/schemas/support.schema";

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
    constructor(
        @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>
    ) {}

    async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
        (await this.SupportRequestModel.findById(params.supportRequest).select('-__v').exec())?.messages
            .filter(message => message.author != params.user)
            .filter(message => message.sentAt < params.createdBefore)
            .forEach(message => {
                message.readAt = new Date();
                message.save();
        })
    }
    async getUnreadCount(supportRequest: ID): Promise<Message[]> {
        return (await this.SupportRequestModel.findById(supportRequest).select('-__v').exec())?.messages
            .filter(message => !message.readAt) || [];
    }

    async closeRequest(supportRequest: ID): Promise<void> {
        const request = await this.SupportRequestModel.findById(supportRequest).select('-__v').exec();
        if (request) {
            request.isActive = false;
            await request.save();
        }
    }
}