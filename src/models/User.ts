import { IUser } from "../interfaces/models/IUser"

export class User implements IUser {
    username: string | null = null
    isAdmin: boolean = false
    publicKey: string | null =  null
    id: number = 0
    constructor(username: string = null, publicKey: string = null, id: number = 0, isAdmin: boolean = false) {
        this.username = username
        this.isAdmin = isAdmin
        this.publicKey = publicKey
        this.id = id
    }
}