import { IResponse } from "../IResponse"

export interface IUser {
    checkUsernameUnique: (username: string) => Promise<IResponse<boolean>>
    createUser: (username: string, publicKey: string ) => Promise<IResponse<number>>
    getPublicKey: (username: string) => Promise<IResponse<string>>
    createChallenge: (challenge: string, username: string) => Promise<IResponse<boolean>>
    getChallenge: (username: string) => Promise<IResponse<string>>
    verifyChallenge: (username: string, challenge: string) => Promise<IResponse<boolean>>
    clearChallenge: (username: string) => Promise<IResponse<boolean>>
}