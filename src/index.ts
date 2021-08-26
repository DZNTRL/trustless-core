import { IResponse } from "./interfaces/IResponse"
import { Response } from "./models/Response"
import { Enums, IEnums } from "./enums"
import { ProWebRepo, IProWebRepo } from "./repo/"
import { IProWebService, ProWebService } from "./services"
import { IProWebModels, ProWebModels } from "./models"
import { ProWebTypes } from "./types"
import { IProWebConstants } from "./interfaces/constants"
import { ProWebConstants } from "./constants"
import { Utils } from "./utils"
import { IUtils } from "./interfaces/utils"


export interface IProWebCore {
    Repo: IProWebRepo 
    Response: typeof Response
    Service: IProWebService
    Enums: IEnums
    Models: IProWebModels
    Constants: IProWebConstants
    Utils: IUtils
}

const ProWebCore: IProWebCore = {
    Repo: ProWebRepo,
    Service: ProWebService,
    Response,
    Enums,
    Models: ProWebModels,
    Constants: ProWebConstants,
    Utils
}

export { ProWebTypes }

export { IResponse }

export { IUtils }

export { ProWebService}

export { ProWebRepo }

export { ProWebModels }

export { ProWebConstants }

export { Enums as ProWebEnums }

export default ProWebCore
