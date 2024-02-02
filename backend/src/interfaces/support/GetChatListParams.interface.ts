import { ID } from "../ID.types";

export interface GetChatListParams {
    userId: ID | null;
    isActive: boolean;
    offset: number;
    limit: number;
}