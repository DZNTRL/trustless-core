import { User } from "./User"

export interface IProWebService {
    User: typeof User
}
export const ProWebService: IProWebService = {
    User
}