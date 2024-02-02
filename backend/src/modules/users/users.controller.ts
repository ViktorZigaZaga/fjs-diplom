import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UsersService } from "./users.service";
import { SearchUserParams } from "src/interfaces/user/SearchUserParams.interface";
import { UserDtoValidate } from "src/modules/users/dto/User.dto.validate";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {}

    @Roles('admin')
    @Post('/admin/users')
    async createUser(@Body(DtoValidationPipe) body: UserDtoValidate) {
        const user = this.usersService.create(body);
        return {
            id: (await user)._id,
            email: (await user).email,
            name: (await user).name,
            contactPhone: (await user).contactPhone,
            role: (await user).role,
        }
    }

    @Roles('admin')
    @Get('/admin/users')
    async getUsersAdmin(@Query() query: SearchUserParams) {
        const users = this.usersService.findAll(query);
        return (await users).map((user) => ({
            id: user._id,
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone,
        }));
    }

    @Roles('manager')
    @Get('/manager/users')
    async getUsersManager(@Query() query: SearchUserParams) {
        const users = this.usersService.findAll(query);
        return (await users).map((user) => ({
            id: user._id,
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone,
        }));
    }
}