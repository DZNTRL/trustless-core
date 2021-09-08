import mysql from "mysql2/promise"

export const createPool = (poolOptions: mysql.PoolOptions) => mysql.createPool(poolOptions)