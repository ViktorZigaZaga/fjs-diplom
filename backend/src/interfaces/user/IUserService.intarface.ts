import { ID } from '../ID.types'
import { User } from '../../schemas/user.schema'
import { SearchUserParams } from './SearchUserParams.interface';

export interface IUserService {
    create(data: Partial<User>): Promise<User>;
    findById(id: ID): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findAll(params: SearchUserParams): Promise<User[]>;
}