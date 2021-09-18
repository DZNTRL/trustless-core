import { IResponse } from "../IResponse"
import { IUser as IUserModel } from "../../interfaces/models/IUser"

export interface IUser {
    checkUsernameUnique: (username: string) => Promise<IResponse<boolean>>
    createUser: (username: string, publicKey: string ) => Promise<IResponse<number>>
    getPublicKey: (username: string) => Promise<IResponse<string>>
    verifyChallenge: (username: string, challenge: string) => Promise<IResponse<boolean>>
    requestLogin: (username: string) => Promise<IResponse<string>>
    getChallenge: (username: string) => Promise<IResponse<string>>
    get: (username: string) => Promise<IResponse<IUserModel>>
}