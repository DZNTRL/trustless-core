import { IResponse } from "../../interfaces/IResponse"

export interface IUser {
    checkUsernameUnique: (username: string) => Promise<IResponse<boolean>>
    login: (username: string, challengeResponse: string) => Promise<boolean>
    createUser: (username: string, publicKey: string ) => Promise<number>
    createChallenge: (username: string) => Promise<string>
}