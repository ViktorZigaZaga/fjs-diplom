import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SupportRequestService } from "./supportRequest.service";
import { ID } from "../../interfaces/ID.types";
import { UseFilters, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { WsExceptionsFilter } from "src/filters/WsException.Filter";
import { UsersService } from "../users/users.service";
import { UserDocument } from "src/schemas/user.schema";


@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class SupportRequestGateway {
    constructor(
        private supportRequestService: SupportRequestService,
        private usersService: UsersService,
    ) {}
    
    @WebSocketServer()
    server: Server;

    @UseFilters(new WsExceptionsFilter())
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('client', 'manager')
    @SubscribeMessage('subscribeToChat') 
    async handleSubscribeToChat(
        @ConnectedSocket() client: Socket,
        @MessageBody('payload') payload: {chatId: ID},
    ) {
        return this.supportRequestService.subscribe(async (supportRequest, message) => {
            if (supportRequest._id === payload.chatId) {
                const { _id, sentAt, text, readAt, author } = message;
                const { id: authorId, name } = await this.usersService.findById(author);
                const response = {
                  _id,
                  sentAt,
                  text,
                  readAt,
                  author: {
                    id: authorId,
                    name: name,
                  },
                };
                client.emit('subscribeToChat', response);
            }
        })
    }
}