import { Response } from "pro-web-common/dist/js/Response";
import { ISQLUtils } from "pro-web-common/dist/js/interfaces/repo/IUtils";

export const Utils: ISQLUtils = {
    query: function<T>(pool, statement, params) {
        console.log("pool", pool.query)
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