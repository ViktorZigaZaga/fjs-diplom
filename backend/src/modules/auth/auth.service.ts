import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { ID } from "src/interfaces/ID.types";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { Response } from 'express';
import { UserDocument } from "src/schemas/user.schema";
import { LoginAuthDto } from "src/interfaces/auth/LoginAuthDto.interface";
import { RegisterAuthDto } from "src/interfaces/auth/RegisterAuthDto.interface";

@Injectable()
export class AuthService {
    authService: any;
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.passwordHash === pass) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async validateUserById(id: ID): Promise<UserDocument | null> {
        const user = await this.usersService.findById(id);
        if (user) {
            return user;
        }
        return null;
    }

    async createToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async login(loginAuthDto: LoginAuthDto, res: Response) {
        const user = await this.usersService.findByEmail(
            loginAuthDto.email,
        );
        if (!user) {
            throw new UnauthorizedException('Пользователь с таким email не найден');
        }
        
        const isValidPassword = bcrypt.compareSync(
            loginAuthDto.password,
            user.passwordHash,
        );
        if (!isValidPassword) {
            throw new UnauthorizedException('Неверный пароль');
        }
    }

    async logout(res: Response): Promise<void> {
        res.status(204).end();
      }

    async register(registerAuthDto: RegisterAuthDto) {
        const { password, email, ...rest } = registerAuthDto;
        const user = await this.usersService.findByEmail(email);
        if (user) {
            throw new BadRequestException('Пользователь с таким email уже существует');
        }

        const passwordHash = bcrypt.hashSync(password, 5).toString();
        const newUser = await this.usersService.create({
            passwordHash,
            email,
            ...rest,
        });
        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        }
    }
}