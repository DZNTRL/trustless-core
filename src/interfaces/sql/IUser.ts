import { IResponse } from "../../interfaces/IResponse"

export interface IUser {
    checkUsernameUnique: (username: string) => Promise<IResponse<boolean>>
    createUser: (username: string, publicKey: string ) => Promise<IResponse<number>>
    getPublicKey: (username: string) => Promise<IResponse<string>>
}