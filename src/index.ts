import { IResponse } from "./interfaces/IResponse"
import { Response } from "./models/Response"
import { Enums, IEnums } from "./enums"
import { ProWebRepo, IProWebRepo } from "./repo/"
import { IProWebService, ProWebService } from "./services"
import { IProWebModels, ProWebModels } from "./models"
import { ProWebTypes } from "./types"
import { IProWebConstants } from "./interfaces/constants"
import { ProWebConstants } from "./constants"

export interface IProWebCore {
    Repo: IProWebRepo 
    Response: typeof Response
    Service: IProWebService
    Enums: IEnums
    Models: IProWebModels
    Constants: IProWebConstants
}

const ProWebCore: IProWebCore = {
    Repo: ProWebRepo,
    Service: ProWebService,
    Response,
    Enums,
    Models: ProWebModels,
    Constants: ProWebConstants
}

export { ProWebTypes }

export { IResponse }

export { ProWebService}

export { ProWebRepo }

export { ProWebModels }

export { ProWebConstants }

export { Enums as ProWebEnums }

export default ProWebCore
