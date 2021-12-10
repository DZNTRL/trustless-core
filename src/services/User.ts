import { IUser } from "pro-web-common/dist/js/interfaces/service/IUser"
import { IUser as IUserRepo } from "pro-web-common/dist/js/interfaces/repo/IUser"
import mysql from "mysql2/promise"
import { Response } from "pro-web-common/dist/js/Response"
import { createChallenge } from "../utils/challenger"
import { ResponseMessages } from "pro-web-common/dist/js/enums/ResponseMessages"
import { encryptChallenge } from "../utils/encryptChallenge"

export class User implements IUser {
    repo: IUserRepo
    constructor(repo: IUserRepo) {
        this.repo = repo
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
        console.log("output from getChallenge", getResp)
        if(getResp.Data === null) {
            let userResp = await this.repo.checkUsernameUnique(username)
            console.log(`requestLogin: isUserUnique ${username}`, userResp)
            // if the username is unique, then return without creating challenge
            if(userResp.Data) {
                resp.Message = ResponseMessages.NotFound.toString()
                resp.Data = null
                return resp                
            }
            let challenge = createChallenge()
            console.log("this is the challenfrom from createChallenge()", challenge)
            let createResp = await this.repo.createChallenge(username, challenge)
            console.log("this is the challenge from repo.createChallenge", createResp)
            if(!createResp.Data) {
                resp.IsError = true
                resp.Message = createResp.Message
            } else {
                resp.Data = challenge
            }
        } else {
            resp.Data = getResp.Data
        }
        const userResp = await this.get(username)
        console.log("/services.user.requestLogin.userResp", userResp)
        if(userResp.IsError) {
            resp.Message = userResp.Message
            return resp
        }
        resp.Data = await encryptChallenge(resp.Data, userResp.Data.publicKey)
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