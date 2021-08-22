import { User } from "./sql/User";
import { SQLUtils } from "./sql/Utils"
import { IResponse } from "./interfaces/IResponse";
import { Response } from "./models/Response";
import { ResponseMessages } from "./interfaces/constants/Enums";

export interface IProWebModels {
    User: typeof User
    Utils: typeof SQLUtils
    Response: typeof Response
    ResponseMessages: typeof ResponseMessages
}

const ProWebModels: IProWebModels = {
    User: User,
    Utils: SQLUtils,
    Response,
    ResponseMessages
}

export { IResponse }

export default ProWebModels
