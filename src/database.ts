import { createPool, Pool } from 'mysql2/promise';

export default async function connect(): Promise<Pool> {
  return createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'restaurant',
    connectionLimit: 20,
  });
}
