import { User } from "./User"
import { Utils } from "./Utils"

export interface IProWebRepo {
    User: typeof User,
    Utils: typeof Utils
}

export const ProWebRepo: IProWebRepo = {
    User,
    Utils
}