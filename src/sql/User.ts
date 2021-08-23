import { Pool } from "mysql2/promise"
import openpgp from "openpgp"
import { IUser } from "../interfaces/sql/IUser"
import { Response } from "../models/Response"
import { ResponseMessages } from "../interfaces/constants/Enums"
import { QueryParameter } from "../interfaces/constants/Types"
import { IResponse } from "../interfaces/IResponse"
import { SQLUtils } from "./Utils"

const sqlCreateUser = `
    INSERT INTO Accounts
    (username, publicKey)
    VALUES
    (?, ?);
`
const sqlCheckUsernameUnique = `
    SELECT
        COUNT(username) as result
    FROM
        Accounts
    WHERE
        username = ?
`
const sqlGetPublicKey = `
    SELECT
        publicKey
    FROM
        Accounts
    where
        username = ?
`
export class User implements IUser {
    pool: Pool
    constructor(pool: Pool) {
        this.pool = pool
        this.checkUsernameUnique.bind(this)
    }
    private async query<T>(statement: string, params: Array<QueryParameter>) {
        return SQLUtils.query<T>(this.pool, statement, params)
    }
    async checkUsernameUnique(username: string) {
        return new Promise<Response<boolean>>((res, rej) => { 
            this.query<boolean>(sqlCheckUsernameUnique, [username])
                .then(result => {
                    res(new Response(result.Data[0][0].result === 0))
                })
                .catch(result => result)
        })
    }
    async login(user, challengeResponse) {
        return Promise.resolve(false)
    }
    async createUser(username: string, publicKey: string) {
        return new Promise<Response<number>>((res, rej) => {
            this.query<any>(sqlCreateUser, [username, publicKey])
                .then(result =>  {
                    if(result.Data[0].insertId) {
                        res(new Response(result.Data[0].insertId))
                    } else {
                        rej(new Response(null, ResponseMessages.NoRecordsUpdated.toString()))
                    }
                })
                .catch(result => result)
        })
    }
    async getPublicKey(username) {
        return new Promise<Response<string>>((res, rej) => {
            this.query<any>(sqlGetPublicKey, [username])
                .then(result =>  {
                    if(result.Data[0][0]) {
                        res(new Response(result.Data[0][0].publicKey))
                    } else {
                        rej(new Response(null, ResponseMessages.NotFound.toString()))
                    }
                })
                .catch(result => result)

        })
    }
}