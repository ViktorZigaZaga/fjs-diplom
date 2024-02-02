import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${process.env.JWT_SECRET}`,
        });
    }

    public async validate(payload: any) {
        const user = await this.authService.validateUserById(payload.id);
        if (!user) {
            throw new UnauthorizedException("Неверные id");
        }
        return user;
    }
}