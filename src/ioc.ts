import { User as UserRepo } from "./repo/User"
import { IUser as IUserRepo } from "./interfaces/repo/IUser"
import mysql from "mysql2/promise"

export interface IInjections {
    UserRepo: (pool: mysql.Pool) => IUserRepo
}

export const defaultInjections: () => IInjections = () => {
    return {
        UserRepo: pool => new UserRepo(pool)
    }
}
