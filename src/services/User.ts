import { IUser } from "../interfaces/service/IUser"
import { IUser as IUserRepo } from "../interfaces/repo/IUser"
import mysql from "mysql2/promise"

import { defaultInjections as ioc } from "../ioc"
export class User implements IUser {
    repo: IUserRepo
    constructor(pool: mysql.Pool) {
        this.repo = ioc().UserRepo(pool)
    }
    checkUsernameUnique(username) {
        return this.repo.checkUsernameUnique(username)
    }
}