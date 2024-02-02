import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "src/schemas/message.schema";
import { SupportRequest, SupportRequestSchema } from "src/schemas/support.schema";
import { SupportRequestClientService } from "./supportRequestClient.service";
import { SupportRequestService } from "./supportRequest.service";
import { SupportRequestEmployeeService } from "./supportRequestEmployee.service";
import { SupportRequestController } from "./supportRequest.controller";
import { UsersModule } from "../users/users.module";
import { SupportRequestGateway } from "./supportRequest.gateway";


@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Message.name, 
                schema: MessageSchema
            },
            {
                name: SupportRequest.name, 
                schema: SupportRequestSchema
            }
        ]),
        UsersModule,
    ],
    providers: [
        SupportRequestService, 
        SupportRequestClientService, 
        SupportRequestEmployeeService,
        SupportRequestGateway,
    ],
    exports: [SupportRequestService],
    controllers: [SupportRequestController]
})

export class SupportRequestModule {}