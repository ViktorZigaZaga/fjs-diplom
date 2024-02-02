import { ObjectId } from "mongoose";
import { IMessage } from "./IMessage.interface";

export interface ISupportRequest {
    user: ObjectId;
    createdAt: Date;
    messages: IMessage[];
    isActive: boolean;
}