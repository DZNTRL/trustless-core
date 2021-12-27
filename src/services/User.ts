import { IUser } from "pro-web-common/dist/js/interfaces/service/IUser"
import { IUser as IUserRepo } from "pro-web-common/dist/js/interfaces/repo/IUser"
import { Response } from "pro-web-common/dist/js/Response"
import { createChallenge } from "../utils/challenger"
import { ResponseMessages } from "pro-web-common/dist/js/enums/ResponseMessages"
import { encryptChallenge } from "../utils/encryptChallenge"
const log = console.log
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
        log("output from getChallenge", getResp)
        if(getResp.Data === null) {
            let userResp = await this.repo.checkUsernameUnique(username)
            log(`requestLogin: isUserUnique ${username}`, userResp)
            // if the username is unique, then return without creating challenge
            if(userResp.Data) {
                resp.Message = ResponseMessages.NotFound.toString()
                resp.Data = null
                return resp                
            }
            let challenge = createChallenge()
            let createResp = await this.repo.createChallenge(username, challenge)
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
        if(userResp.IsError) {
            resp.Message = userResp.Message
            return resp
        }
        console.log("this is the publickey", userResp.Data)
        resp.Data = await encryptChallenge(resp.Data, userResp.Data.publicKey)
        return resp
    }
    async login(username, challenge) {
        const resp = new Response<boolean>()
        const verified = await this.repo.verifyChallenge(username, challenge)
        console.log("verified in core service/user.login", verified)
        if(verified.IsError) {
            return verified
        }
        if(!verified.Data) {
            return verified
        }
        const loggedIn = await this.repo.setLogin(username)
        if(loggedIn.IsError) {
            console.log("Error updating last login:", loggedIn)
        }
        console.log("logged in core service/user.login", loggedIn)
        return loggedIn
    }
    logout(username) {
        return this.repo.setLogout(username)
    }
    getChallenge(username) {
        return this.repo.getChallenge(username)
    }
    get(username) {
        return this.repo.get(username)
    }
}