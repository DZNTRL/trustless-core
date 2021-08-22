import { Response } from "../models/Response";
import { ISQLUtils } from "../interfaces/sql/IUtils";

export const SQLUtils: ISQLUtils = {
    query: function<T>(pool, statement, params, onResolve, onReject) {
        const resp = new Response<T>()
        return new Promise((resolve, reject) => {
            pool.query(statement, params, (err, result) => {
                if(err) {
                    resp.IsError = true
                    //@ts-ignore
                    resp.Message = err
                    return reject(onReject(err))
                }            
                resp.Data = result
                resolve(onResolve(resp))
            });    
        })
    }

}