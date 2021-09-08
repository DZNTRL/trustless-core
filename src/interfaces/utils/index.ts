import mysql from "mysql2/promise"

export interface IUtils {
    createChallenge: () => string
    createPool: (poolOptions: mysql.PoolOptions) => mysql.Pool
}