import { ID } from '../ID.types';

export interface SearchRoomsParams {
    limit: number;
    offset: number;
    hotel: ID;
    isEnabled?: boolean;
}