import { IUser } from "pro-web-common/dist/js/interfaces/models/IUser"

export class User implements IUser {
    username: string | null = null
    isAdmin: boolean = false
    publicKey: string | null =  null
    id: number = 0
    lastLogin: Date | null
    lastLogout: Date | null
    constructor(username: string = null, publicKey: string = null, id: number = 0, isAdmin: boolean = false, lastLogin: Date | null, lastLogout: Date | null) {
        this.username = username
        this.isAdmin = isAdmin
        this.publicKey = publicKey
        this.id = id
        this.lastLogin = lastLogin
        this.lastLogout = lastLogout
    }
}