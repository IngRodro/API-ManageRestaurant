import { createPool, Pool } from 'mysql2/promise'

export async function connect(): Promise<Pool> {
    const connection =  createPool({
        host: 'localhost',
        user: 'root', 
        password: 'root',
        database: 'restaurant', 
        connectionLimit: 20
    });
    return connection;
}