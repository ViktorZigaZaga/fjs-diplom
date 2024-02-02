import { ID } from '../ID.types';
import { Hotel } from 'src/schemas/hotel.schema';
import { SearchHotelParams } from './SearchHotelParams.interface';
import { UpdateHotelParams } from './UpdateHotelParams.interface';

export interface IHotelService {
    create(data: any): Promise<Hotel>;
    findById(id: ID): Promise<Hotel>;
    search(params: SearchHotelParams): Promise<Hotel[]>;
    update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}