import { IUtils } from "pro-web-common/dist/js/interfaces/utils"
import { createChallenge } from "./challenger"
import { createPool } from "./createConnectionPool"
export const Utils: IUtils = {
    createChallenge, createPool
}