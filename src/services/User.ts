import { IUser } from "pro-web-common/dist/js/interfaces/service/IUser"
import { IUser as IUserRepo } from "pro-web-common/dist/js/interfaces/repo/IUser"
import { IUser as IModel } from "pro-web-common/dist/js/interfaces/models/IUser"
import { Response } from "pro-web-common/dist/js/Response"
import { createChallenge } from "../utils/challenger"
import { ResponseMessages } from "pro-web-common/dist/js/enums/ResponseMessages"
import { encryptChallenge } from "../utils/encryptChallenge"
import { readKey } from "openpgp"
import { IResponse } from "pro-web-common/dist/js/interfaces/IResponse"

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
        var resp = new Response<number>(0)
        return new Promise<IResponse<number>>(async (res) => {
            try {
                await readKey({ armoredKey: publicKey });
                res(await this.repo.createUser(username, publicKey))
            } catch {
                resp.IsError = true
                resp.Message = ResponseMessages.InvalidPublicKey.toString()
                res(resp)
            }
        })
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
        const resp = new Response<IModel>()
        const verified = await this.repo.verifyChallenge(username, challenge)
        if(verified.IsError) {
            resp.Message = verified.Message
            resp.IsError = true
            return resp
        }
        if(!verified.Data) {
            resp.Message = ResponseMessages.DataError.toString()
            return resp
        }
        const loggedIn = await this.repo.setLogin(username)
        if(loggedIn.IsError) {
            console.log("Error updating last login:", loggedIn)
            resp.IsError = true
            resp.Message = loggedIn.Message
            return resp
        }
        console.log("logged in core service/user.login", loggedIn)
        const userResp = await this.repo.get(username)
        if(userResp.IsError) {
            console.log(`could not fetch user ${username}`)
            resp.IsError = true
            resp.Message = userResp.Message
        }
        return userResp
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