import { Pool } from "mysql"
import mysql from "mysql2"
import openpgp from "openpgp"
import { IUser } from "../interfaces/sql/IUser"
import { Response } from "../models/Response"
import { PrivateResponseMessages } from "../interfaces/constants/Enums"
const sqlCreateUser = `
    INSERT INTO Accounts
    (username, publicKey)
    VALUES
    (?, ?);
    SELECT LAST_INSERT_ID();
`
const sqlCheckUsernameUnique = `
    SELECT 
        COUNT(username) as result
    FROM
        Accounts
    WHERE
        username = ?
`
export class User implements IUser {
    pool: Pool    
    constructor(pool: Pool) {
        this.pool = pool
        this.checkUsernameUnique.bind(this)
    }
    async checkUsernameUnique(username) {
        return new Promise<Response<boolean>>((res, rej) => {
            const resp = new Response<boolean>()
            this.pool.query(sqlCheckUsernameUnique, [username], (err, result) => {
                if(err) {
                    resp.IsError = true
                    //@ts-ignore
                    resp.Message = err
                    return rej(resp)
                }
                resp.Data = result.result === 0
                res(resp)
            })
        });
    }
    async login(user, challengeResponse) {
        return Promise.resolve(false)
    }
    async createUser(username: string, publicKey: string) {
        return Promise.resolve(0)
    }
    async createChallenge(user) {
        return Promise.resolve("test")
    }
}