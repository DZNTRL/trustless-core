import mysql from "mysql2/promise"
import { IResponse } from "../IResponse"
import { QueryParameter } from "../constants/Types"
export interface ISQLUtils {
    query: <T>(
        pool: mysql.Pool,
        statement: string,
        params: Array<QueryParameter>
    ) => Promise<IResponse<T>>
}
