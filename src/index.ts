import { ProWebRepo, IProWebRepo } from "./repos/"
import { IProWebService, ProWebService } from "./services"
import { IProWebModels, ProWebModels } from "./models"
import { ProWebTypes } from "pro-web-common/dist/js/types"
import { IProWebConstants } from "pro-web-common/dist/js/interfaces/constants"
import { ProWebConstants } from "./constants"
import { Utils } from "./utils"
import { IUtils } from "pro-web-common/dist/js/interfaces/utils"
import { IInjections, defaultInjections as injections } from "./ioc"
import { createPool } from "./utils/createConnectionPool"

export interface IProWebCore {
    Repo: IProWebRepo 
    Service: IProWebService
    Models: IProWebModels
    Constants: IProWebConstants
    Utils: IUtils
}

const ProWebCore: IProWebCore = {
    Repo: ProWebRepo,
    Service: ProWebService,
    Models: ProWebModels,
    Constants: ProWebConstants,
    Utils
}

export { ProWebTypes }

export { IUtils }

export { ProWebService}

export { ProWebRepo }

export { ProWebModels, IProWebModels }

export { ProWebConstants }

export { injections, IInjections }

export { createPool }

export default ProWebCore