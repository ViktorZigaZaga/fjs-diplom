import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from '../../schemas/user.schema';
import { ID } from '../../interfaces/ID.types';
import { IUserService } from "src/interfaces/user/IUserService.intarface";
import { SearchUserParams } from "src/interfaces/user/SearchUserParams.interface";
import { UserDtoValidate } from "src/modules/users/dto/User.dto.validate";


@Injectable()
export class UsersService implements IUserService {
    constructor(
        @InjectModel(User.name) 
        private UserModel: Model<UserDocument>
    ) {}

    async create(data: Partial<UserDtoValidate>): Promise<UserDocument> { 
        const user = new this.UserModel(data);
        try {
            await user.save();
            return user;
        } catch (e) {
            throw new BadRequestException(`Ошибка при создании пользователя: ${e}`);
        }
    }

    async findById(id: ID): Promise<UserDocument> {
        return await this.UserModel.findById(id).select('-__v').exec();
    };
    async findByEmail(email: string): Promise<UserDocument> {
        return await this.UserModel.findOne({ email: email }).select('-__v');
    };
    async findAll(params: SearchUserParams): Promise<UserDocument[]> {
        const {limit, offset, email, name, contactPhone} = params;
        const query = {
            email: { $regex: new RegExp(email, 'i') },
            name: { $regex: new RegExp(name, 'i') },
            contactPhone: { $regex: new RegExp(contactPhone, 'i') },
        }
        return await this.UserModel.find(query).skip(offset).limit(limit);
    };
}