import { Response } from "../models/Response";
import { ISQLUtils } from "../interfaces/repo/IUtils";

export const Utils: ISQLUtils = {
    query: function<T>(pool, statement, params) {
        const resp = new Response<T>()
        return new Promise((resolve, reject) => {
            pool.query(statement, params)
                .then(result => {
                    resolve(new Response(result))
                })
                .catch(err => {
                    reject(new Response(null, `${err.message} ${err.sqlMessage}`, true))
                })
        })
    }

}