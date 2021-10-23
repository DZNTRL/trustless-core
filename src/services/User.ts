import { IUser } from "pro-web-common/dist/js/interfaces/service/IUser"
import { IUser as IUserRepo } from "pro-web-common/dist/js/interfaces/repo/IUser"
import mysql from "mysql2/promise"
import { Response } from "../models/Response"
import { createChallenge } from "../utils/challenger"

import { defaultInjections as ioc } from "../ioc"
import { ResponseMessages } from "../enums/ResponseMessages"
export class User implements IUser {
    repo: IUserRepo
    constructor(pool: mysql.Pool) {
        this.repo = ioc().UserRepo(pool)
    }
    checkUsernameUnique(username) {
        return this.repo.checkUsernameUnique(username)
    }
    createUser(username, publicKey) {
        return this.repo.createUser(username, publicKey)
    }
    getPublicKey(username) {
        return this.repo.getPublicKey(username)
    }
    async requestLogin(username) {
        const resp = new Response<string>()
        const getResp = await this.repo.getChallenge(username)
        if(getResp.Data === null) {
            var userResp = await this.repo.checkUsernameUnique(username)
            // if the username is unique, then return without creating challenge
            if(userResp.Data) {
                resp.Message = ResponseMessages.NotFound.toString()
                resp.Data = null
                return resp                
            }
            let challenge = createChallenge()
            let createResp = await this.repo.createChallenge(challenge, username)
            if(!createResp.Data) {
                resp.IsError = true
                resp.Message = createResp.Message
            } else {
                resp.Data = challenge
            }
        } else {
            resp.Data = getResp.Data
        }
        return resp
    }
    login(username, challenge) {
        return this.repo.verifyChallenge(username, challenge)
    }
    getChallenge(username) {
        return this.repo.getChallenge(username)
    }
    get(username) {
        return this.repo.get(username)
    }
}