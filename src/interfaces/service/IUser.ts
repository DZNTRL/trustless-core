import { IResponse } from "../IResponse"

export interface IUser {
    checkUsernameUnique: (username: string) => Promise<IResponse<boolean>>
    createUser: (username: string, publicKey: string ) => Promise<IResponse<number>>
    getPublicKey: (username: string) => Promise<IResponse<string>>
    login: (username: string, challenge: string) => Promise<IResponse<boolean>>
}