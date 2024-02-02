import { Body, Controller, Post, Request, Response, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "./decorators/roles.decorator";
import { RolesGuard } from "./guards/roles.guard";
import { JwtAuthGuard } from "./guards/jwt.auth.guard";
import { JwtUnauthGuard } from "./guards/jwt.unauth.guard";
import { LoginAuthDto } from "src/interfaces/auth/LoginAuthDto.interface";
import { RegisterAuthDto } from "src/interfaces/auth/RegisterAuthDto.interface";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";

@Controller('api')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('/auth/login')
    @UseGuards(JwtUnauthGuard)
    async login(
        @Body(DtoValidationPipe) body: LoginAuthDto,
        @Request() req: any,
        @Response() res: any
    ) {
        this.authService.login(body,res);
        const token = this.authService.createToken({
            email: req.user.email,
            name: req.user.name,
            contactPhone: req.user.contactPhone,
        });
        res.cookie('access_token',token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }

    @Post('/auth/logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Response() res: any) {
        res.clearCookie('access_token');
        await this.authService.logout(res);
    }

    @Roles('client')
    @UseGuards(JwtUnauthGuard, RolesGuard)
    @Post('client/register')
    async register(
        @Body(DtoValidationPipe) registerAuthDto: RegisterAuthDto
    ) {
        this.authService.register(registerAuthDto);
    }
    
}
