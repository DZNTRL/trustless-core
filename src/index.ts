import { User } from "./sql/User";
export interface IProWebModels {
    User: typeof User
}

const ProWebModels: IProWebModels = {
    User: User
}

export default ProWebModels
