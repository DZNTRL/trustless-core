import { Pool } from "mysql"
import { IAdmin } from "./IAdmin"
const sqlCreateUser = `
    INSERT INTO Accounts
`
export class Admin implements IAdmin {
    pool: Pool
    constructor(pool: Pool) {
        this.pool = pool
    }
}