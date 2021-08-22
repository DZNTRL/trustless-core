import mysql from "mysql2"
import { IResponse } from "../IResponse"
import { QueryParameter } from "../constants/Types"
export interface ISQLUtils {
    query: <T>(
        pool: mysql.Pool,
        statement: string,
        params: Array<QueryParameter>,
        resolve: (resp: IResponse<T>) => void,
        reject: (resp: IResponse<T>) => void
    ) => Promise<IResponse<T>>
}
