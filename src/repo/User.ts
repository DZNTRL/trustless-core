import { Pool } from "mysql2/promise"
import { IUser } from "../interfaces/repo/IUser"
import { Response } from "../models/Response"
import { ResponseMessages } from "../enums/ResponseMessages"
import { QueryParameter } from "../types/"
import { Utils } from "./Utils"

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
const sqlCreateChallenge = `
    UPDATE
        Accounts
    SET
        challenge = ?
    WHERE
        username = ?
`
const sqlGetChallenge = `
    SELECT
        challenge
    FROM
        Accounts
    WHERE
        username = ?
`

const sqlVerifyChallenge = `
    SELECT
        COUNT(username) as result
    FROM
        Accounts
    WHERE
        username = ?
        AND
        challenge = ?
`
export class User implements IUser {
    pool: Pool
    constructor(pool: Pool, username: string | null = null) {
        this.pool = pool
        this.checkUsernameUnique.bind(this)
    }
    private async query<T>(statement: string, params: Array<QueryParameter>) {
        return Utils.query<T>(this.pool, statement, params)
    }
    async createChallenge(username, challenge) {
        return new Promise<Response<boolean>>((res, rej) => { 
            this.query<boolean>(sqlCreateChallenge, [challenge, username])
                .then(result => {
                    const resp = new Response(result.Data[0].changedRows === 1)
                    if(resp.Data) return res(resp)
                    resp.Message = ResponseMessages.NoRecordsUpdated.toString()
                    resp.IsError = true
                    return res(resp)
                })
                .catch(result =>  result)
        })
    }
    async clearChallenge(username) {
        return new Promise<Response<boolean>>((res, rej) => { 
            this.query<boolean>(sqlCreateChallenge, [null, username])
                .then(result => {
                    res(new Response(result.Data[0][0].rowsAffected === 1))
                })
                .catch(result => result)
        })
    }
    async checkUsernameUnique(username) {
        return new Promise<Response<boolean>>((res, rej) => { 
            this.query<boolean>(sqlCheckUsernameUnique, [username])
                .then(result => {
                    res(new Response(result.Data[0][0].result === 0))
                })
                .catch(result => result)
        })
    }
    async createUser(username, publicKey) {
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
                        res(new Response(null, ResponseMessages.NotFound.toString(), true))
                    }
                })
                .catch(result => result)

        })
    }
    async getChallenge(username) {
        return new Promise<Response<string>>((res, rej) => { 
            this.query<any>(sqlGetChallenge, [username])
                .then(result => {
                    res(new Response(result.Data[0][0].challenge))
                })
                .catch(result => result)
        })
   
    }
    async verifyChallenge(username, challenge) {
        return new Promise<Response<boolean>>((res, rej) => { 
            this.query<boolean>(sqlVerifyChallenge, [username, challenge])
                .then(result => {
                    const resp = new Response(result.Data[0][0].result === 1)
                    res(resp)
                    this.clearChallenge(username)
                        .then(() => {})
                        .catch(() => {
                            console.log("I should log if this doesn't work")
                        })
                })
                .catch(result => result)
        })

    }

}