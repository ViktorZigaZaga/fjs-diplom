import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ID } from "src/interfaces/ID.types";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UsersService } from "../users/users.service";
import { SupportRequestService } from "./supportRequest.service";
import { SupportRequestClientService } from "./supportRequestClient.service";
import { SupportRequestEmployeeService } from "./supportRequestEmployee.service";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { GetChatListParams } from "src/interfaces/support/GetChatListParams.interface";
import { CreateSupportRequestDto } from "src/interfaces/support/CreateSupportRequestDto.interface";
import { MarkMessagesAsReadDto } from "src/interfaces/support/MarkMessagesAsReadDto.interface";
import { SendMessageDto } from "src/interfaces/support/SendMessageDto.interface";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api')
export class SupportRequestController{
    constructor(
        private usersService: UsersService,
        private supportRequestService: SupportRequestService, 
        private supportRequestServiceClient: SupportRequestClientService,
        private supportRequestServiceEmployee: SupportRequestEmployeeService,
    ) {}

    @Roles('client')
    @Post('/client/support-requests')
    async createSupportRequest(
        @Body(DtoValidationPipe) body: CreateSupportRequestDto,
        @Request() req: any,
    ) {
        body.userId = req.user.id;
        const item  = await this.supportRequestServiceClient.createSupportRequest(body);
        
        await this.supportRequestService.sendMessage({
            author: req.user,
            supportRequest: body.userId,
            text: body.text,
        });

        const hasNewMessages = Boolean(
            (await this.supportRequestServiceClient.getUnreadCount(body.userId))
            .length
        );

        return {
            id: item.id,
            createdAt: item.createdAt,
            isActive: item.isActive,
            hasNewMessages: hasNewMessages,
        }
    }

    @Roles('client')
    @Get('/client/support-requests')
    async getSupportRequest(
        @Query() query: GetChatListParams,
        @Request() req: any,
    ) {
        query.userId = req.user.id;
        const supportRequests = this.supportRequestService.findSupportRequests(query);
        const hasNewMessages = Boolean(
            (await this.supportRequestServiceClient.getUnreadCount(query.userId))
            .length
        );

        return (await supportRequests).map((item) => ({
            id: item._id,
            createdAt: item.createdAt,
            isActive: item.isActive,
            hasNewMessages: hasNewMessages,
        }));
    }

    @Roles('manager')
    @Get('/manager/support-requests')
    async getSupportRequestManager(
        @Query() query: GetChatListParams,
        @Request() req: any,
    ) {
        const supportRequests = this.supportRequestService.findSupportRequests(query);
        return (await supportRequests).map(async (item) => {
            const hasNewMessages = Boolean(
                (await (this.supportRequestServiceEmployee.getUnreadCount(query.userId)))
                .length
            ); 
            return {
            id: item._id,
            createdAt: item.createdAt,
            isActive: item.isActive,
            hasNewMessages: hasNewMessages,  
            client: {
                id: req.userId,
                name: req.name,
                email: req.email,
                contactPhone: req.contactPhone,
            }
        }});
    }

    @Roles('manager', 'client', 'admin')
    @Get('/common/support-requests/:id/messages')
    async getAllSupportRequestByID(@Param("id") id: ID) {
        const supportRequest = await this.supportRequestService.getMessages(id);
        return supportRequest.map(async (item) => {
            const { id: authorId, name } = (await this.usersService.findById(
              item.author,
            ));
            return {
                id: item._id,
                createAt: item.sentAt.toString(),
                readAt: item.readAt?.toString() || null,
                author: {
                    id: authorId,
                    name: name,
                }
            }
        });
    }

    @Roles('manager', 'client', 'admin')
    @Post('/common/support-requests/:id/messages')
    async sendMessages(
        @Param("id") id: ID, 
        @Body(DtoValidationPipe) body: SendMessageDto,
        @Request() req: any,
    ) {
        return this.supportRequestService.sendMessage({
            author: req.user.id,
            supportRequest: id,
            text: body.text,
        });
    }

    @Roles('manager', 'client', 'admin')
    @Post('/common/support-requests/:id/messages/read')
    async markMessagesAsRead(
        @Param("id") id: ID, 
        @Body(DtoValidationPipe) body: MarkMessagesAsReadDto,
        @Request() req: any,
    ) {
        if (req.user?.role === 'client'){
            this.supportRequestServiceClient.markMessagesAsRead({
                user: req.user.id,
                supportRequest: id,
                createdBefore: body.createdBefore,
            });
        }
        if (req.user?.role === 'manager') {
            this.supportRequestServiceEmployee.markMessagesAsRead({
                user: req.user.id,
                supportRequest: id,
                createdBefore: body.createdBefore,
            });
        }
        return {success: true};
    }

    @Roles('manager', 'client', 'admin')
    @Post('/common/support-requests/close/:id')
    async closeRequest(@Param("id") id: ID) {
        await this.supportRequestServiceEmployee.closeRequest(id);
    }
}